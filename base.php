<?php get_template_part('templates/head'); ?>
<body <?php body_class(); ?>>

  <!--[if lt IE 8]>
    <div class="alert alert-warning">
      <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'roots'); ?>
    </div>
  <![endif]-->

  <?php
    do_action('get_header');
    get_template_part('templates/header');
  ?>

  <div class="wrap" role="document">
    <?php $heroURL = is_home() ? get_post_meta(5, 'hero-img-url', true) : get_post_meta($post->ID, 'hero-img-url', true);
    if(empty($heroURL)){$heroURL = 'http://www.pebbletec.com.php53-11.ord1-1.websitetestlink.com/wp-content/themes/pebbletec/assets/img/pebble-tec-hero.png';}?>
    <div id="hero" style="background-image: url('<?php echo ($heroURL); ?>');">
      <div class="hero-overlay">
        <div class="container"><span class="page-title"><?php echo (is_home() ? get_post_meta(5, 'hero-overlay-text', true) : get_post_meta($post->ID, 'hero-overlay-text', true)); ?></span></div>
      </div>
      <div id="breadcrumbs" class="hidden-sm hidden-xs">
        <div class="container">
          <?php if(function_exists('the_breadcrumbs')) the_breadcrumbs(); ?>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="content row">
        <main class="main" role="main">
          <?php include roots_template_path(); ?>
        </main><!-- /.main -->
        <?php if (roots_display_sidebar()) : ?>
          <aside class="sidebar" role="complementary">
            <?php include roots_sidebar_path(); ?>
          </aside><!-- /.sidebar -->
        <?php endif; ?>
      </div><!-- /.content -->
    </div><!-- /.wrap -->
  </div>

  <?php get_template_part('templates/footer'); ?>

  <?php wp_footer(); ?>

</body>
</html>
