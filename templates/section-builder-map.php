<section class="builder-map" id="builderMap">
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<h2 class="text-uppercase">Search Results</h2>
				<div id="map"></div>
				<div class="col-md-6">
					<button type="button" class="btn teal-button get-info-button" id="getInformationButton">Get in Touch</button>
				</div>
				<div class="col-md-6">
					<h4 class="revise-link"><a href="/revise-your-listing" target="_blank">
						Need to revise your business listing? <br>
						Click Here
					</a></h4>
				</div>
				<style>
					div#map {
						min-height: 400px;
						width: 100%;
					}
					.builder-map {
						padding-top: 30px;
						padding-bottom: 30px;
					}
					.builder-map h2 { font-weight: bold; }
					.builder-map .teal-button { margin-top: 25px; }
					.color-popout .modal-header .close {
				    color: #ffffff;
				    background: #01a1ce;
				    opacity: 1.0;
				    border-radius: 15px;
				    text-shadow: none;
				    padding: 5px 9px;
				  }
				  .color-popout .modal-header .close span {
				    position: relative;
				    top: -1px;
					}
					.color-popout .modal-header {
				    padding-top: 20px;
				    padding-bottom: 0px;
				    border-bottom: none;
				  }
				  .color-popout .modal-header,
				  .color-popout .modal-body {
				    padding-left: 20px;
				    padding-right: 20px;
				  }
				  .color-popout .modal-header .modal-title {
				    text-transform: uppercase;
				    font-weight: 900;
				    font-size: 32px;
					}
					#formMessage,
					.revise-link,
					.single-builder-message,
					.multiple-builders-message { display: none; }
					/*#getInformationButton { display: none; }*/
				</style>
			</div>
		</div>
	</div>
</section>

