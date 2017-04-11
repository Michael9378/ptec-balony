<?php
	// get finish choices
	$color_args = array(
	    'orderby'           => 'name',
	    'order'             => 'ASC',
	    'hide_empty'		=> false
	);
	$colorsUnordered = get_terms( 'water_color', $color_args );
	// custom reorder from darkest to lightest
	// order is deep dark blue, dark blue, medium blue, green, teal, then light blue.
	$colors = array(
	    $colorsUnordered[1],
	    $colorsUnordered[0],
	    $colorsUnordered[4],
	    $colorsUnordered[2],
	    $colorsUnordered[5],
	    $colorsUnordered[3]
	);

?>

<!-- we may need to print this page. include css for printed page -->
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/assets/css/poolpickerprint.css" type="text/css" media="print" />

<div class="container">
	<div class="row">
		<div id="colorPicker" class="carousel slide" data-interval="false">

		  	<!-- Wrapper for slides -->
		  	<div class="carousel-inner">
		  		<!-- Pool Color Slide -->
			    <div class="item active" id="poolColor">
			    	<!-- Slide Header -->
					<div class="col-md-12 pool-page-header">
						<span class="step-number">1</span>
						<h3>Choose your</h3>
						<h2>Water Color</h2>
						
						<div class="breadcrumbs">
							<div>
								<h4>YOUR SELECTIONS</h4>
								<p class="">Water Color: &emsp;&nbsp;<span class="italian">Not selected</span></p>
								<p class="">Finish Texture: &nbsp;&nbsp;<span class="italian">Not selected</span></p>
							</div>
							<a class="btn teal-button" disabled>PRINT<br>RESULTS</a>
						</div>

						<hr>
					</div>
					<div>
						<!-- Loop through finish choices and display options -->
						<?php foreach ( $colors as $color ) { ?>
							<a data-water-color="<?php echo $color->slug; ?>" class="color-choice">
								<div class="col-md-4 <?php echo $color->slug; ?>">
									<div class="color-holder cursor">
										<div class="color-example"></div>
										<h3><?php echo $color->name; ?> Water</h3>
									</div>
								</div>
							</a>
						<?php } ?>
					</div>
			    </div>
			    <!-- End Pool Color Slide -->

			    <!-- Pool Finish Slide -->
			    <div class="item" id="poolFinish">
			    	<div>
						<div class="col-md-12 pool-page-header">
							<span class="step-number">2</span>
							<h3>Choose your</h3>
							<h2>Finish texture</h2>
						
						<div class="breadcrumbs">
							<div>
								<h4>YOUR SELECTIONS</h4>
								<p class="waterColor">Water Color: &emsp;&nbsp;<span>Not selected</span></p>
								<p class="">Finish Texture: &nbsp;&nbsp;<span class="italian">Not selected</span></p>
							</div>
							<a class="btn teal-button" disabled>PRINT<br>RESULTS</a>
						</div>

  						<hr>
						</div>
					</div>
					<!-- Holder for ajax content -->
						<div id="finishHolder">

						</div>
			    </div>
			    <!-- End Pool Finish Slide -->

			    <!-- Pool Visualizer Slide -->
			    <div class="item" id="poolFinal">
					<div class="col-md-12 pool-page-header">
						<span class="step-number">3</span>
						<h3>Your recommended</h3>
						<h2>Finishes</h2>
						
						<div class="breadcrumbs">
							<div>
								<h4>YOUR SELECTIONS</h4>
								<p class="waterColor">Water Color: &emsp;&nbsp;<span>Not selected</span></p>
								<p class="finishColor">Finish Texture: &nbsp;&nbsp;<span>Not selected</span></p>
							</div>
							<a class="btn teal-button" onclick="window.print()">PRINT<br>RESULTS</a>
						</div>

  					<hr>
					</div>
					<div id="" class="col-md-4">
						<img style="width: 100px;" src="<?php echo get_template_directory_uri(); ?>/assets/poolpicker/pool-studio.png"/>
					</div>
					<div class="clearfix"></div>
					<!-- Pool Visualizer -->
					<div class="col-md-8" id="poolPicker">
						<div id="theEntirePoolPickerInOneImage" class="inner-holder">
						</div>
						<!-- End Inner Holder -->
						<!-- Area under pool visualizer -->
						<div class="pool-caption">
							<!-- shimmer sea stuff -->
							<div class="capt-content">
								<em style="font-size:12px;">The finish consists of pebbles and cement and will vary in color, shade, consistency and exposure. The color and shade will very throughout the day as the sunlight reflects from different angles.</em>
							</div>
						</div>
					</div>
					<!-- End Pool Visualizer -->

					<!-- Pool Customization Panel -->
					<div class="col-md-4">
				    	<div class="panel panel-default" id="customizePanel">
						  	<div class="panel-heading">Choose Finish</div>
						  	<div class="panel-body form-horizontal">
						  		<div class="form-group">
								    <div class="col-sm-2"></div>
								   	<div class="col-sm-8">
								   		<!-- Filled with AJAX response -->
								      	<select class="form-control" name="finish" id="poolFinishes">
										</select>
								    </div>
							  	</div>
							  	<div class="form-group">
								    <div class="col-sm-6 col-sm-offset-3 text-center">
								      	<button type="submit" class="btn btn-default" id="updatePool">Customize</button>
								    </div>
							  	</div>
						  	</div>
						</div>

						<div class="pool-caption">
							<!-- shimmer sea stuff -->
							<div class="capt-content">
								<h2>About Your Finish: <span id="currentFinish"></span></h2>
								<p id="currentDescription">Pebble Tec® brand pool finish is the original pebble pool finish and still delivers the enduring natural elegance and durability that combines beauty with exceptional value.</p>
								<a id="finishGalleryLink" href="#" class="btn teal-button" target="_blank">View pools with this finish</a>
								<div class="fb-share-button" data-href="http://www.pebbletec.com/inspirational-tools/water-color-picker/" data-layout="button" data-size="large" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.pebbletec.com%2Finspirational-tools%2Fwater-color-picker%2F&amp;src=sdkpreparse">Share</a></div>
							</div>
						</div>
					</div>
					<!-- End pool customization panel -->
			  	</div>
			  	<!-- End Pool Visualizer Slide -->
			</div>
			<!-- Close Wrapper -->
		</div>
		<!-- End Color Picker -->
	</div><!-- end row and container -->
