<?php
/**
 * Fallback template for a static Page whose slug is "blog" (used if the site's Reading
 * Settings assign a static "Blog" page rather than relying on home.php's native
 * posts-index behavior). Renders identical content to home.php — see
 * template-parts/blog-index.php for the shared markup, ported from src/pages/Blog.tsx.
 */
get_header();
get_template_part('template-parts/blog-index');
get_footer();
