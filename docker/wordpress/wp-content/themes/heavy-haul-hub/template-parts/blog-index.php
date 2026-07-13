<?php
/**
 * Shared blog-index markup, ported from src/pages/Blog.tsx. Included by both home.php
 * (WordPress's native posts-index template) and page-blog.php (fallback template used if
 * Reading Settings assigns a static "Blog" page instead) so both render identically.
 *
 * Uses its own dedicated WP_Query against real `post` type posts instead of the original's
 * usePosts() React Query hook — NOT the global $wp_query loop (have_posts()/the_post()),
 * since on a static Page (page-blog.php) the global loop contains the Page itself, not any
 * posts, which was rendering a single fake "post" card titled after the page. If there are
 * no real posts yet, the same 4 hardcoded fallback posts from Blog.tsx's `fallbackPosts`
 * const are rendered so the page never looks empty before real content is added.
 */

$hh_blog_query = new WP_Query([
    'post_type' => 'post',
    'post_status' => 'publish',
    'posts_per_page' => -1,
    'no_found_rows' => true,
]);

$hh_fallback_posts = [
    ['slug' => 'oversize-load-permits-101', 'title' => 'Oversize Load Permits 101, What Every Shipper Should Know', 'excerpt' => 'A practical guide to state permits, escort cars, and routing for heavy haul shipments.', 'date' => 'May 28, 2026', 'image' => 'cat-construction.jpg'],
    ['slug' => 'agricultural-equipment-transport-guide', 'title' => 'Moving Combines & Tractors, Agricultural Transport Done Right', 'excerpt' => 'Heads, headers, and harvest deadlines, here\'s how we move farm equipment safely.', 'date' => 'May 12, 2026', 'image' => 'cat-agricultural.jpg'],
    ['slug' => 'semi-truck-relocation-tips', 'title' => 'Relocating A Semi Truck Fleet? Read This First.', 'excerpt' => 'Drive-away vs. hauled transport, costs, timing, and DOT compliance explained.', 'date' => 'April 30, 2026', 'image' => 'cat-trucks.jpg'],
    ['slug' => 'industrial-machinery-rigging', 'title' => 'Rigging Heavy Industrial Machinery For Long-Haul Transport', 'excerpt' => 'Tie-downs, dunnage, and air-ride trailers, what protects your CNC on a 1,500-mile run.', 'date' => 'April 14, 2026', 'image' => 'cat-industrial.jpg'],
];
?>
<section class="bg-secondary text-secondary-foreground py-14 lg:py-20">
    <div class="container-tight max-w-5xl">
        <p class="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Heavy Haul Blog</p>
        <h1 class="stencil text-4xl sm:text-6xl font-bold uppercase">
            News, Guides &amp; <span class="text-primary">Field Stories</span>
        </h1>
        <p class="mt-4 text-white/75 max-w-2xl text-lg">
            Practical, plain-spoken articles from the dispatchers, drivers, and shippers who keep America's heavy iron moving.
        </p>
        <div class="mt-7">
            <?php hh_button('Get A Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4 inline-block'), home_url('/contact#quote'), 'hero', 'xl'); ?>
        </div>
    </div>
</section>

<section class="py-14 sm:py-20 bg-background">
    <div class="container-tight grid sm:grid-cols-2 gap-6">
        <?php if ($hh_blog_query->have_posts()) : ?>
            <?php while ($hh_blog_query->have_posts()) : $hh_blog_query->the_post(); ?>
                <a href="<?php echo esc_url(get_permalink()); ?>" class="group flex flex-col overflow-hidden rounded-md border border-border bg-card hover:border-primary hover:shadow-card transition-all">
                    <div class="relative aspect-[16/10] overflow-hidden bg-muted">
                        <?php if (has_post_thumbnail()) : ?>
                            <img src="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(), 'large')); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <?php endif; ?>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                            <?php echo hh_lucide('calendar', 'h-3.5 w-3.5 text-primary'); ?> <?php echo esc_html(get_the_date('F j, Y')); ?>
                        </div>
                        <h2 class="font-display text-xl sm:text-2xl uppercase leading-tight group-hover:text-primary transition-colors"><?php the_title(); ?></h2>
                        <?php if ($hh_excerpt = get_the_excerpt()) : ?>
                            <p class="text-sm text-muted-foreground mt-3"><?php echo esc_html($hh_excerpt); ?></p>
                        <?php endif; ?>
                    </div>
                </a>
            <?php endwhile; ?>
            <?php wp_reset_postdata(); ?>
        <?php else : ?>
            <?php foreach ($hh_fallback_posts as $p) : ?>
                <article class="group flex flex-col overflow-hidden rounded-md border border-border bg-card">
                    <div class="relative aspect-[16/10] overflow-hidden bg-muted">
                        <img src="<?php echo esc_url(HH_THEME_URI . '/assets/img/' . $p['image']); ?>" alt="<?php echo esc_attr($p['title']); ?>" loading="lazy" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                            <?php echo hh_lucide('calendar', 'h-3.5 w-3.5 text-primary'); ?> <?php echo esc_html($p['date']); ?>
                        </div>
                        <h2 class="font-display text-xl sm:text-2xl uppercase leading-tight"><?php echo esc_html($p['title']); ?></h2>
                        <p class="text-sm text-muted-foreground mt-3"><?php echo esc_html($p['excerpt']); ?></p>
                    </div>
                </article>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <div class="container-tight mt-12 text-center">
        <?php hh_button('Get A Free Quote ' . hh_lucide('arrow-right', 'h-4 w-4 inline-block'), home_url('/contact#quote'), 'hero', 'xl'); ?>
    </div>
</section>
