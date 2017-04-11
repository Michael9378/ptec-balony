<?php
/*
Template Name: Product Template
*/
?>

<?php while (have_posts()) : the_post(); ?>
	<div class="container">
  		<?php get_template_part('templates/content', 'page'); ?>
  	</div>
  	<hr>
<?php endwhile; ?>

<?php get_template_part('templates/content', 'product'); ?>