</div>

<section id="recommendedAddOns" class="final-page-show">
	<div class="container">
		<div class="row">
			<!-- Recommended Add Ons section -->
			<div class="col-md-12">
				<!-- Title updated when pool is updated -->
				<!-- <h2>Recommended add-ons: </h2> -->
				<span class="product-disclamer">Recommended products that complement this finish</span>
				<div class="row finishing-touches-title">
					<div class="col-md-6 text-center">
						<img class="logo-title" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishingtouch.png"/>
					</div>
					<div class="col-md-6 text-center hidden-md hidden-xs">
						<img class="logo-title" src="<?php echo get_template_directory_uri(); ?>/assets/img/firewater.png"/>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6">
						<!-- Filled with AJAX request -->
						<ul class="media-list" id="finishingTouches"></ul>
					</div>
					<div class="col-md-6 text-center visible-md visible-xs">
						<img class="logo-title" src="<?php echo get_template_directory_uri(); ?>/assets/img/firewater.png"/>
					</div>
					<!-- TODO: Fill with Fire and water elements from backend -->
					<div class="col-md-6">
						<ul class="media-list">
						  	<li class="media">
						    	<div class="media-left">
						        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/fire-bowls.png" alt="Fire Bowls">
						    	</div>
						    	<div class="media-body">
						     		 <h4 class="media-heading"><strong>Fire Bowls</h4></strong>
						     		 <p>FIre bowls are compatible with natural gas or propane, and designed to provide 60,000-80,000 BTU/HR . Choose between automated electronic or manual ignition.</p>

						    	</div>
						  	</li>
						  	<li class="media">
						    	<div class="media-left">
						        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/water-bowls.png" alt="Water Bowls">
						    	</div>
						    	<div class="media-body">
						     		 <h4 class="media-heading"><strong>Water Bowls</h4></strong>
						     		 <p>Transform your outdoor living environment with the sound of flowing water. Lay back and relax to the tranquil stream or let the kids play under the flowing waterfall.</p>

						    	</div>
						  	</li>
						  	<li class="media">
						    	<div class="media-left">
						        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/fire-and-water-bowls.png" alt="Fire and Water Bowls">
						    	</div>
						    	<div class="media-body">
						     		 <h4 class="media-heading"><strong>Fire and Water Bowls</h4></strong>
						     		 <p>Enjoy the best of both worlds with the warmth of fire flames mixed with the sound of falling water. Create an inviting paradise and upgrade your outdoor space with these fire &amp; water bowls.</p>

						    	</div>
						  	</li>
						  	<li class="media">
						    	<div class="media-left">
						        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/fire-pits.png" alt="Fire Pits">
						    	</div>
						    	<div class="media-body">
						     		 <h4 class="media-heading"><strong>Fire Pits</h4></strong>
						     		 <p>Add warmth and ambiance to your outdoor space and achieve a stunning nighttime atmosphere with these eye-catching fire pits, perfect for entertaining.</p>

						    	</div>
						  	</li>
						</ul>
					</div>
				</div>
			</div>
			<!-- End Recommended Add Ons-->
		</div>
	</div>
