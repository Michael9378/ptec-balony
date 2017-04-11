<script>
	window.onload = function () {
		jQuery('[data-toggle="tooltip"]').tooltip();
	};
</script>

<style>
.builder-badge {
	float: left;
	height: 70px;
  margin-right: 15px;
}
.builder-results { display: none; }
.builder-results h2 { margin-top: 0; }
.builder-results hr{ border-color: #b6b6b6; }
.builder-row { margin-bottom: 75px; }
h2 span.lighter { 
	display: block; 
	font-weight: 300;
}
.builder-images .secondary-row { margin-top: 10px; }
.builder-images .secondary.left { 
	padding-right: 5px;
}
.builder-images .secondary.right { 
	padding-left: 5px;
}
.single-builder {
	padding: 30px;
}
.single-builder h3 { 
	margin-top: 0; 
	text-transform: uppercase;
	font-weight: bold;
}
.single-builder strong { display: block; }
.single-builder .btn,
.builder-cta .btn { 
	margin-top: 25px;
	text-align: center;
}
.single-builder.regular-builder .btn {
	position: absolute;
	bottom: 0;
	left: 7.5%;
	width: 85%;
}
.regular-builder { 
	border-left: 1px solid #b6b6b6;
	margin-bottom: 25px;
	padding-bottom: 60px;
}
.certified-builders .regular-builder { min-height: 300px; }
.registered-builders .regular-builder { min-height: 215px; }
.returned-results .regular-builder:nth-of-type(4n+1) { border-left: none; }
.featured-builder:nth-of-type(odd) { border-left: none; }
.featured-builder:nth-of-type(even) { border-left: 1px solid #b6b6b6; }
.teal-button.remove-builder { 
	background-color: #d9534f;
  border-color: #d43f3a; 
  text-align: center;
}
.teal-button.remove-builder:hover,
.teal-button.remove-builder:active {
	color: #fff;
  background-color: #c9302c;
  border-color: #ac2925;
}
.teal-button.remove-builder:focus {
	color: #fff;
  background-color: #c9302c;
  border-color: #761c19;
}
h5.teal { color: #0099ff; }
.get-info-button,
.builder-cta,
.glyphicon-question-sign { display: none; }
</style>

<section class="builder-results">
	<div class="container">
		<div class="row authorized-applicators builder-row">
			<div class="col-md-12">
				<h2 class="text-uppercase"><span class="lighter">Authorized</span><strong>Applicators</strong> <span class="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="Tooltip on right"></span></h2>
				<hr>
			</div>
			<div id="authorizedApplicatorsResults" class="returned-results"></div>
		</div>
		<div class="row certified-repair-agent builder-row">
			<div class="col-md-12">
				<h2 class="text-uppercase"><span class="lighter">Certified</span><strong>Repair Agent</strong> <span class="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="Tooltip on right"></span></h2>
				<hr>
			</div>
			<div id="certifiedRepairAgentsResults" class="returned-results"></div>
		</div>
		<div class="row builder-applicator builder-row">
			<div class="col-md-12">
				<h2 class="text-uppercase"><span class="lighter">Authorized</span><strong>Builder/Applicator</strong> <span class="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="Tooltip on right"></span></h2>
				<hr>
			</div>
			<div id="builderApplicatorResults" class="returned-results"></div>
		</div>
		<div class="row elite-builders builder-row">
			<div class="col-md-12">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/img/builder-badges/EliteBuilder.png" class="builder-badge">
				<h2 class="text-uppercase"><span class="lighter">Elite</span><strong>Builders</strong> <span class="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="Tooltip on right"></span></h2>
				<hr>
			</div>
			<div id="eliteBuildersResults" class="returned-results"></div>
		</div>
		<div class="row certified-builders builder-row">
			<div class="col-md-12">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/img/builder-badges/CertifiedBuilder.png" class="builder-badge">
				<h2 class="text-uppercase"><span class="lighter">Certified</span><strong>Builders</strong> <span class="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="Tooltip on right"></span></h2>
				<hr>
			</div>
			<div id="certifiedBuildersResults" class="returned-results"></div>
		</div>
		<div class="row registered-builders builder-row">
			<div class="col-md-12">
				<h2 class="text-uppercase"><span class="lighter">Registered</span><strong>Builders</strong> <span class="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="Tooltip on right"></span></h2>
				<hr>
			</div>
			<div id="registeredBuildersResults" class="returned-results"></div>
		</div>
	</div>
</section>

<section class="builder-cta">
	<div class="container">
		<div class="row">
			<div class="col-md-12 text-center">
				<p>Select any of the applicators or builders in the list above and submit your choices by selecting "Get in Touch" to fill out a contact form. A representative will be reaching out to you regarding your inquiry.</p>
				<button class="btn teal-button get-info-button">Get in Touch</button>
			</div>
		</div>
	</div>
</section>