<!-- Modal -->
<div class="modal fade color-popout" id="leadFormModal" tabindex="-1" role="dialog" aria-labelledby="leadFormModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
      	<div class="col-md-12">
        	<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	<h4 class="modal-title" id="leadFormModalLabel">Project Details</h4>
      	</div>
      	<div class="clearfix"></div>
      </div>
      <div class="modal-body">
        <form id="resultsForm">
        	<div class="form-description col-md-12">
        		<p><em>Please provide your information and the details of your project on the form below. Someone will be reaching out to you regarding your inquiry within the next 24 to 48 hours.</em></p>
      		</div>
				  <div class="form-group col-md-6">
				    <label class="sr-only" for="firstName">First Name</label>
				    <input type="text" class="form-control" id="firstName" name="First Name" placeholder="First Name" data-parsley-required>
				  </div>
				  <div class="form-group col-md-6">
				    <label class="sr-only" for="lastName">Last Name</label>
				    <input type="text" class="form-control" id="lastName" name="Last Name" placeholder="Last Name" data-parsley-required>
				  </div>
				  <div class="form-group col-md-7">
				    <label class="sr-only" for="email">Email Address</label>
				    <input type="email" class="form-control" id="email" name="Email Address" placeholder="Email Address" data-parsley-required>
				  </div>
				  <div class="form-group col-md-5">
				    <label class="sr-only" for="phone">Daytime Phone</label>
				    <input type="phone" class="form-control" id="phone" name="Daytime Phone" placeholder="Daytime Phone" data-parsley-required>
				  </div>
				  <div class="form-group col-md-12">
				    <label class="sr-only" for="address">Street Address</label>
				    <input type="text" class="form-control" id="address" name="Street Address" placeholder="Street Address" data-parsley-required>
				  </div>
				  <div class="form-group col-md-6">
				    <label class="sr-only" for="city">City</label>
				    <input type="text" class="form-control" id="city" name="City" placeholder="City" data-parsley-required>
				  </div>
				  <div class="form-group col-md-3">
				    <label class="sr-only" for="stateFull">State</label>
				    <select class="form-control" id="stateFull" name="State" data-parsley-required>
				    	<option value="">State</option>
						  <option value="Alabama">Alabama</option>
							<option value="Alaska">Alaska</option>
							<option value="Arizona">Arizona</option>
							<option value="Arizona">Arkansas</option>
							<option value="California">California</option>
							<option value="Colorado">Colorado</option>
							<option value="Conneticut">Connecticut</option>
							<option value="Deleware">Delaware</option>
							<option value="District Of Columbia">District Of Columbia</option>
							<option value="Florida">Florida</option>
							<option value="Georgia">Georgia</option>
							<option value="Hawaii">Hawaii</option>
							<option value="Idaho">Idaho</option>
							<option value="Illinois">Illinois</option>
							<option value="Indiana">Indiana</option>
							<option value="Iowa">Iowa</option>
							<option value="Kansas">Kansas</option>
							<option value="Kentucky">Kentucky</option>
							<option value="Louisiana">Louisiana</option>
							<option value="Maine">Maine</option>
							<option value="Maryland">Maryland</option>
							<option value="Massachusetts">Massachusetts</option>
							<option value="Michigan">Michigan</option>
							<option value="Minneasota">Minnesota</option>
							<option value="Mississippi">Mississippi</option>
							<option value="Missouri">Missouri</option>
							<option value="Montana">Montana</option>
							<option value="Nebraska">Nebraska</option>
							<option value="Nevada">Nevada</option>
							<option value="New Hampshire">New Hampshire</option>
							<option value="New Jersey">New Jersey</option>
							<option value="New Mexico">New Mexico</option>
							<option value="New York">New York</option>
							<option value="North Carolina">North Carolina</option>
							<option value="North Dakota">North Dakota</option>
							<option value="Ohio">Ohio</option>
							<option value="Oklahoma">Oklahoma</option>
							<option value="Oregon">Oregon</option>
							<option value="Pennsylvania">Pennsylvania</option>
							<option value="Rhode Island">Rhode Island</option>
							<option value="South Carolina">South Carolina</option>
							<option value="South Dakota">South Dakota</option>
							<option value="Tennessee">Tennessee</option>
							<option value="Texas">Texas</option>
							<option value="Utah">Utah</option>
							<option value="Vermont">Vermont</option>
							<option value="Virginia">Virginia</option>
							<option value="Washington">Washington</option>
							<option value="West Virigina">West Virginia</option>
							<option value="Wisconsin">Wisconsin</option>
							<option value="Wyoming">Wyoming</option>
						</select>
				  </div>
				  <div class="form-group col-md-3">
				    <label class="sr-only" for="zipCode">Zip Code</label>
				    <input type="text" class="form-control" id="zipCode" name="Zip Code" placeholder="Zip Code" data-parsley-required data-parsley-type="integer" data-parsley-minlength="5">
				  </div>
				  <div class="form-group col-md-12">
				    <label class="sr-only" for="preferredContact">Preferred Contact Method</label>
				    <select class="form-control" id="preferredContact" name="Preferred Contact Method" data-parsley-required>
				    	<option value="">Preferred Contact Method</option>
						  <option value="Email">Email</option>
						  <option value="Phone">Phone</option>
						</select>
				  </div>
				  <div class="form-group col-md-12">
				    <label class="sr-only" for="reasonForInquiry">Reason for Inquiry</label>
				    <select class="form-control" id="reasonForInquiry" name="Reason for Inquiry" data-parsley-required>
				    	<option value="">Reason For Inquiry</option>
						  <option value="Residential New Pool Construction">Residential New Pool Construction</option>
						  <option value="Residential Remodel Existing Pool">Residential Remodel Existing Pool</option>
						  <option value="Commercial New Pool Construction">Commercial New Pool Construction</option>
						  <option value="Commercial Remodel Existing Pool">Commercial Remodel Existing Pool</option>
						  <option value="Backyard Design Services">Backyard Design Services</option>
						  <option value="Warranty Issue">Warranty Issue</option>
						</select>
				  </div>
				  <div class="form-group col-md-12">
				    <label class="sr-only" for="projectDescription">Project Description</label>
				    <textarea class="form-control" id="projectDescription" name="Project Description" placeholder="Project Description:" data-parsley-required></textarea>
				  </div>
				  <div class="form-group col-md-12">
				    <label class="sr-only" for="interestedProducts">Please select the products you are interested in</label>
				    <select multiple class="form-control" id="interestedProducts" name="Interested Products" data-parsley-required>
				    	<option value="">Please select the products you are interested in</option>
				    	<option value="PebbleTec">PebbleTec</option>
							<option value="PebbleSheen">PebbleSheen</option>
							<option value="PebbleFina">PebbleFina</option>
							<option value="PebbleBrilliance">PebbleBrilliance</option>
							<option value="BeadCrete">BeadCrete</option>
							<option value="Finishing Touches Tile">Finishing Touches Tile</option>
							<option value="Pool finish enhancements">Pool finish enhancements</option>
							<option value="Fire &amp; Water Elements">Fire &amp; Water Elements</option>
						</select>
				  </div>
				  <input type="hidden" id="correctedInterestedProducts" name="Corrected Interested Products">
				  <div class="form-group col-md-12 hidden" id="selectedBuilders"></div>
				  <div class="col-md-12">
				  	<button type="submit" class="btn teal-button">Submit <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></button>
			  	</div>
			  	<div class="clearfix"></div>
				</form>
				<div id="formMessage">
					<div class="multiple-builders-message">
						<p>Thank you for your submissions. A representative at the businesses you selected will be in contact with you shortly.</p>
					</div>
					<div class="single-builder-message">
						<p>Thank you for your submission. A representative at the business you selected will be incontact with you shortly.</p>
					</div>
				</div>
      </div>
    </div>
  </div>
</div>
