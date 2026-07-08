<?php
/**
 * "Site Content" options pages — one per legacy Supabase `site_content.page_key`
 * (header, footer, home, dispatchers, faq, guarantees, trust, services, about). Each is a
 * repeater of {block_key, label, kind, content, style} rows, exactly mirroring the old
 * `site_content` table and useSiteContent.tsx's `get(page, block, fallback)` pattern — so
 * Home.tsx/About.tsx/Contact.tsx's ~150 total content strings port over as a straight
 * key-for-key content migration (see Phase 10's scripted import) instead of inventing a
 * new field per string.
 */

const HH_SITE_CONTENT_PAGE_KEYS = [
    'header' => 'Header',
    'footer' => 'Footer',
    'home' => 'Home Page',
    'dispatchers' => 'Dispatch Team',
    'faq' => 'FAQ',
    'guarantees' => 'Guarantees',
    'trust' => 'Trust Strip',
    'services' => 'Services Index',
    'about' => 'About Page',
];

if (function_exists('acf_add_local_field_group')) {
    acf_add_options_page([
        'page_title' => 'Site Content',
        'menu_title' => 'Site Content',
        'menu_slug' => 'acf-options-site-content',
        'capability' => 'edit_posts',
        'position' => 3,
        'icon_url' => 'dashicons-editor-textcolor',
        'redirect' => true,
    ]);

    foreach (HH_SITE_CONTENT_PAGE_KEYS as $page_key => $page_label) {
        acf_add_options_page([
            'page_title' => "Site Content: {$page_label}",
            'menu_title' => $page_label,
            'menu_slug' => "acf-options-{$page_key}",
            'parent_slug' => 'acf-options-site-content',
            'capability' => 'edit_posts',
            // Explicit post_id — without this ACF options pages all default to the SAME
            // shared "options" storage bucket, which would make every page_key's "items"
            // field collide/overwrite the others.
            'post_id' => "hh_site_content_{$page_key}",
        ]);

        acf_add_local_field_group([
            'key' => "group_hh_site_content_{$page_key}",
            'title' => "Site Content — {$page_label}",
            'fields' => [
                hh_items_repeater("hh_site_content_{$page_key}", 'Content Blocks', array_merge([
                    ['key' => "field_hh_sc_{$page_key}_block_key", 'name' => 'block_key', 'label' => 'Block Key', 'type' => 'text', 'required' => 1,
                        'instructions' => 'Matches the key used in the template, e.g. "hero_title_line1". Do not rename existing keys unless updating the corresponding template.'],
                    ['key' => "field_hh_sc_{$page_key}_label", 'name' => 'label', 'label' => 'Editor Label', 'type' => 'text'],
                    ['key' => "field_hh_sc_{$page_key}_kind", 'name' => 'kind', 'label' => 'Field Type', 'type' => 'select',
                        'choices' => ['text' => 'Short text', 'textarea' => 'Long text', 'html' => 'HTML'], 'default_value' => 'text'],
                    ['key' => "field_hh_sc_{$page_key}_content", 'name' => 'content', 'label' => 'Content', 'type' => 'textarea', 'rows' => 3],
                ], hh_style_subfields("hh_sc_{$page_key}"))),
            ],
            'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => "acf-options-{$page_key}"]]],
        ]);
    }
}

/**
 * PHP equivalent of useSiteContent.tsx's get(page, block, fallback). Loads a page_key's
 * repeater once per request and caches it, so calling this dozens of times per template
 * (About.tsx-equivalent templates call its React counterpart ~90 times) only hits
 * get_field() once per page_key.
 */
function hh_content(string $page, string $block, string $fallback = ''): string {
    static $cache = [];

    if (!isset($cache[$page])) {
        $cache[$page] = [];
        $rows = function_exists('get_field') ? get_field('items', "hh_site_content_{$page}") : null;
        if (!is_array($rows)) {
            $rows = [];
        }
        foreach ($rows as $row) {
            if (!empty($row['block_key'])) {
                $cache[$page][$row['block_key']] = $row['content'] ?? '';
            }
        }
    }

    $value = $cache[$page][$block] ?? '';
    return $value !== '' ? $value : $fallback;
}

/**
 * Style override for a given page/block, matching styleByKey in useSiteContent.tsx.
 * Returns an inline `style="..."` string (empty if no override set), ready to echo.
 */
function hh_content_style(string $page, string $block): string {
    static $style_cache = [];

    if (!isset($style_cache[$page])) {
        $style_cache[$page] = [];
        $rows = function_exists('get_field') ? get_field('items', "hh_site_content_{$page}") : null;
        if (!is_array($rows)) {
            $rows = [];
        }
        foreach ($rows as $row) {
            if (!empty($row['block_key'])) {
                $style_cache[$page][$row['block_key']] = $row['style'] ?? null;
            }
        }
    }

    $style = $style_cache[$page][$block] ?? null;
    if (empty($style)) {
        return '';
    }

    $css = [];
    if (!empty($style['color'])) $css[] = 'color:' . $style['color'];
    if (!empty($style['background_color'])) $css[] = 'background-color:' . $style['background_color'];
    if (!empty($style['font_size'])) $css[] = 'font-size:' . $style['font_size'];
    if (!empty($style['font_weight'])) $css[] = 'font-weight:' . $style['font_weight'];
    if (!empty($style['font_family'])) $css[] = 'font-family:' . $style['font_family'];
    if (!empty($style['text_align'])) $css[] = 'text-align:' . $style['text_align'];
    if (!empty($style['letter_spacing'])) $css[] = 'letter-spacing:' . $style['letter_spacing'];
    if (!empty($style['line_height'])) $css[] = 'line-height:' . $style['line_height'];

    return $css ? ' style="' . esc_attr(implode(';', $css)) . '"' : '';
}

/**
 * PHP equivalent of the original <EC page k defaultText as className /> component —
 * echoes the content wrapped in the given tag, with any style override applied.
 */
function hh_ec(string $page, string $block, string $default_text = '', string $as = 'span', string $class = ''): void {
    $content = hh_content($page, $block, $default_text);
    $style = hh_content_style($page, $block);
    printf(
        '<%1$s%2$s%3$s>%4$s</%1$s>',
        tag_escape($as),
        $class ? ' class="' . esc_attr($class) . '"' : '',
        $style,
        wp_kses_post($content)
    );
}
