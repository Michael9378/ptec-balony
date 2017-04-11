<?php
/*
Template Name: Find A Builder Template
*/
?>

<?php while (have_posts()) : the_post(); ?>
	<?php get_template_part('templates/section', 'builder-form'); ?>
	<?php get_template_part('templates/section', 'builder-map'); ?>
	<?php get_template_part('templates/section', 'builder-results'); ?>
<?php endwhile; ?>