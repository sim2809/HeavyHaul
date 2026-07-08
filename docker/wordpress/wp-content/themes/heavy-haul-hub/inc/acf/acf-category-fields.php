<?php
/**
 * Field groups for the `service_category` (11 posts) and `service_subcategory` (40 posts)
 * CPTs — the real content backing Category.tsx/ServiceDetail.tsx/SubCategory.tsx. A
 * `template_type` select on service_category picks which single-service_category.php
 * branch renders it (freight vs. service), mirroring NON_FREIGHT_SLUGS today.
 */

if (!function_exists('acf_add_local_field_group')) {
    return; // ACF (PRO) not active yet.
}

acf_add_local_field_group([
    'key' => 'group_hh_service_category',
    'title' => 'Service Category Details',
    'fields' => [
        ['key' => 'field_hh_cat_template_type', 'name' => 'template_type', 'label' => 'Template Type', 'type' => 'select',
            'choices' => ['freight' => 'Freight (Category.tsx style)', 'service' => 'Service (ServiceDetail.tsx style)'],
            'default_value' => 'freight', 'required' => 1,
            'instructions' => 'Freight categories get state-variant pages (/services/{cat}/state/{state}) and an equipment/gallery layout. Service categories get the richer pillars/steps/FAQ layout.'],
        ['key' => 'field_hh_cat_short', 'name' => 'short', 'label' => 'Short Name', 'type' => 'text', 'instructions' => 'Used in nav menus and cards, e.g. "Construction"'],
        ['key' => 'field_hh_cat_blurb', 'name' => 'blurb', 'label' => 'Blurb', 'type' => 'textarea', 'rows' => 2],
        ['key' => 'field_hh_cat_hero_image', 'name' => 'hero_image', 'label' => 'Hero / Card Image', 'type' => 'image', 'return_format' => 'array'],

        ['key' => 'field_hh_cat_tab_freight', 'label' => 'Freight Template Fields', 'type' => 'tab'],
        ['key' => 'field_hh_cat_equipment_list', 'name' => 'equipment_list', 'label' => 'Equipment List (one per line)', 'type' => 'textarea', 'rows' => 8,
            'instructions' => 'Long-tail SEO equipment names, e.g. "Mini Excavators". One per line.'],
        hh_items_repeater('hh_cat_gallery', 'Gallery', [
            ['key' => 'field_hh_cat_gallery_item_src', 'name' => 'src', 'label' => 'Image', 'type' => 'image', 'return_format' => 'array'],
            ['key' => 'field_hh_cat_gallery_item_alt', 'name' => 'alt', 'label' => 'Alt Text', 'type' => 'text'],
        ]),

        ['key' => 'field_hh_cat_tab_service', 'label' => 'Service Template Fields', 'type' => 'tab'],
        ['key' => 'field_hh_cat_eyebrow', 'name' => 'eyebrow', 'label' => 'Eyebrow', 'type' => 'text'],
        ['key' => 'field_hh_cat_hero_badge', 'name' => 'hero_badge', 'label' => 'Hero Badge', 'type' => 'text'],
        ['key' => 'field_hh_cat_hero_title_lead', 'name' => 'hero_title_lead', 'label' => 'Hero Title (lead)', 'type' => 'text'],
        ['key' => 'field_hh_cat_hero_title_accent', 'name' => 'hero_title_accent', 'label' => 'Hero Title (accent)', 'type' => 'text'],
        ['key' => 'field_hh_cat_hero_sub', 'name' => 'hero_sub', 'label' => 'Hero Subtitle', 'type' => 'textarea', 'rows' => 2],
        ['key' => 'field_hh_cat_intro_title', 'name' => 'intro_title', 'label' => 'Intro Title', 'type' => 'text'],
        ['key' => 'field_hh_cat_intro_body', 'name' => 'intro_body', 'label' => 'Intro Body (one paragraph per line)', 'type' => 'textarea', 'rows' => 6],
        hh_items_repeater('hh_cat_pillars', 'Pillars', [
            ['key' => 'field_hh_cat_pillar_icon', 'name' => 'icon', 'label' => 'Icon (Lucide name)', 'type' => 'text'],
            ['key' => 'field_hh_cat_pillar_title', 'name' => 'title', 'label' => 'Title', 'type' => 'text'],
            ['key' => 'field_hh_cat_pillar_desc', 'name' => 'desc', 'label' => 'Description', 'type' => 'textarea', 'rows' => 2],
        ]),
        hh_items_repeater('hh_cat_steps', 'How It Works Steps', [
            ['key' => 'field_hh_cat_step_t', 'name' => 't', 'label' => 'Title', 'type' => 'text'],
            ['key' => 'field_hh_cat_step_d', 'name' => 'd', 'label' => 'Description', 'type' => 'textarea', 'rows' => 2],
        ]),
        ['key' => 'field_hh_cat_highlights', 'name' => 'highlights', 'label' => "What's Included (one per line)", 'type' => 'textarea', 'rows' => 8],
        hh_items_repeater('hh_cat_stats', 'Stats', [
            ['key' => 'field_hh_cat_stat_v', 'name' => 'v', 'label' => 'Value', 'type' => 'text'],
            ['key' => 'field_hh_cat_stat_l', 'name' => 'l', 'label' => 'Label', 'type' => 'text'],
        ]),
        ['key' => 'field_hh_cat_facts_title', 'name' => 'facts_title', 'label' => 'Facts Title', 'type' => 'text'],
        ['key' => 'field_hh_cat_facts', 'name' => 'facts', 'label' => 'Facts (one per line)', 'type' => 'textarea', 'rows' => 6],
        hh_items_repeater('hh_cat_faqs', 'FAQs', [
            ['key' => 'field_hh_cat_faq_q', 'name' => 'q', 'label' => 'Question', 'type' => 'text'],
            ['key' => 'field_hh_cat_faq_a', 'name' => 'a', 'label' => 'Answer', 'type' => 'textarea', 'rows' => 2],
        ]),
        ['key' => 'field_hh_cat_cta_title', 'name' => 'cta_title', 'label' => 'CTA Banner Title', 'type' => 'text'],
        hh_items_repeater('hh_cat_service_gallery', 'Service Gallery', [
            ['key' => 'field_hh_cat_sg_src', 'name' => 'src', 'label' => 'Image', 'type' => 'image', 'return_format' => 'array'],
            ['key' => 'field_hh_cat_sg_title', 'name' => 'title', 'label' => 'Title', 'type' => 'text'],
            ['key' => 'field_hh_cat_sg_desc', 'name' => 'desc', 'label' => 'Description', 'type' => 'textarea', 'rows' => 2],
        ]),
    ],
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'service_category']]],
]);

