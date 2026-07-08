<?php
/**
 * Generic fallback template (required by every WP theme). Specific templates
 * (front-page.php, page-about.php, single-service_category.php, etc.) take priority
 * per WordPress's template hierarchy — this only renders if nothing more specific matches.
 */
get_header();
?>
<div class="container-tight py-16">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <article <?php post_class('mb-12'); ?>>
            <h1 class="stencil text-3xl mb-4"><?php the_title(); ?></h1>
            <div class="prose prose-lg max-w-none"><?php the_content(); ?></div>
        </article>
    <?php endwhile; else : ?>
        <p>Nothing found.</p>
    <?php endif; ?>
</div>
<?php get_footer(); ?>
