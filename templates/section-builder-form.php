<style>
	.find-a-builder #hero { margin-bottom: 0; }
	.builder-form {
		padding-top: 30px;
		background-color: #eceded;
	}
	.builder-form .form-description {
		padding-left: 7px;
		padding-bottom: 15px;
	}
	.btn.teal-button:focus { outline: none; }
	.builder-form .teal-button { margin-top: 25px; }
	.show-builder,
	.show-applicator,
	.show-remodel { display: none; }
	.builder-selected .show-builder,
	.applicator-selected .show-applicator,
	.remodel-selected .show-remodel { display: block; }
	input.parsley-success,
	select.parsley-success,
	textarea.parsley-success {
	  color: #468847;
	  background-color: #DFF0D8;
	  border: 1px solid #D6E9C6;
	}

	input.parsley-error,
	select.parsley-error,
	textarea.parsley-error {
	  color: #B94A48;
	  background-color: #F2DEDE;
	  border: 1px solid #EED3D7;
	}

	.parsley-errors-list {
	  margin: 2px 0 3px;
	  padding: 0;
	  list-style-type: none;
	  font-size: 0.9em;
	  line-height: 0.9em;
	  opacity: 0;

	  transition: all .3s ease-in;
	  -o-transition: all .3s ease-in;
	  -moz-transition: all .3s ease-in;
	  -webkit-transition: all .3s ease-in;
	}

	.parsley-errors-list.filled {
	  opacity: 1;
	}
</style>

<section class="builder-form">
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<form class="form-horizontal builder-selected" id="findABuilder">
					<div class="col-md-8 col-md-offset-2 form-description">
						<p>Please select any of the businesses below to be contacted.</p>
						<p>Select any number of businesses by choosing "Select this business" from the list below. Once you submit your selections, please fill out the form detailing your request. Your information will be sent to our trusted partners!</p>

						<p><a href = "/become-a-builder/" target = "_blank"> Interested in becoming a Pebble Technology Pool Builder?</a></p>
					</div>
					<div class="clearfix"></div>
					<input type="hidden" name="County" id="County" value="">
					<input type="hidden" name="State" id="State" value="">
				  <div class="form-group">
				    <label class="col-sm-2 control-label">I am looking...</label>
				    <div class="col-sm-4">
				      <select class="form-control" id="Type" name="Type" data-parsley-required="true">
							  <option value="Builder">To Build A New Pool</option>
							  <option value="Remodel">To Remodel An Existing Pool</option>
							  <option value="Applicator">For An Authorized Applicator</option>
							</select>
				    </div>
				  </div>
				  <div class="form-group">
				    <label class="col-sm-2 control-label">Country</label>
				    <div class="col-sm-3">
				      <select class="form-control" id="Country" name="Country">
				      	<option value="Canada" selected="selected">Canada</option>
				      	<option value="Mexico" selected="selected">Mexico</option>
							  <option value="USA" selected="selected">USA</option>
							</select>
				    </div>
				  </div>
				  <!-- <div class="form-group" id="locationRow">
				    <label class="col-sm-2 control-label">Location</label>
				    <div class="col-sm-3">
				      <select class="form-control" id="State" name="State" data-parsley-required="true">
							  <option value="">State</option>
							</select>
				    </div>
				    <div class="col-sm-3 show-applicator show-remodel show-builder">
				      <select class="form-control" id="County" name="County" data-parsley-required="true">
							  <option value="">County</option>
							</select>
				    </div>
				  </div> -->
				  <div class="form-group" id="locationRow">
				    <label class="col-sm-2 control-label">Zip Code</label>
				    <div class="col-sm-3">
				      <input type="text" class="form-control" id="ZipCode" name="Zip Code" data-parsley-required="true" data-parsley-type="integer" data-parsley-minlength="5">
				    </div>
				  </div>
				  <div class="form-group" id="radiusRow">
				  	<label class="col-sm-2 control-label">Max Radius</label>
				    <div class="col-sm-3">
				      <select class="form-control" id="radius" name="radius" data-parsley-required>
							  <option value="25" selected>25 Miles</option>
							  <option value="50">50 Miles</option>
							  <option value="75">75 Miles</option>
							  <option value="100">100 Miles</option>
							</select>
				    </div>
				  </div>
				  <div class="form-group" id="servicesRow">
				  	<label class="col-sm-2 control-label">Services</label>
				    <div class="col-sm-10">
				      <label class="checkbox-inline">
							  <input type="checkbox" name="Services[]" id="residentialPools" value="Residential Pools"> Residential Pools
							</label>
							<label class="checkbox-inline">
							  <input type="checkbox" name="Services[]" id="newConstruction" value="New Construction" checked disabled> New Construction
							</label>
							<label class="checkbox-inline">
							  <input type="checkbox" name="Services[]" id="backendDesignServices" value="Backend Design Services"> Backend Design Services
							</label>
							<label class="checkbox-inline">
							  <input type="checkbox" name="Services[]" id="commercialPools" value="Commercial Pools"> Commercial Pools
							</label>
							<label class="checkbox-inline">
							  <input type="checkbox" name="Services[]" id="Remodels" value="Remodels"> Remodels
							</label>
				    </div>
			    </div>
				  <div class="form-group">
				    <div class="col-sm-offset-2 col-sm-10">
				      <button type="submit" class="btn teal-button" id="filterSubmit" data-loading-text="Loading..." autocomplete="off"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> Search</button>
				    </div>
				  </div>
				</form>
			</div>
		</div>
	</div>
</section>
