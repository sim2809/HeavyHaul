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

/**
 * Inline-styled HTML email matching the site's own palette (src/index.css: --primary
 * 45 100% 50% = #FFBF00 amber, --secondary 0 0% 7% = #121212 near-black) and the
 * dark-header-with-white-logo look of header.php. Table-based layout + inline styles
 * throughout, since email clients don't reliably support <style> blocks or flexbox/grid.
 */
function hh_build_lead_notification_html(array $lead, int $post_id): string {
    $labels = [
        'name' => 'Name', 'phone' => 'Phone', 'email' => 'Email',
        'origin' => 'Origin', 'destination' => 'Destination',
        'equipment' => 'Equipment', 'message' => 'Message',
        'source' => 'Source', 'page_url' => 'Page',
    ];
    $rows = '';
    foreach ($labels as $key => $label) {
        if (empty($lead[$key])) continue;
        $rows .= '<tr>'
            . '<td style="padding:10px 16px;border-bottom:1px solid #eee;font:600 12px/1.4 Arial,Helvetica,sans-serif;'
            . 'text-transform:uppercase;letter-spacing:.05em;color:#7a7a7a;white-space:nowrap;vertical-align:top;">'
            . esc_html($label) . '</td>'
            . '<td style="padding:10px 16px;border-bottom:1px solid #eee;font:400 15px/1.5 Arial,Helvetica,sans-serif;color:#141414;">'
            . nl2br(esc_html($lead[$key])) . '</td>'
            . '</tr>';
    }

    $edit_url = admin_url("post.php?post={$post_id}&action=edit");

    return '<div style="background:#f4f4f4;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">'
        . '<tr><td style="background:#121212;padding:24px;text-align:center;">'
        . '<span style="font:700 22px/1 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#ffffff;">'
        . 'Heavy Haul <span style="color:#FFBF00;">Hub</span></span>'
        . '</td></tr>'
        . '<tr><td style="background:#FFBF00;height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>'
        . '<tr><td style="padding:28px 16px 8px;">'
        . '<div style="display:inline-block;background:#FFBF00;color:#141414;font:700 11px/1 Arial,Helvetica,sans-serif;'
        . 'text-transform:uppercase;letter-spacing:.08em;padding:6px 10px;border-radius:4px;margin-bottom:12px;">New Quote Request</div>'
        . '<h1 style="margin:12px 0 0;font:700 22px/1.3 Arial,Helvetica,sans-serif;color:#141414;">'
        . esc_html($lead['name'] ?: 'New lead') . '</h1>'
        . '</td></tr>'
        . '<tr><td style="padding:8px 0 24px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $rows . '</table>'
        . '</td></tr>'
        . '<tr><td style="padding:0 16px 28px;">'
        . '<a href="' . esc_url($edit_url) . '" style="display:inline-block;background:#121212;color:#ffffff;'
        . 'font:700 13px/1 Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.05em;'
        . 'padding:12px 20px;border-radius:4px;text-decoration:none;">View in wp-admin</a>'
        . '</td></tr>'
        . '<tr><td style="background:#f9f9f9;padding:16px;text-align:center;font:400 12px/1.5 Arial,Helvetica,sans-serif;color:#999;">'
        . 'Heavy Haul Hub &middot; ' . esc_html(current_time('F j, Y g:i a'))
        . '</td></tr>'
        . '</table></div>';
}

/**
 * Reads config from a getenv() var if set (docker-compose locally), falling back to a
 * same-named PHP constant (define()'d in wp-config.php) for hosts like Cloudways that
 * disable putenv()/have no per-app environment variable mechanism.
 */
function hh_env(string $name): string {
    $value = getenv($name);
    if ($value !== false && $value !== '') return $value;
    return defined($name) ? (string) constant($name) : '';
}

function hh_send_lead_notification_email(array $lead, int $post_id): void {
    $resend_key = hh_env('RESEND_API_KEY');
    if (!$resend_key) {
        error_log('RESEND_API_KEY not set — skipping lead notification email');
        return;
    }
    $to = hh_env('HH_LEAD_NOTIFICATION_EMAIL') ?: 'galstyan.simon12@gmail.com';
    $html = hh_build_lead_notification_html($lead, $post_id);

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

            hh_send_lead_notification_email($lead, $post_id);

            return rest_ensure_response(['ok' => true, 'id' => $post_id]);
        },
    ]);
});
