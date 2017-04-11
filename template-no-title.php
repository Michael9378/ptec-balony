<?php
/*
Template Name: No Page Title Template
*/
?>

<div class="col-sm-7">
	<?php while (have_posts()) : the_post(); ?>
		<?php get_template_part('templates/content', 'page'); ?>
	<?php endwhile; ?>
</div>

<?php get_template_part('templates/product', 'sidebar' ); ?>