</section>

<section id="whatsNext" class="final-page-show">
	<div class="container">
		<div class="row">
			<!-- Recommended Add Ons section -->
			<div class="col-md-3">
				<h2 class="text-uppercase">What's Next?</h2>
			</div>
			<div class="col-md-9" style="margin:20px 0 10px 0;">
				<button type="button" class="btn btn-primary" onclick="location.reload();">START OVER&nbsp;&nbsp;<i class="fa fa-undo"></i></button>
				<a href="<?php echo get_template_directory_uri(); ?>/assets/img/pebble-tec-brochure-2.pdf" target="_blank"><button type="button" class="btn btn-primary">DOWNLOAD BROCHURE&nbsp;&nbsp;<i class="fa fa-download"></i></button></a>
				<a href="/find-a-builder"><button type="button" class="btn btn-primary">FIND A BUILDER&nbsp;&nbsp;<i class="fa fa-search"></i></button></a>
			</div>
		</div>
	</div>
</section>

<section id="printableResults">

	<div class="print-header">
		<div class="half">
			<img src="<?php echo get_template_directory_uri(); ?>/assets/img/logo.png">
		</div>
		<div class="half">
			<h3>WATER COLOR TOOL</h3>
			<h1>SELECTION RESULTS</h1>
		</div>
	</div>

	<div class="water-color">
		<div class="half">
			<h2>WATER COLOR</h2>
		</div>
		<div class="half">
			<h4 id="printWater">Light Blue</h4>
		</div>
	</div>

	<div class="finish">
		<div class="half">
			<h2>FINISH</h2>
		</div>
		<div class="half">
			<h4 id="printFinish">Pebbles</h4>
			<p id="printFinishDesc">Description about pebbles</p>
		</div>
	</div>

	<div class="finish">
		<div class="half">
			<h2>RECOMMENDED PRODUCTS</h2>
		</div>
		<div class="half">
			<h4>Finishing touches</h4>
			<!-- Filled with AJAX response -->
			<ul class="media-list" id="printFinishingTouches"></ul>

			<h4>Fire + Water Elements</h4>
			<ul class="media-list">
		  	<li class="media">
		    	<div class="media-left">
		        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/fire-bowls.png" alt="Fire Bowls">
		    	</div>
		    	<div class="media-body">
		     		 <h4 class="media-heading"><strong>Fire Bowls</strong></h4>
		     		 <p>FIre bowls are compatible with natural gas or propane, and designed to provide 60,000-80,000 BTU/HR . Choose between automated electronic or manual ignition.</p>

		    	</div>
		  	</li>
		  	<li class="media">
		    	<div class="media-left">
		        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/water-bowls.png" alt="Water Bowls">
		    	</div>
		    	<div class="media-body">
		     		 <h4 class="media-heading"><strong>Water Bowls</strong></h4>
		     		 <p>Transform your outdoor living environment with the sound of flowing water. Lay back and relax to the tranquil stream or let the kids play under the flowing waterfall.</p>

		    	</div>
		  	</li>
		  	<li class="media">
		    	<div class="media-left">
		        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/fire-and-water-bowls.png" alt="Fire and Water Bowls">
		    	</div>
		    	<div class="media-body">
		     		 <h4 class="media-heading"><strong>Fire and Water Bowls</strong></h4>
		     		 <p>Enjoy the best of both worlds with the warmth of fire flames mixed with the sound of falling water. Create an inviting paradise and upgrade your outdoor space with these fire &amp; water bowls.</p>

		    	</div>
		  	</li>
		  	<li class="media">
		    	<div class="media-left">
		        	<img class="media-object" src="<?php echo get_template_directory_uri(); ?>/assets/img/finishing-touches/fire-pits.png" alt="Fire Pits">
		    	</div>
		    	<div class="media-body">
		     		 <h4 class="media-heading"><strong>Fire Pits</strong></h4>
		     		 <p>Add warmth and ambiance to your outdoor space and achieve a stunning nighttime atmosphere with these eye-catching fire pits, perfect for entertaining.</p>

		    	</div>
		  	</li>
		</ul>
		</div>
	</div>

</section>