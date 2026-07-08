<?php
/**
 * WordPress's native posts-index template (renders the blog listing whenever Reading
 * Settings has "Your homepage displays" set to "A static page" with a separate "Posts page"
 * assigned, or by default when no static front page is configured at all). front-page.php
 * handles the actual marketing homepage, so this file is purely the blog index.
 *
 * Ported from src/pages/Blog.tsx. Shared markup lives in template-parts/blog-index.php so
 * this file and page-blog.php (the fallback used if a static "Blog" page is assigned
 * instead of a native posts page) stay identical.
 */
get_header();
get_template_part('template-parts/blog-index');
get_footer();
