<?php
/**
 * Shared render helpers used across templates. Ports the shadcn `button.tsx` cva variants
 * (Tailwind class strings — no interactivity to port, Radix's Slot/asChild has no PHP
 * equivalent need since every call site here just needs a plain <a>/<button>) and small
 * formatting utilities used throughout the original React components.
 */

const HH_BUTTON_BASE = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

const HH_BUTTON_VARIANTS = [
    'default'     => 'bg-primary text-primary-foreground hover:bg-primary/90',
    'destructive' => 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    'outline'     => 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    'secondary'   => 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    'ghost'       => 'hover:bg-accent hover:text-accent-foreground',
    'link'        => 'text-primary underline-offset-4 hover:underline',
    'hero'        => 'bg-gradient-amber text-primary-foreground shadow-cta hover:shadow-glow hover:brightness-110 font-bold uppercase tracking-wide',
    'call'        => 'bg-white text-secondary border-2 border-white hover:bg-primary hover:border-primary hover:text-primary-foreground font-bold uppercase tracking-wide',
];

const HH_BUTTON_SIZES = [
    'default' => 'h-10 px-4 py-2',
    'sm'      => 'h-9 rounded-md px-3',
    'lg'      => 'h-11 rounded-md px-8',
    'xl'      => 'h-14 rounded-md px-8 text-base',
    'icon'    => 'h-10 w-10',
];

function hh_button_classes(string $variant = 'default', string $size = 'default', string $extra = ''): string {
    $variant_class = HH_BUTTON_VARIANTS[$variant] ?? HH_BUTTON_VARIANTS['default'];
    $size_class = HH_BUTTON_SIZES[$size] ?? HH_BUTTON_SIZES['default'];
    return trim(HH_BUTTON_BASE . ' ' . $variant_class . ' ' . $size_class . ' ' . $extra);
}

/**
 * Renders an <a> styled as a button (every CTA in the original app is a link, not a
 * <button>, since they all navigate or anchor-scroll).
 */
function hh_button(string $label, string $href = '#', string $variant = 'default', string $size = 'default', string $extra_classes = '', array $attrs = []): void {
    $classes = hh_button_classes($variant, $size, $extra_classes);
    $attr_str = '';
    foreach ($attrs as $key => $value) {
        $attr_str .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
    }
    printf(
        '<a href="%s" class="%s"%s>%s</a>',
        esc_url($href),
        esc_attr($classes),
        $attr_str,
        $label // trusted internal markup (may include inline icon SVGs) — not user input.
    );
}

function hh_button_html(string $label, string $href = '#', string $variant = 'default', string $size = 'default', string $extra_classes = '', array $attrs = []): string {
    ob_start();
    hh_button($label, $href, $variant, $size, $extra_classes, $attrs);
    return ob_get_clean();
}

/** Same visual variants as hh_button(), but renders a real <button> for form submission. */
function hh_submit_button(string $label, string $variant = 'hero', string $size = 'xl', string $extra_classes = '', array $attrs = []): void {
    $classes = hh_button_classes($variant, $size, $extra_classes);
    $attr_str = '';
    foreach ($attrs as $key => $value) {
        $attr_str .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
    }
    printf(
        '<button type="submit" class="%s"%s>%s</button>',
        esc_attr($classes),
        $attr_str,
        $label
    );
}

/** Phone number formatting — mirrors StickyCall.tsx / useSiteSettings.tsx's toTelHref(). */
function hh_tel_href(string $phone): string {
    $digits = preg_replace('/[^0-9+]/', '', $phone);
    return 'tel:' . $digits;
}

/**
 * ACF get_field() wrapper that degrades gracefully if ACF PRO isn't active yet — every
 * template can call this instead of function_exists() checks everywhere.
 */
function hh_field($selector, $post_id = false, $format_value = true) {
    if (!function_exists('get_field')) {
        return null;
    }
    return get_field($selector, $post_id, $format_value);
}

function hh_option($selector, $format_value = true) {
    if (!function_exists('get_field')) {
        return null;
    }
    return get_field($selector, 'option', $format_value);
}

/** Renders a Lucide-equivalent inline SVG icon by name, falling back to a generic dot.
 * Only the small set actually used across ported templates needs to be listed here —
 * add more as templates are ported. Mirrors how CmsSections.tsx resolves `Icons[name]`.
 */
function hh_icon(string $name, string $classes = 'w-5 h-5'): void {
    // ACF "icon" fields store the Lucide *React* component name (PascalCase, e.g. "ChevronDown")
    // to match the original `Icons[name]` lookups — normalize to the kebab-case keys
    // inc/icons.php's hh_lucide() uses.
    $kebab = strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', $name));
    if (function_exists('hh_lucide') && isset(HH_LUCIDE_PATHS[$kebab])) {
        echo hh_lucide($kebab, $classes); // phpcs:ignore -- trusted local map, not user input
        return;
    }

    $icon_file = HH_THEME_DIR . '/assets/icons/' . $kebab . '.svg';
    if (file_exists($icon_file)) {
        $svg = file_get_contents($icon_file);
        $svg = preg_replace('/<svg /', '<svg class="' . esc_attr($classes) . '" ', $svg, 1);
        echo $svg; // phpcs:ignore -- trusted local file, not user input
    } else {
        printf('<span class="inline-block rounded-full bg-current opacity-50 %s"></span>', esc_attr($classes));
    }
}

/**
 * Renders a WP-registered nav menu location the same way CmsMenu.tsx did: top-level items
 * only, external-URL detection for target=_blank, a fallback callback if the location has
 * no assigned menu (or no items) yet.
 */
function hh_nav_menu(string $location, string $wrapper = 'ul', string $wrapper_class = '', string $item_class = '', ?callable $fallback = null): void {
    $locations = get_nav_menu_locations();
    $menu_id = $locations[$location] ?? 0;
    $items = $menu_id ? wp_get_nav_menu_items($menu_id) : false;

    if (empty($items)) {
        if ($fallback) {
            $fallback();
        }
        return;
    }

    $item_tag = $wrapper === 'ul' ? 'li' : 'div';
    printf('<%1$s class="%2$s">', tag_escape($wrapper), esc_attr($wrapper_class));
    foreach ($items as $item) {
        if ((int) $item->menu_item_parent !== 0) {
            continue; // top-level only, matches CmsMenu.tsx
        }
        $is_external = (bool) preg_match('#^https?://#', $item->url) || $item->target === '_blank';
        printf(
            '<%1$s><a href="%2$s" class="%3$s"%4$s>%5$s</a></%1$s>',
            tag_escape($item_tag),
            esc_url($item->url),
            esc_attr($item_class),
            $is_external ? ' target="_blank" rel="noopener noreferrer"' : '',
            esc_html($item->title)
        );
    }
    printf('</%s>', tag_escape($wrapper));
}

/** Truncated/short excerpt helper matching the original `formatDate()` in src/lib/blog.ts. */
function hh_format_date(string $date_string): string {
    $timestamp = strtotime($date_string);
    if (!$timestamp) {
        return '';
    }
    return date_i18n('F j, Y', $timestamp);
}
