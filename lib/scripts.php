<?php
/**
 * Scripts and stylesheets
 *
 * Enqueue stylesheets in the following order:
 * 1. /theme/assets/css/main.css
 *
 * Enqueue scripts in the following order:
 * 1. jquery-1.11.1.min.js via Google CDN
 * 2. /theme/assets/js/vendor/modernizr.min.js
 * 3. /theme/assets/js/scripts.js
 *
 * Google Analytics is loaded after enqueued scripts if:
 * - An ID has been defined in config.php
 * - You're not logged in as an administrator
 */
function roots_scripts() {

  /* IMPORTANT */

  /* main.css is css that was compiled from less. we stopped using less when we moved to a
  shared hosting server, and all new css is now in main-non-compiled.css */

  $assets = array(
    'css'                   => '/assets/css/main.css',
    'bootstrap-slider-css'  => '/assets/vendor/seiyria-bootstrap-slider/css/bootstrap-slider.css',
    'css-non-compiled'      => '/assets/css/main-non-compiled.css',
    'font-awesome'          => '//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
    'js'                    => '/assets/js/scripts.js',
    'main-js'               => '/assets/js/main.js',
    'modernizr'             => '/assets/vendor/modernizr/modernizr.js',
    'jquery'                => '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.js',
    'bootstrap-slider-js'   => '/assets/vendor/seiyria-bootstrap-slider/js/bootstrap-slider.js',
    'cycle2'                => '/assets/js/vendor/jquery.cycle2.min.js',
    'cycle2-carousel'       => '/assets/js/vendor/jquery.cycle2.carousel.js',
    'parsley'               => '//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.4.3/parsley.min.js',
    'google-maps'           => '//maps.googleapis.com/maps/api/js?key=AIzaSyBxs3Iab6XLR5jP4mC75fsE3UFf3KJsIJU',
  );

  wp_enqueue_style('roots_css', get_template_directory_uri() . $assets['css'], false, null);
  wp_enqueue_style('bootstrap-slider', get_template_directory_uri() . $assets['bootstrap-slider-css'], false, null);
  wp_enqueue_style('font-awesome', $assets['font-awesome'], false, null);
  wp_enqueue_style('new_css', get_template_directory_uri() . $assets['css-non-compiled'], false, null);

  /**
   * jQuery is loaded using the same method from HTML5 Boilerplate:
   * Grab Google CDN's latest jQuery with a protocol relative URL; fallback to local if offline
   * It's kept in the header instead of footer to avoid conflicts with plugins.
   */
  if (!is_admin() && current_theme_supports('jquery-cdn')) {
    wp_deregister_script('jquery');
    wp_register_script('jquery', $assets['jquery'], array(), null, true);
    add_filter('script_loader_src', 'roots_jquery_local_fallback', 10, 2);
  }

  if (is_single() && comments_open() && get_option('thread_comments')) {
    wp_enqueue_script('comment-reply');
  }

  wp_enqueue_script('modernizr', get_template_directory_uri() . $assets['modernizr'], array(), null, true);
  wp_enqueue_script('jquery');
  wp_enqueue_script('cycle2', get_template_directory_uri() . $assets['cycle2'], array(), null, true);
  wp_enqueue_script('cycle2-carousel', get_template_directory_uri() . $assets['cycle2-carousel'], array(), null, true);
  wp_enqueue_script('bootstrap-slider', get_template_directory_uri() . $assets['bootstrap-slider-js'], array(), null, true);
  wp_enqueue_script('roots_js', get_template_directory_uri() . $assets['js'], array(), null, true);
  wp_enqueue_script('parsley', $assets['parsley'], array('jquery'), null, true);
  wp_enqueue_script('google-maps', $assets['google-maps'], array(), null, true);
  wp_enqueue_script('main_js', get_template_directory_uri() . $assets['main-js'], array('jquery', 'parsley', 'google-maps'), null, true);
}
add_action('wp_enqueue_scripts', 'roots_scripts', 100);

// http://wordpress.stackexchange.com/a/12450
function roots_jquery_local_fallback($src, $handle = null) {
  static $add_jquery_fallback = false;

  if ($add_jquery_fallback) {
    echo '<script>window.jQuery || document.write(\'<script src="' . get_template_directory_uri() . '/assets/vendor/jquery/dist/jquery.min.js?1.11.1"><\/script>\')</script>' . "\n";
    $add_jquery_fallback = false;
  }

  if ($handle === 'jquery') {
    $add_jquery_fallback = true;
  }

  return $src;
}
add_action('wp_head', 'roots_jquery_local_fallback');

/**
 * Google Analytics snippet from HTML5 Boilerplate
 *
 * Cookie domain is 'auto' configured. See: http://goo.gl/VUCHKM
 */
function roots_google_analytics() { ?>
<script>
  <?php if (WP_ENV === 'production') : ?>
    (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
    function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
    e=o.createElement(i);r=o.getElementsByTagName(i)[0];
    e.src='//www.google-analytics.com/analytics.js';
    r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
  <?php else : ?>
    function ga() {
      console.log('GoogleAnalytics: ' + [].slice.call(arguments));
    }
  <?php endif; ?>
  ga('create','<?php echo GOOGLE_ANALYTICS_ID; ?>','auto');ga('send','pageview');
</script>

<?php }
if (GOOGLE_ANALYTICS_ID && (WP_ENV !== 'production' || !current_user_can('manage_options'))) {
  add_action('wp_footer', 'roots_google_analytics', 20);
}
