<header class="banner navbar navbar-default navbar-fixed-top" role="banner">
  <div id="headerTop">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="search pull-right">
            <?php get_search_form(); ?>
          </div>

          <ul class="list-inline pull-right" id="socialIcons">
            <li><a target="_blank" href="https://www.facebook.com/PebbleTechnology" alt="Facebook" title="Facebook"><i class="fa fa-facebook"></i></a></li>
            <li><a target="_blank" href="https://twitter.com/Pebble_Tec" alt="Twitter" title="Twitter"><i class="fa fa-twitter"></i></a></li>
            <li><a target="_blank" href="https://www.pinterest.com/pebbletecIntl/" alt="Pinterest" title="Pinterest"><i class="fa fa-pinterest"></i></a></li>
            <li><a target="_blank" href="http://www.houzz.com/pro/ptmarketing/pebble-tec-superior-quality-pool-finishes" alt="Houzz" title="Houzz"><i class="fa fa-houzz"></i></a></li>
            <li><a target="_blank" href="http://www.zillow.com/profile/Pebble-Technology/" alt="Zillow" title="Zillow"><span class="icon-zillow"></span></a></li>
            <li><a target="_blank" href="https://www.linkedin.com/company/pebble-technology-international" alt="LinkedIn" title="LinkedIn"><i class="fa fa-linkedin"></i></a></li>
          </ul>

          <ul class="list-inline pull-right" id="headerTopNav">
            <!-- <li><a href="/for-builders">For Builders</a></li>
            <li><a href="/for-applicators">For Applicators</a></li> -->
            <li><a href="/why-pebble-tec/about-us">About</a></li>
            <li><a href="/contact-us">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="navbar-header" id="mainNav">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/logo.png"></a>
    </div>

    <nav class="collapse navbar-collapse pull-right" role="navigation">
      <?php
        if (has_nav_menu('primary_navigation')) :
          wp_nav_menu(array('theme_location' => 'primary_navigation', 'walker' => new Roots_Nav_Walker(), 'menu_class' => 'nav navbar-nav'));
        endif;
      ?>
    </nav>
  </div>
</header>