acf_add_local_field_group([
    'key' => 'group_hh_service_subcategory',
    'title' => 'Service Subcategory Details',
    'fields' => [
        ['key' => 'field_hh_sub_parent_category', 'name' => 'parent_category', 'label' => 'Parent Category', 'type' => 'post_object',
            'post_type' => ['service_category'], 'return_format' => 'id', 'required' => 1],
        ['key' => 'field_hh_sub_blurb', 'name' => 'blurb', 'label' => 'Blurb', 'type' => 'textarea', 'rows' => 2],
        ['key' => 'field_hh_sub_custom_template', 'name' => 'custom_template', 'label' => 'Custom Template', 'type' => 'select',
            'choices' => ['' => 'Default (SubCategory.tsx style)', 'tractor' => 'Tractor (bespoke featured template)'],
            'allow_null' => 1, 'default_value' => '',
            'instructions' => 'Only "tractor-transport" under Agricultural uses the bespoke template today.'],
        hh_items_repeater('hh_sub_brands', 'Brands We Transport', [
            ['key' => 'field_hh_sub_brand_name', 'name' => 'name', 'label' => 'Brand Name', 'type' => 'text'],
        ]),
        hh_items_repeater('hh_sub_trailers', 'Trailer Types', [
            ['key' => 'field_hh_sub_trailer_name', 'name' => 'name', 'label' => 'Trailer Type', 'type' => 'text'],
        ]),
    ],
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'service_subcategory']]],
]);

/** Helpers to read a repeater of {name} rows back into a flat string[] list. */
function hh_repeater_names(array $rows, string $key = 'name'): array {
    return array_values(array_filter(array_map(fn($r) => $r[$key] ?? '', $rows)));
}

function hh_lines(string $text): array {
    return array_values(array_filter(array_map('trim', explode("\n", $text))));
}
