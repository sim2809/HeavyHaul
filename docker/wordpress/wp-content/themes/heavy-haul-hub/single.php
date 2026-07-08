<?php
/**
 * Standard WordPress single-post template. Ported from src/pages/BlogPost.tsx.
 *
 * SEO: the original used manual <Helmet> tags reading seo_title/seo_description/og_image/
 * no_index fields. That's intentionally NOT reimplemented here — once Yoast SEO is
 * installed (Phase 8, separate from this port), it owns <title>/meta description/OG tags/
 * robots via the post's real title/content/featured image, which this template already
 * renders correctly. wp_head() (called from header.php) is where Yoast hooks in.
 *
 * The JSON-LD Article schema from BlogPost.tsx IS ported directly below (a plain
 * <script type="application/ld+json"> tag, independent of Yoast) since it's simple,
 * self-contained, and not something Yoast needs to own.
 */
get_header();

while (have_posts()) : the_post();
    $hh_post_id = get_the_ID();
    $hh_author_name = get_the_author();
    $hh_og_image = get_the_post_thumbnail_url($hh_post_id, 'large');

    $hh_ld_json = array_filter([
        '@context' => 'https://schema.org',
        '@type' => 'Article',
        'headline' => get_the_title(),
        'datePublished' => get_the_date('c'),
        'author' => $hh_author_name ? ['@type' => 'Person', 'name' => $hh_author_name] : null,
        'image' => $hh_og_image ?: null,
    ]);
    ?>
    <script type="application/ld+json"><?php echo wp_json_encode($hh_ld_json); ?></script>

    <article class="bg-background">
        <section class="bg-secondary text-secondary-foreground py-12 lg:py-16">
            <div class="container-tight max-w-3xl">
                <a href="<?php echo esc_url(home_url('/blog')); ?>" class="inline-flex items-center gap-2 text-primary text-xs uppercase font-bold tracking-widest hover:text-primary-glow">
                    <?php echo hh_lucide('arrow-left', 'h-3 w-3'); ?> All Posts
                </a>
                <h1 class="stencil text-3xl sm:text-5xl font-bold uppercase mt-4"><?php the_title(); ?></h1>
                <div class="mt-4 flex items-center gap-4 text-xs text-white/60 uppercase tracking-widest">
                    <span class="inline-flex items-center gap-1.5"><?php echo hh_lucide('calendar', 'h-3 w-3 text-primary'); ?> <?php echo esc_html(get_the_date('F j, Y')); ?></span>
                    <?php if ($hh_author_name) : ?>
                        <span>By <?php echo esc_html($hh_author_name); ?></span>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <?php if (has_post_thumbnail()) : ?>
            <div class="container-tight max-w-4xl -mt-6 relative z-10">
                <img src="<?php echo esc_url(get_the_post_thumbnail_url($hh_post_id, 'large')); ?>" alt="<?php the_title_attribute(); ?>" class="w-full rounded-md shadow-card aspect-[16/9] object-cover">
            </div>
        <?php endif; ?>

        <section class="py-14 lg:py-20">
            <div class="container-tight max-w-3xl prose prose-lg prose-headings:font-display prose-headings:uppercase prose-a:text-primary prose-img:rounded-md">
                <?php the_content(); ?>
            </div>

            <div class="container-tight max-w-3xl mt-12 pt-8 border-t border-border text-center">
                <?php hh_button('Get A Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4 inline-block'), home_url('/contact#quote'), 'hero', 'xl'); ?>
            </div>
        </section>
    </article>
    <?php
endwhile;

get_footer();
