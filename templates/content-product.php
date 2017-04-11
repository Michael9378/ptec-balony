<?php
	$slug = get_post_meta($post->ID, 'product-category', true);
	$category = get_term_by('slug', $slug, 'product_cat');

	$args = array(
		'post_type'	=> 'product',
		'tax_query' => array(
			array(
					'taxonomy' 	=> 'product_cat',
					'field'		=> 'slug',
					'terms' 	=> $slug
			),
		),
	);

	$products = new WP_Query($args);
?>

<div class="container product-content-template">
	<div class="row">
		<div class="col-sm-7 available-colors <?php echo $slug; ?>">
			<div class="row">
				<h3>Available Colors</h3>

				<?php while ( $products->have_posts() ) : $products->the_post(); ?>
					<?php $img_url = $url = wp_get_attachment_url( get_post_thumbnail_id($post->ID) ); ?>
					<div class="col-lg-3 col-md-4 col-xs-6 single-product-swatch">
						<a href="#" data-toggle="modal" data-target="#<?php echo $post->post_name; ?>">
							<img src="<?php echo $img_url; ?>" />
							<div class="swatch-overlay hidden-sm hidden-xs">
								<p><?php echo get_the_title(); ?></p>
								<p><em>(Click for Details)</em></p>
							</div>
						</a>
					</div>
				<?php endwhile; ?>
				<?php wp_reset_postdata(); ?>
			</div>
			<div class="row" style = "text-align: center;">
				<?php
				// get finishes brochures
				$finishBrochure = "/wp-content/uploads/2016/12/54206_Pebbletech_Brochure_LR.pdf";
				// if pebble brilliance, load different brochure in
				if( is_page(2477) ) {
					$finishBrochure = "/wp-content/uploads/2016/11/PTI-PebbleBrilliance-Broch-08-15-16_LR.pdf";
				}
				?>
				<div class="col-md-6"><a class="btn teal-button" href="<?php echo $finishBrochure; ?>" target="_new">Download Brochure</a></div>
				<div class="col-md-6"><a class="btn teal-button" href="<?php echo get_post_meta($post->ID, 'gallery-link', true); ?>" target="_blank">View Gallery</a></div>
				<!--<div class="col-md-4 col-md-offset-4" style="text-align: center;"><a href="<?php echo get_post_meta($post->ID, 'gallery-link', true); ?>" target="_blank">Visit the gallery for more product photography</a></div>-->
			</div>
		</div>
		<?php get_template_part('templates/product', 'sidebar' ); ?>
	</div>
</div>


<!-- create the modals -->
<?php while ( $products->have_posts() ) : $products->the_post(); ?>
	<?php $post_name = $post->post_name; ?>
	<!-- Modal -->
	<div class="modal fade color-popout" id="<?php echo $post_name; ?>" tabindex="-1" role="dialog" aria-hidden="true">
	  	<div class="modal-dialog">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        		<h4 class="modal-title" id="myModalLabel"><?php echo get_the_title(); ?></h4>
	      		</div>
	      		<div class="modal-body">

	      			<!-- image gallery -->
                	<div id="<?php echo $post_name . '-slider'; ?>" class="carousel slide product-gallery" data-ride="carousel" data-interval="false">
					  	<!-- Wrapper for slides -->
						 <div class="carousel-inner" role="listbox">
						 	<?php
				        		$images = get_post_meta( $post->ID, '_cmb_gallery_images', true );
		                    	$ndx = 0;
		                	?>
						 	<?php foreach ($images as $image) { ?>
						 		<div class="<?php echo ($ndx == 0) ? 'item active' : 'item'; ?>">
							      	<img src="<?php echo $image['image'];?>" alt="<?php echo $image['title'];?>" class="img-rounded">
							    </div>
							    <?php $ndx++ ?>
						 	<?php } ?>
						 </div>

					  	<!-- Controls -->
					  	<a class="left carousel-control" href="#<?php echo $post_name . '-slider'; ?>" role="button" data-slide="prev">
					    	<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
					    	<span class="sr-only">Previous</span>
					  	</a>
					  	<a class="right carousel-control" href="#<?php echo $post_name . '-slider'; ?>" role="button" data-slide="next">
					    	<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
					    	<span class="sr-only">Next</span>
					  	</a>
					</div>

					<!-- product description -->
					<p class="product-description">
						<img src="<?php echo get_post_meta ( $post->ID, '_cmb_color_family_image', true);?>" alt="" class="img-rounded pull-left">
						<?php echo get_post_meta ( $post->ID, '_cmb_product_description', true);?>

						<div class="clearfix"></div>
					</p>

					<?php
					// if no brochure url is provided, then default to brochure-2.
					// other wise, use the provided link

					$brochureLink = "/wp-content/themes/pebbletec/assets/img/pebble-tec-brochure-2.pdf";
					$passedURL = get_post_meta ( $post->ID, '_cmb_brochure_url', true);
					// check if passed url is atleast 5 characters long, then replace brochure link with passed url.
					if( strlen($passedURL) > 4 ) {
						$brochureLink = $passedURL;
					}
					?>

					<!-- product links and depth image -->
					<div class="product-links">
						<img src="<?php echo get_post_meta ( $post->ID, '_cmb_depth_image', true);?>" alt="" class="pull-right">
						<ul class="list-unstyled">
							<li><a class="btn btn-black" href="<?php echo($brochureLink); ?>" target="_blank" role="button">Download Brochure</a></li>
							<li><a class="btn btn-black" href="/find-a-builder" role="button">Find A Builder</a></li>
							<li><a class="btn btn-black" href="/inspirational-tools/water-color-picker/" role="button">Water Color Selection Tool</a></li>
						</ul>

						<div class="clearfix"></div>
					</div>

		      	</div>
	    	</div>
	  	</div>
	</div>
<?php endwhile; ?>
