<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1">
  <link rel="alternate" type="application/rss+xml" title="<?php echo get_bloginfo('name'); ?> Feed" href="<?php echo esc_url(get_feed_link()); ?>">
  <link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico" />

  <?php if( get_the_ID()==25 ): ?>
	  <meta property="og:url"           content="http://www.pebbletec.com/inspirational-tools/water-color-picker/" />
		<meta property="og:type"          content="website" />
		<meta property="og:title"         content="Water Color Tool - Pebble Tec" />
		<meta property="og:description"   content="I found the perfect finish at pebbletec.com" />
		<meta property="og:image"         content="http://www.pebbletec.com/wp-content/themes/pebbletec/assets/img/literallytheentirepoolpicker/Tec/TahoeBlue.png" />
  <?php endif; ?>
  <?php wp_head(); ?>
</head>
