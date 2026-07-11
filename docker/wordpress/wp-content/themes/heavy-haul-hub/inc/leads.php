<?php
/**
 * Quote/lead form storage — moved here from Supabase (see git history for the prior
 * submit-lead edge function approach). Leads are stored as a `hh_lead` CPT so they're
 * manageable directly in wp-admin, with no external service dependency for storage.
 *
 * Email notification is still sent via Resend's HTTP API (not wp_mail()/PHP mail()),
 * since a bare Docker WordPress container has no configured MTA — wp_mail() would
 * silently fail to actually deliver anything. Configure via the RESEND_API_KEY and
 * HH_LEAD_NOTIFICATION_EMAIL environment variables (see docker-compose.yml), never
 * hardcoded here since this theme directory is git-tracked in a public repo.
 */

add_action('init', function () {
    register_post_type('hh_lead', [
        'labels' => [
            'name'          => 'Leads',
            'singular_name' => 'Lead',
            'menu_name'     => 'Leads',
        ],
        'public'            => false,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'menu_icon'         => 'dashicons-phone',
        'supports'          => ['title'],
        'capability_type'   => 'post',
        'map_meta_cap'      => true,
    ]);
});

add_filter('manage_hh_lead_posts_columns', function ($columns) {
    $columns['hh_phone'] = 'Phone';
    $columns['hh_route'] = 'Route';
    $columns['hh_source'] = 'Source';
    return $columns;
});

add_action('manage_hh_lead_posts_custom_column', function ($column, $post_id) {
    switch ($column) {
        case 'hh_phone':
            echo esc_html(get_post_meta($post_id, 'phone', true));
            break;
        case 'hh_route':
            $origin = get_post_meta($post_id, 'origin', true);
            $destination = get_post_meta($post_id, 'destination', true);
            echo esc_html(trim("{$origin} \xE2\x86\x92 {$destination}", " \xE2\x86\x92"));
            break;
        case 'hh_source':
            echo esc_html(get_post_meta($post_id, 'source', true));
            break;
    }
}, 10, 2);

function hh_send_lead_notification_email(array $lead): void {
    $resend_key = getenv('RESEND_API_KEY');
    if (!$resend_key) {
        error_log('RESEND_API_KEY not set — skipping lead notification email');
        return;
    }
    $to = getenv('HH_LEAD_NOTIFICATION_EMAIL') ?: 'galstyan.simon12@gmail.com';

    $labels = [
        'name' => 'Name', 'email' => 'Email', 'phone' => 'Phone',
        'origin' => 'Origin', 'destination' => 'Destination',
        'equipment' => 'Equipment', 'message' => 'Message',
        'source' => 'Source', 'page_url' => 'Page',
    ];
    $rows = '';
    foreach ($labels as $key => $label) {
        if (!empty($lead[$key])) {
            $rows .= '<tr><td><strong>' . esc_html($label) . '</strong></td><td>' . esc_html($lead[$key]) . '</td></tr>';
        }
    }
    $html = '<h2>New quote request</h2><table>' . $rows . '</table>';

    $res = wp_remote_post('https://api.resend.com/emails', [
        'headers' => [
            'Authorization' => 'Bearer ' . $resend_key,
            'Content-Type' => 'application/json',
        ],
        'body' => wp_json_encode([
            'from' => 'Heavy Haul Hub <onboarding@resend.dev>',
            'to' => [$to],
            'subject' => 'New quote request' . (!empty($lead['name']) ? " from {$lead['name']}" : ''),
            'html' => $html,
        ]),
        'timeout' => 10,
    ]);

    if (is_wp_error($res)) {
        error_log('Resend notification failed: ' . $res->get_error_message());
    } elseif (wp_remote_retrieve_response_code($res) >= 300) {
        error_log('Resend notification failed (' . wp_remote_retrieve_response_code($res) . '): ' . wp_remote_retrieve_body($res));
    }
}

add_action('rest_api_init', function () {
    register_rest_route('hh/v1', '/submit-lead', [
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => function (WP_REST_Request $request) {
            $params = $request->get_json_params() ?: [];

            $lead = [
                'name' => sanitize_text_field($params['name'] ?? ''),
                'email' => sanitize_email($params['email'] ?? ''),
                'phone' => sanitize_text_field($params['phone'] ?? ''),
                'origin' => sanitize_text_field($params['origin'] ?? ''),
                'destination' => sanitize_text_field($params['destination'] ?? ''),
                'equipment' => sanitize_text_field($params['equipment'] ?? ''),
                'message' => sanitize_textarea_field($params['message'] ?? ''),
                'source' => sanitize_text_field($params['source'] ?? 'website'),
                'page_url' => esc_url_raw($params['page_url'] ?? ''),
            ];

            if (empty($lead['name']) || empty($lead['phone'])) {
                return new WP_Error('hh_missing_fields', 'Name and phone are required.', ['status' => 400]);
            }

            $post_id = wp_insert_post([
                'post_type' => 'hh_lead',
                'post_title' => sprintf('%s — %s', $lead['name'], current_time('Y-m-d H:i')),
                'post_status' => 'publish',
                'meta_input' => $lead,
            ], true);

            if (is_wp_error($post_id)) {
                return new WP_Error('hh_insert_failed', 'Could not save lead.', ['status' => 500]);
            }

            hh_send_lead_notification_email($lead);

            return rest_ensure_response(['ok' => true, 'id' => $post_id]);
        },
    ]);
});
