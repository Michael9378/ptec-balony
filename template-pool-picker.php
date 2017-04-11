<?php
/*
Template Name: Pool Picker Template
*/
?>

<?php while (have_posts()) : the_post(); ?>
	<div class="container">
  		<?php get_template_part('templates/content', 'page'); ?>
  	</div>
<?php endwhile; ?>

<?php get_template_part('templates/content', 'pool-picker-ie'); ?>