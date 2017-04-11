<article <?php post_class(); ?>>
	<div class="row">
		<div class="article-left col-md-2 hidden-sm hidden-xs">
			<?php get_template_part('templates/article-date'); ?>
		</div>
		<div class="article-right col-md-10">
			<div class="post-thumbnail">
				<?php if (has_post_thumbnail()) { ?>
					<?php the_post_thumbnail(); ?>
				<?php } ?>
			</div>
			<header>
			    <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			    <?php get_template_part('templates/entry-meta'); ?>
		  	</header>
		  	<div class="entry-summary">
			    <?php the_excerpt(); ?>
			</div>
			<div class="read-more">
				<a href="">Read More <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></a>
		</div>
	</div>
</article>
