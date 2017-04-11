<div id="twitterBanner" class="hidden-sm hidden-xs">
	<div class="inner-banner">
		<div class="container">
			<div class="row">
				<div class="twitter-logo col-md-2">
					<img src="<?php echo get_template_directory_uri(); ?>/assets/img/twitter-logo.png">
				</div>
				<div class="latest-tweets col-md-10 col-sm-12">
					<div class="cycle-slideshow" data-cycle-fx="carousel" data-cycle-timeout="7000" data-cycle-carousel-visible="1" data-cycle-carousel-fluid="true" data-cycle-slides=".tweet-element" data-cycle-log="false">
						<?php echo(get_latest_tweets()); ?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>