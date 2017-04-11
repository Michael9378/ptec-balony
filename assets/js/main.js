/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 *
 * Google CDN, Latest jQuery
 * To use the default WordPress version of jQuery, go to lib/config.php and
 * remove or comment out: add_theme_support('jquery-cdn');
 * ======================================================================== */

(function($) {
// Global variables and constants for pool function
// var selectedBlend;
// var initialColor;
// var EMERALD_BLEND = "emerald-blend";
// var JADE_BLEND = "jade-blend";
// var BLUE_BLEND = "blue-blend";
// Set global variable to be used if pool picker is broken in ie or firefox
// var brokenPoolPicker = false;
var luminiousObj = new Object();
var descriptions = new Object();
var finishingTouches = new Object();
var finishParent;

var ppBase = "/wp-content/themes/pebbletec/assets/img/literallytheentirepoolpicker/";
var ppParent ="Tec";

var stuck;

// Use this variable to set up the common and page specific functions. If you
// rename this variable, you will also need to rename the namespace below.
var Roots = {
  // All pages
  common: {
    init: function() {
      // JavaScript to be fired on all pages
      jQuery(window).load(function () {
        // check if content or sidebar is longer, then hide the shorter border.
        if( jQuery('.main').height() < jQuery('.sidebar').height() || jQuery('.main .col-sm-7').height() < jQuery('.product-sidebar').height()) {
          // sidebar is longer
          jQuery('.main, .main .col-sm-7').css('border-right', 'none');
        } else {
          // content is longer
          jQuery('.sidebar, .product-sidebar').css('border-left', 'none');
        }
      });

      // This javascript was inserted by the final tile plugin, but was inserted before jQuery was defined. Not sure how to properly clean that up, but moving the line of code here makes the gallery work correctly.
      jQuery(document).ready(function () {
        if(jQuery('.final-tiles-gallery').is('*')) {
          setTimeout(function () {jQuery('.final-tiles-gallery').finalTilesGallery({minTileWidth: 100,margin: 10,debug: false,gridSize: 25,allowEnlargement: true,imageSizeFactor: [ [4000, 0.9],[1024, 0.8],[768, 0.7],[640, 0.6],[320, 0.5]],scrollEffect: 'none',});jQuery(function () {});}, 0);
        }
      });

      breadCrumbFix();

      // jQuery('.navbar').affix({
      //   offset: {
      //     top: 0
      //   }
      // });

    }
  },
  // Home page
  home: {
    init: function() {
      // JavaScript to be fired on the home page
    }
  },
  // Pool picker page
  water_color_picker: {
    init: function() {

      // JavaScript to be fired on the pool picker

      $(".form-group .control-label .fa-question-circle").mouseenter(function(){
        $("#blendHint").fadeIn(250);
      }).mouseleave(function(){
        $("#blendHint").fadeOut(250);
      });

      // // initialize finish and color variables
      var finish, color;

      // triggered when user clicks on a finish choice. gets colors that are
      // related to that finish and moves to the next panel
      $(document).on('click', '.color-choice', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        // get selected finish
        $(this).addClass('selected-color');
        color = $(this).data('water-color');
        // update bread crumbs
        $(".breadcrumbs .waterColor span").addClass( color );
        $(".breadcrumbs .waterColor span").html( color.replace( "-", " " ) );
        // update print
        $("#printWater").html( capitalize( color.replace( "-", " " ) ) );

        // ajax request. /lib/extras.php line 136
        $.ajax({
          type: "get",
          dataType: "html",
          url: '/wp-admin/admin-ajax.php',
          data: { action : 'get_pool_textures', color : color },
          success: function(response) {
            // display returned choices and move to next slide
            $('#finishHolder').prepend(response);
            $('#colorPicker').carousel('next');
          }
        });

      });

      // triggered when user clicks on a color choice. gets associated products
      // related to their two choices and returns the pool visualizer
      $(document).on('click', '.finish-choice', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        // get user choices
        finish = $(this).data('pool-finish');
        finishParent = finish;

        // update bread crumbs
        $(".breadcrumbs .finishColor span").addClass( finish );
        $(".breadcrumbs .finishColor span").html( finish.replace( "-", " " ) );
        // update print
        $("#printFinish").html( finish.replace( "-", " " ) );

        // preload texture images
        preLoadPoolTextures();

        // ajax request. /lib/extras.php line 173
        $.ajax({
          type: "get",
          dataType: "json",
          url: '/wp-admin/admin-ajax.php',
          data: { action : 'get_pool_finishes', color : color, finish : finish },
          success: function(response) {
            // set pool finish dropdown options
            $('#poolFinishes').html(response.finishes);

            // set array of luminious options
            luminiousObj = response.luminious;

            // set array of descriptions
            descriptions = response.descriptions;

            // set finishing touches html
            finishingTouches = response.finishing_touches;
            // set initial finish option to the first returned option
            $('#poolFinish option:first-child').attr('selected', 'selected');
            // initial call to set pool
            // if(brokenPoolPicker){
            //   setUpPoolIE();
            // }

            // set the initial color of the pool and then save it before update so it does not deviate between ie and chrome
            // $("#shadowImg").removeClass().addClass(color);
            // initialColor = $("#shadowImg").css("background-color");

            updatePool( color );
            $('#poolFinishes').trigger("change");

            //show next panel
            $('#colorPicker').carousel('next', function() {  });
            $('.final-page-show').show();
          }
        });
      });

      // when user clicks update pool button, run update pool function
      $(document).on('click', '#updatePool', function (e) {
        e.preventDefault();
        updatePool( color );
        // updateDepth( $('#depthSlider').val(), selectedBlend );
      });

      // when user changes pool finish option, display correct luminious options
      // $(document).on('change', '#poolFinishes', function (e) {
      //   e.preventDefault();
      //   // get selected finish
      //   var finish = $('#poolFinishes').find(":selected").val();
      //   // grab luminious options from array
      //   $('#poolLuminious').html(luminiousObj[finish]);
      // });
      // commented out feature/plant in html
      /*
      $("#plant").click(function(){
        changeFeature();
      });*/
    }
  },

  blog: {
    init: function() {

      // randomize tag colors
      var tags = $(".tagcloud").find("a");
      for(var i = 0; i < tags.length; i++) {
        var color = randomColor();
        $(tags[i]).css('color', color);
      }
    }

  },

find_a_builder: {
    init: function() {
      //form vars
      var $form = $('#findABuilder');
      var $type = $('#Type');
      var $country = $('#Country');
      var $state = $('#State');
      var $county = $('#County');
      var $zip = $('#ZipCode');
      var $radius = $('#radius');
      var $remodels = $('#Remodels');
      var $construction = $('#newConstruction');
      var $residentials = $('#residentialPools');
      var $locationRow = $('#locationRow');
      var $servicesRow = $('#servicesRow');
      var $btn = $('#filterSubmit');

      //map vars
      var map;
      var initialLocation;
      var markers = [];
      var infoWindow;
      var locations = [];

      // builder levels
      var authorized_applicators = [];
      var elite_builders = [];
      var certified_builders = [];
      var registered_builders = [];
      var builder_applicator = [];
      var repair_agent = [];

      // lead vars
      var $leadForm = $('#resultsForm');
      var $leadFormModal = $('#leadFormModal');
      var $formMessage = $('#formMessage');
      var $singleMessage = $('.single-builder-message');
      var $multipleMessage = $('.multiple-builders-message');
      var ticket;
      var recordID;

      // initialize the map
      function initMap() {
        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map'), {
          center: initialLocation,
          scrollwheel: false,
          zoom: 10
        });
      }

      function getInitialLocation() {
        var request = $.ajax({
          type: "POST",
          // data: data,
          dataType: "json",
          url: encodeURI('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBxs3Iab6XLR5jP4mC75fsE3UFf3KJsIJU')
        });

        request.done(function( response ) {
          if( !response.error ) {
            initialLocation = response.location;
            initMap();
          } else {
            initialLocation = {lat: 33.4217599, lng: -111.9343519};
          }
        });
      }

      // get locations from returned list of builders
      function getLocations(builders) {
        var counter = builders.length;
        var type = $type.val();
        var country = $country.val();
        // poor database entries continue to plague find a builder.
        // if we get stuck calling the google api, move on anyways.
        stuck = true;
        get_builder_positions(builders, 0);
        // if were still stuck, just move on.
        setTimeout(function(){
          if ( stuck ) {
            if ( country !== 'USA' ) {
              addMarkers(locations);
            }
            else if(type === 'Builder' || type === 'Remodel') {
              filterByDistance(locations);
            } else {
              // filterByDistance(locations);
              centerOnCounty(locations);
            }
          }
        }, 7500);

        // make recursive to set timeouts to abide by rate limits
        function get_builder_positions(bldrs, index) {
          // break before array out of bounds
          if( index>=bldrs.length ) {
            return false;
          }
          var builder = bldrs[index];
          // continuation of old loop
          var request = $.ajax({
            type: "POST",
            dataType: "json",
            url: encodeURI('https://maps.googleapis.com/maps/api/geocode/json?address=' + builder.f[4] + ',' + builder.f[6] + ',' + builder.f[16] + ',' + builder.f[1] + '&key=AIzaSyBxs3Iab6XLR5jP4mC75fsE3UFf3KJsIJU')
          });

          request.done(function( response ) {
            counter--;
            if ( response.status === 'OK' ) {
              position = response.results[0].geometry.location;

              locations.push({
                "id"          : builder.f[27],
                "title"       : builder.f[0],
                "position"    : position,
                "phone"       : builder.f[10],
                "address"     : builder.f[4] +  "<br>" + builder.f[6] + ", " + builder.f[16] + ' ' + builder.f[1],
                "website"     : builder.f[18],
                "level"       : builder.f[8],
                "logoURL"     : builder.f[9],
                "services"    : {
                  "Backyard Design"   : builder.f[11],
                  "Commercial Pools"  : builder.f[12],
                  "New Construction"  : builder.f[13],
                  "Remodels"          : builder.f[14],
                  "Residential Pools" : builder.f[15],
                }
              });
            }
            else {
              if( response.status == "ZERO_RESULTS" ) {
                //console.log("Couldn't find address for builder: " + builder.f[0]);
                //console.log("Passed address: " + builder.f[4] +  " " + builder.f[6] + " " + builder.f[16] + " " + builder.f[1]);
              }
              else{
                //console.log(response.error_message);
              }
            }
            if (counter === 0) {

              stuck = false;

              if ( country !== 'USA' ) {
                addMarkers(locations);
              }
              else {
                filterByDistance(locations);
              }

            }
          });
          // set timeout to avoid 100 rates per second
          // should be 75 per second
          if( index%75 || index==0 )
            get_builder_positions(bldrs, ++index);
          else
            setTimeout(function(){ get_builder_positions(bldrs, ++index); }, 1000);
        }
      }

      // filter locations by distance from zip
      function filterByDistance(locations) {
        var zip = $zip.val();
        var radius = $radius.val();

        var request = $.ajax({
          type: "POST",
          dataType: "json",
          url: encodeURI('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + '&key=AIzaSyBxs3Iab6XLR5jP4mC75fsE3UFf3KJsIJU')
        });

        request.done(function( response ) {
          if ( response.status === 'OK' ) {
            var userLocation = response.results[0].geometry.location;
            
            map.panTo(userLocation);

            var i = locations.length;
            while (i--) {
              
              var distance = GetDist(locations[i].position.lat, locations[i].position.lng, userLocation.lat, userLocation.lng);
              
              if ( distance > radius ) {
                locations.splice(i, 1);
              }
            }
            if (locations.length > 0) {
              addMarkers(locations);
            } else {
              $btn.button('reset');
              alert('No results matched your filters! Please try again with a different combination.');
            }
          }
        });
      }

      // center map on selected county
      function centerOnCounty(locations) {
        var county = $county.val();

        var request = $.ajax({
          type: "POST",
          dataType: "json",
          url: encodeURI('https://maps.googleapis.com/maps/api/geocode/json?address=' + county + '&key=AIzaSyBxs3Iab6XLR5jP4mC75fsE3UFf3KJsIJU')
        });

        request.done(function( response ) {
          if ( response.status === 'OK' ) {
            var userLocation = response.results[0].geometry.location;
            map.panTo(userLocation);
            addMarkers(locations);
          }
        });
      }

      // filter duplicate builders
      function filterDuplicateBuilders(builders) {
        // array to hold only unique locations
        var uniqueBuilders = [];
        var duplicateCount = 0;
        var columns = builders[0].f.length;

        // filter builders by phone
        for(var i = 0; i < builders.length; i++) {

          // filter out empty fields that were converted to objects
          for( var j = 0; j < columns; j++ ) {
            // services are 11 through 15. Parse to ints for true/false
            if( j >= 11 && j <= 15) {
              builders[i].f[j] = parseInt(builders[i].f[j]);
            }
            else {
              if( typeof builders[i].f[j] == "object" ) {
                builders[i].f[j] = "";
              }
            }
          }

          var found = false;
          for(var j = 0; j < uniqueBuilders.length; j++) {
            // f4 is street f10 is phone number
            if( builders[i].f[4].toLowerCase() == uniqueBuilders[j].f[4].toLowerCase() && builders[i].f[10].replace(/\D/g,'') == uniqueBuilders[j].f[10].replace(/\D/g,'') ) {
              found = true;
              duplicateCount++;
              break;
            }
          }
          if( !found ) {
            uniqueBuilders.push(builders[i]);
          }
        }
        console.log("Duplicate builders: " + duplicateCount);
        return uniqueBuilders;
      }

      // filter locations based on services they offer
      function filterByServices(builders){
        /*
        "Backyard Design"   : builder.f[11],
        "Commercial Pools"  : builder.f[12],
        "New Construction"  : builder.f[13],
        "Remodels"          : builder.f[14],
        "Residential Pools" : builder.f[15],
        */
        // get selected services
        var selectedServices = [ $("input#backyardDesign").is(":checked"), $("input#commercialPools").is(":checked"), $("input#newConstruction").is(":checked"), $("input#Remodels").is(":checked"), $("input#residentialPools").is(":checked") ];
        var returnBuilders = [];
        for( var j = 0; j < builders.length; j++ ) {
          for( var i = 0; i < selectedServices.length; i++ ) {
            if( selectedServices[i] && builders[j].f[i+11] ) {
              // add this builder to the return list and break out of services check.
              returnBuilders.push( builders[j] );
              break;
            }
          }
        }
        return returnBuilders;
      }

      // add markers to map
      function addMarkers(locations) {
        infoWindow = new google.maps.InfoWindow();

        for (i=0; i<locations.length; i++) {

          // create marker
          var marker = new google.maps.Marker({
            position: locations[i].position,
            map: map
          });

          // push to markers array
          markers.push(marker);

          var contentString;

          // if registered builder, do not show website.
          if( locations[i].level == "Registered Builder" ) {
            contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h5 class="teal">' + locations[i].title + '</h5>'+
              '<h5 class="teal">' + locations[i].phone + '</h5>'+
              '<div id="bodyContent">'+
              '<p><a href="https://maps.google.com?q=' + locations[i].address + '" target="_blank" class="address-link" data-locationID="' + locations[i].id + '">' + locations[i].address + '</a></p>'+
              '</div>'+
              '</div>';
          }
          else {
            contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h5 class="teal">' + locations[i].title + '</h5>'+
              '<h5 class="teal">' + locations[i].phone + '</h5>'+
              '<div id="bodyContent">'+
              '<p><a href="https://maps.google.com?q=' + locations[i].address + '" target="_blank" class="address-link" data-locationID="' + locations[i].id + '">' + locations[i].address + '</a></p>'+
              '<p><a href="' + locations[i].website + '" target="_blank">' + locations[i].website + '</a></p>'+
              '<button class="btn btn-block teal-button add-builder" data-builder="' + locations[i].id + '">Select This Business</button>'+
              '</div>'+
              '</div>';
          }

          // add click event listener
          google.maps.event.addListener(marker, 'click', (function(marker, contentString, infoWindow, i ) {
            return function () {
              infoWindow.setOptions({maxWidth: 200, content: contentString});
              infoWindow.open(map, marker);

              trackClick('Map Pin Click', locations[i].id);
            }
          }) (marker, contentString, infoWindow, i));

        }
        // reset form button
        $btn.button('reset');
        $('#builderMap').goTo();
        // set map boundaries
        setMapBounds();
        // sort locations alphabetically by title
        locations.sort(function(a, b) {
          var titleA = a.title.toUpperCase(); // ignore upper and lowercase
          var titleB = b.title.toUpperCase(); // ignore upper and lowercase
          if (titleA < titleB) {
            return -1;
          }
          if (titleA > titleB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        addBuildersToForm(locations);
        sortBuilders(locations);
      }

      // function to set the appropriate zoom level to show all markers
      function setMapBounds() {
        var bounds = new google.maps.LatLngBounds();

        for(i=0;i<markers.length;i++) {
          bounds.extend(markers[i].getPosition());
        }

        //center the map to the geometric center of all markers
        map.setCenter(bounds.getCenter());

        map.fitBounds(bounds);

        //remove one zoom level to ensure no marker is on the edge.
        map.setZoom(map.getZoom()-1);

        // set a minimum zoom
        // if you got only 1 marker or all markers are on the same address map will be zoomed too much.
        if(map.getZoom()> 15){
          map.setZoom(15);
        }
      }

      // add builders to get in touch form
      function addBuildersToForm(locations) {
        locations.forEach(function (location) {
          var location_checkbox = '<label class="checkbox">';
          location_checkbox += '<input type="checkbox" name="Builders[]" class="builder-checkbox" id="location-' + location.id + '" value="' + location.id + '"> ' + location.title;
          location_checkbox += '</label>';

          $('#selectedBuilders').append(location_checkbox);
        });
      }

      // sort and display builders by level
      function sortBuilders(locations) {

        locations.forEach(function (location) {
          switch (location.level) {
            case "Certified Builder":
              certified_builders.push(location);
              break;
            case "Authorized Applicator":
              authorized_applicators.push(location);
              break;
            case "Registered Builder":
              registered_builders.push(location);
              break;
            case "Elite Builder":
              elite_builders.push(location);
              break;
            case "Builder/Applicator":
              builder_applicator.push(location);
              break;
            case "Certified Repair Agent":
              repair_agent.push(location);
              break;
          }
        });

        if( certified_builders.length > 0 ) {
          certified_builders.forEach(function (bldr) {
            builder_col = '<div class="col-md-3 single-builder regular-builder">';
            builder_col += '<h3>' + bldr.title + '</h3>';
            builder_col += bldr.address + '<br>';
            builder_col += '<strong><a href="tel:+' + bldr.phone + '" class="phone-link" data-locationID="' + bldr.id + '">' + bldr.phone + '</a></strong>';
            if( bldr.website.length > 0 )
              builder_col += '<a href="http://' + bldr.website + '" target="_blank" class="website-link" data-locationID="' + bldr.id + '">' + bldr.website + '</a>';
            builder_col += '<button class="btn btn-block teal-button add-builder" data-builder="'+ bldr.id +'">Select This Business</button>';
            builder_col += '</div>';

            $('#certifiedBuildersResults').append(builder_col);
            $('.certified-builders').show();
          });
        } else {
          $('.certified-builders').hide();
        }

        if( registered_builders.length > 0 ) {
          registered_builders.forEach(function (bldr) {
            builder_col = '<div class="col-md-3 single-builder regular-builder">';
            builder_col += '<h3>' + bldr.title + '</h3>';
            builder_col += bldr.address + '<br>';
            builder_col += '<strong><a href="tel:+' + bldr.phone + '" class="phone-link" data-locationID="' + bldr.id + '">' + bldr.phone + '</a></strong>';
            builder_col += '</div>';

            $('#registeredBuildersResults').append(builder_col);
            $('.registered-builders').show();
          });
        } else {
          $('.registered-builders').hide();
        }

        if( authorized_applicators.length > 0 ) {
          authorized_applicators.forEach(function (bldr) {
            builder_col = '<div class="col-md-6 single-builder featured-builder">';
            builder_col += '<div class="row top-row">';
            builder_col += '<div class="col-md-7">';
            builder_col += '<h3>' + bldr.title + '</h3>';
            builder_col += bldr.address + '<br>';
            builder_col += '<strong><a href="tel:+' + bldr.phone + '" class="phone-link" data-locationID="' + bldr.id + '">' + bldr.phone + '</a></strong>';
            if( bldr.website.length > 0 )
              builder_col += '<a href="http://' + bldr.website + '" target="_blank" class="website-link" data-locationID="' + bldr.id + '">' + bldr.website + '</a>';
            builder_col += '</div>';
            builder_col += '<div class="col-md-5">';
            builder_col += '<strong>Services</strong>';
            builder_col += '<ul class="list-unstyled">';
            for ( var ndx in bldr.services ) {
              if ( bldr.services[ndx] ) {
                builder_col += '<li><em>' + ndx + '</em></li>';
              }
            }
            builder_col += '</ul>';
            builder_col += '</div>';
            builder_col += '</div>';
            builder_col += '<div class="row">';
            builder_col += '<div class="col-md-7">';
            builder_col += '<button class="btn btn-block teal-button add-builder" data-builder="'+ bldr.id +'">Select This Business</button>';
            builder_col += '</div>';
            if(bldr.logoURL.length > 5) {
              builder_col += '<div class="col-md-3 builder-images">';
              builder_col += '<img src="' + bldr.logoURL + '" class="img-responsive img-rounded">';
              builder_col += '</div>';
            }
            builder_col += '</div>';

            $('#authorizedApplicatorsResults').append(builder_col);
            $('.authorized-applicators').show();
          });
        } else {
          $('.authorized-applicators').hide();
        }

        if( repair_agent.length > 0 ) {
          repair_agent.forEach(function (bldr) {
            builder_col = '<div class="col-md-6 single-builder featured-builder">';
            builder_col += '<div class="row top-row">';
            builder_col += '<div class="col-md-7">';
            builder_col += '<h3>' + bldr.title + '</h3>';
            builder_col += bldr.address + '<br>';
            builder_col += '<strong><a href="tel:+' + bldr.phone + '" class="phone-link" data-locationID="' + bldr.id + '">' + bldr.phone + '</a></strong>';
            if( bldr.website.length > 0 )
              builder_col += '<a href="http://' + bldr.website + '" target="_blank" class="website-link" data-locationID="' + bldr.id + '">' + bldr.website + '</a>';
            builder_col += '</div>';
            builder_col += '<div class="col-md-5">';
            builder_col += '<strong>Services</strong>';
            builder_col += '<ul class="list-unstyled">';
            for ( var ndx in bldr.services ) {
              if ( bldr.services[ndx] ) {
                builder_col += '<li><em>' + ndx + '</em></li>';
              }
            }
            builder_col += '</ul>';
            builder_col += '</div>';
            builder_col += '</div>';
            builder_col += '<div class="row">';
            builder_col += '<div class="col-md-7">';
            builder_col += '<button class="btn btn-block teal-button add-builder" data-builder="'+ bldr.id +'">Select This Business</button>';
            builder_col += '</div>';
            builder_col += '</div>';

            $('#certifiedRepairAgentsResults').append(builder_col);
            $('.certified-repair-agent').show();
          });
        } else {
          $('.certified-repair-agent').hide();
        }

        if( builder_applicator.length > 0 ) {
          builder_applicator.forEach(function (bldr) {
            builder_col = '<div class="col-md-6 single-builder featured-builder">';
            builder_col += '<div class="row top-row">';
            builder_col += '<div class="col-md-7">';
            builder_col += '<h3>' + bldr.title + '</h3>';
            builder_col += bldr.address + '<br>';
            builder_col += '<strong><a href="tel:+' + bldr.phone + '" class="phone-link" data-locationID="' + bldr.id + '">' + bldr.phone + '</a></strong>';
            if( bldr.website.length > 0 )
              builder_col += '<a href="http://' + bldr.website + '" target="_blank" class="website-link" data-locationID="' + bldr.id + '">' + bldr.website + '</a>';
            builder_col += '</div>';
            builder_col += '<div class="col-md-5">';
            builder_col += '<strong>Services</strong>';
            builder_col += '<ul class="list-unstyled">';
            for ( var ndx in bldr.services ) {
              if ( bldr.services[ndx] ) {
                builder_col += '<li><em>' + ndx + '</em></li>';
              }
            }
            builder_col += '</ul>';
            builder_col += '</div>';
            builder_col += '</div>';
            builder_col += '<div class="row">';
            builder_col += '<div class="col-md-7">';
            builder_col += '<button class="btn btn-block teal-button add-builder" data-builder="'+ bldr.id +'">Select This Business</button>';
            builder_col += '</div>';
            if(bldr.logoURL.length > 5) {
              builder_col += '<div class="col-md-3 builder-images">';
              builder_col += '<img src="' + bldr.logoURL + '" class="img-responsive img-rounded">';
              builder_col += '</div>';
            }
            builder_col += '</div>';

            $('#builderApplicatorResults').append(builder_col);
            $('.builder-applicator').show();
          });
        } else {
          $('.builder-applicator').hide();
        }

        if( elite_builders.length > 0 ) {
          elite_builders.forEach(function (bldr) {
            builder_col = '<div class="col-md-6 single-builder featured-builder">';
            builder_col += '<div class="row top-row">';
            builder_col += '<div class="col-md-5">';
            builder_col += '<h3>' + bldr.title + '</h3>';
            builder_col += bldr.address + '<br>';
            builder_col += '<strong><a href="tel:+' + bldr.phone + '" class="phone-link" data-locationID="' + bldr.id + '">' + bldr.phone + '</a></strong>';
            if( bldr.website.length > 0 )
              builder_col += '<a href="http://' + bldr.website + '" target="_blank" class="website-link" data-locationID="' + bldr.id + '">' + bldr.website + '</a>';
            builder_col += '</div>';
            builder_col += '<div class="col-md-3">';
            builder_col += '<strong>Services</strong>';
            builder_col += '<ul class="list-unstyled">';
            for ( var ndx in bldr.services ) {
              if ( bldr.services[ndx] ) {
                builder_col += '<li><em>' + ndx + '</em></li>';
              }
            }
            builder_col += '</ul>';
            builder_col += '</div>';
            builder_col += '<div class="row">';
            builder_col += '<div class="col-md-7">';
            builder_col += '<button class="btn btn-block teal-button add-builder" data-builder="'+ bldr.id +'">Select This Business</button>';
            builder_col += '</div>';
            if(bldr.logoURL.length > 5) {
              builder_col += '<div class="col-md-3 builder-images">';
              builder_col += '<img src="' + bldr.logoURL + '" class="img-responsive img-rounded">';
              builder_col += '</div>';
            }
            builder_col += '</div>';

            $('#eliteBuildersResults').append(builder_col);
            $('.elite-builders').show();
          });
        } else {
          $('.elite-builders').hide();
        }

        $('.builder-results, .builder-cta, .get-info-button, .revise-link').show();
        var selectors = [".authorized-applicators .featured-builder .top-row"];
        selectors.push(".elite-builders .featured-builder .top-row");
        selectors.push(".certified-builders .regular-builder");
        selectors.push(".registered-builders .regular-builder");
        matchHeight(selectors);
      }

      // get geocoordinates of a single builder by address
      function getCoords(builder) {
        var request = $.ajax({
          type: "POST",
          dataType: "json",
          url: encodeURI('https://maps.googleapis.com/maps/api/geocode/json?address=' + builder.f[12] + ',' + builder.f[15] + ',' + builder.f[13] + '&key=AIzaSyBxs3Iab6XLR5jP4mC75fsE3UFf3KJsIJU')
        });

        request.done(function( response ) {
          if ( response.status === 'OK' ) {
            return response.results[0].geometry.location;
          }
        });
      }

      // function for clearing markers from map and emptying all arrays of builders
      function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
        locations = [];
        authorized_applicators = [];
        elite_builders = [];
        certified_builders = [];
        registered_builders = [];

        // clear html results
        $('.returned-results').html('');
      }

      // get ticket for API Post Record
      function getTicket() {
        // get initial states
        var data = {
          'action': 'get_ticket'
        };

        return request = $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: ajaxurl
        });
      }

      // submit builder leads
      function submitBuilderLeads(rid) {


        // check all required fields are filled
        var reqFields = $leadForm.find("input[data-parsley-required]");
        for(var i = 0; i < reqFields.length; i++) {
          if( !$(reqFields[i]).length ) {
            //console.log("Not all fields filled out. Abort mission Captain.");
            return false;
          }
        }

        var formData = $leadForm.serialize();
        var numBuilders = $('.builder-checkbox:checked').length;

        $('.builder-checkbox:checked').each(function (ndx) {
          var builderID = $(this).val();
          // get ticket
          getTicket().done(function( response ) {
            ticket = response.ticket;

            var data = {
              'action'    : 'submit_builder_lead',
              'ticket'    : ticket,
              'builderID' : builderID,
              'rid'       : rid
            };

            var request = $.ajax({
              type: "POST",
              data: data,
              dataType: "json",
              url: ajaxurl
            });

            request.done(function( response ) {
              if( ndx === ( numBuilders - 1 ) ) {
                if (numBuilders > 1) {
                  $multipleMessage.show();
                } else {
                  $singleMessage.show();
                }
                $leadForm.hide();
                $formMessage.show();
                setTimeout( function(){ location.reload(); } , 3000 );
              }
            });

          });
        });

      }

      function getBuilders() {
        var formData = $form.serialize();

        var data = {
          'action': 'get_builders',
          'form_data': formData
        };

        var request = $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: ajaxurl
        });

        request.done(function( response ) {
          builders = response.table.records.record;
          if (builders) {
            if(!Array.isArray(builders)) {
              builders = [builders];
            }
            // filter duplicate builders
            //console.log("Total builders returned from database call: " + builders.length);
            builders = filterDuplicateBuilders(builders);
            // filter by services
            var noServices = 0;
            for( var i = 0; i < builders.length; i++) {
              if( !(builders[i].f[11]+builders[i].f[12]+builders[i].f[13]+builders[i].f[14]+builders[i].f[15]) )
                noServices++;
            }
            //console.log("Builders with no services listed: " + noServices);
            builders = filterByServices(builders);

            getLocations(builders);
          } else {
            $btn.button('reset');
            alert('No results matched your filters! Please try again with a different combination.');
          }
        });
      }

      /* Event tracking */

      function trackClick(type, locationID) {
        // get ticket
        getTicket().done(function( response ) {
          ticket = response.ticket;

          var data = {
            'action'      : 'track_click',
            'type'        : type,
            'locationID'  : locationID,
            'ticket'      : ticket,
            'time'        : Date.now
          };

          var request = $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: ajaxurl
          });

          request.done(function( response ) {

            recordID = response.rid;
          });

        });
        
      }

      $(document).on('click', '.website-link', function (e) {
        var location = $(this).attr('data-locationID');
        trackClick('Website Link Click', location);
      });

      $(document).on('click', '.address-link', function (e) {
        var location = $(this).attr('data-locationID');
        trackClick('Map Address Click', location);
      });

      $(document).on('click', '.phone-link', function (e) {
        e.preventDefault();
        var location = $(this).attr('data-locationID');
        var href = $(this).attr('href');
        trackClick('Phone Number Click', location);
        // window.location.href = href;
      });

      $("#interestedProducts option:first-child").click(function(){
        $("#interestedProducts").toggleClass("drop-down");
      });

      // call on page load
      getInitialLocation();
      //init parsley
      $form.parsley();
      $leadForm.parsley();

      // get initial states
      // var data = {
      //   'action': 'get_states'
      // };

      // var request = $.ajax({
      //   type: "POST",
      //   data: data,
      //   dataType: "json",
      //   url: ajaxurl
      // });

      // request.done(function( response ) {
      //   var options = '<option value="">State</option>';
      //   response.table.records.record.forEach( function (state) {
      //     options += '<option value="' + state.f[0] + '">' + state.f[0] + '</option>';
      //   });
      //   $state.html(options);
      // });

      // request.fail(function( jqXHR, textStatus ) {
      //   alert( "Request failed: " + textStatus );
      // });


      // show/hide fields on builder type change
      $type.change(function (e) {
        e.preventDefault();
        var type = $(this).val();
        if ( type === 'Builder' ) {
          $remodels.prop('checked', false ).attr('disabled', false);
          $construction.prop('checked', true ).attr('disabled', true);
          $residentials.prop('checked', false );
        } else if ( type === 'Remodel' ) {
          $remodels.prop('checked', true ).attr('disabled', true);
          $construction.prop('checked', false ).attr('disabled', false);
          $residentials.prop('checked', false );
        } else {
          $remodels.prop('checked', false ).attr('disabled', false);
          $construction.prop('checked', false ).attr('disabled', false);
          $residentials.prop('checked', true );
        }
      });

      // get counties on state change
      // $state.change(function (e) {
      //   e.preventDefault();
      //   var state = $(this).val();

      //   // get initial states
      //   var data = {
      //     'action': 'get_counties',
      //     'state': state
      //   };

      //   var request = $.ajax({
      //     type: "POST",
      //     data: data,
      //     dataType: "json",
      //     url: ajaxurl
      //   });

      //   request.done(function( response ) {
      //     var options = '';
      //     response.table.records.record.forEach( function (county) {
      //       options += '<option value="' + county.f[0] + '">' + county.f[0] + '</option>';
      //     });
      //     $county.html(options);
      //   });
      // });

      // hide zip on international selection
      $country.change(function (e) {
        e.preventDefault();
        var country = $(this).val();
        $form.parsley().destroy();
        if( country === 'USA') {
          $locationRow.show();
          $servicesRow.show();
          $zip.attr('data-parsley-required', 'true');
          $radius.attr('data-parsley-required', 'true');
        } else {
          $locationRow.hide();
          $servicesRow.hide();
          $zip.attr('data-parsley-required', 'false');
          $radius.attr('data-parsley-required', 'false');
        }
        $form.parsley();

      });

      // form submission
      $form.submit(function (e) {
        e.preventDefault();
        if ($form.parsley().isValid()) {
          clearMarkers();
          $btn.button('loading');

          if( $country.val() !== 'USA' ) {
            getBuilders();
          } else {
            var zip = $zip.val();
            var data = {
              'action': 'get_county',
              'zip': zip
            };

            var request = $.ajax({
              type: "POST",
              data: data,
              dataType: "json",
              url: ajaxurl
            });

            request.done(function( response ) {
              if( !response.table.records.record ) {
                $btn.button('reset');
                alert("No builders found");
              }
              else {
                var state = response.table.records.record.f[2];
                var county = response.table.records.record.f[3];
                $state.val(state);
                $county.val(county);
                getBuilders();                
              }
            });
          }
        }
      });

      $(document).on('click', '.add-builder', function (e) {
        e.preventDefault();

        var builderID = $(this).attr('data-builder');
        $('#location-' + builderID).prop('checked', true);
        $(this).removeClass('add-builder').addClass('remove-builder').html('Remove');
      });

      $(document).on('click', '.remove-builder', function (e) {
        e.preventDefault();

        var builderID = $(this).attr('data-builder');
        $('#location-' + builderID).prop('checked', false);
        $(this).removeClass('remove-builder').addClass('add-builder').html('Select This Business');
      });

      // prevent modal opening unless builders are selected
      $('.get-info-button').click(function (e) {
        e.preventDefault();
        var numBuilders = $('.builder-checkbox:checked').length;
        if (numBuilders == 0) {
          alert('Please select some builders to contact!');
        } else {
          $leadFormModal.modal('show');
        }
      });

      // allow multiple select without holding ctrl
      $('#interestedProducts option').mousedown(function(e) {
        e.preventDefault();
        if( $(this).val().length )
          $(this).prop('selected', !$(this).prop('selected'));
      });

      // submit get info form
      $leadForm.submit(function (e) {
        e.preventDefault();
        $("#correctedInterestedProducts").val( $("#interestedProducts").val().toString().replace(/,/g, ";") );
        $("#interestedProducts").val("");
        var formData = $(this).serialize();

        // get ticket
        getTicket().done(function( response ) {
          ticket = response.ticket;

          var data = {
            'action'    : 'submit_lead',
            'form_data' : formData,
            'ticket'    : ticket
          };

          var request = $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: ajaxurl
          });

          //console.log("Lead form ticket: " + ticket);

          request.done(function( response ) {

            recordID = response.rid;
            submitBuilderLeads(recordID);
          });

        });
      });
    }

  }

};

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = Roots;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    UTIL.fire('common');

    $.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
      UTIL.fire(classnm);
    });
  }
};

$(document).ready(UTIL.loadEvents);

function XML2OBJ(xml) {
  var obj = {},
    nodeType,
    count = 0;
  while (xml != null) {
    nodeType = xml.nodeType;
    if (xml.nodeName == 'records') {
      var arr = [],
        temp = xml.firstChild;
      while (temp != null) {
        if (temp.nodeType == 1) {
          arr.push(XML2OBJ(temp));
        }
        temp = temp.nextSibling;
      }
      obj[xml.nodeName] = arr;
    } else if (xml.nodeName == 'record') {
      return XML2OBJ(xml.firstChild);
    } else if (nodeType == 1 || nodeType == 9) {
      var temp = xml.id || xml.nodeName;
      obj[temp] = XML2OBJ(xml.firstChild);
    } else if (!/^\s*$/.test(xml.nodeValue)) {
      return xml.nodeValue;
    }
    xml = xml.nextSibling;
  }
  if (nodeType == 9) {
    return obj['#document']['qdbapi'];
  }
  return obj;
}

//Returns the distance between the two points in miles.
function GetDist(lat1, lon1, lat2, lon2) {
  var deg2rad = function (deg) {
    return deg * (Math.PI / 180);
  };
  var R = 6371, //radius of the earth in KM
    K = 0.62137119; //contstant for KM to MI converison
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  var m = d * K;
  return m; //miles
  //    return d; //kilometers
}

function randomColor(){
  var color = "rgb(";
  color += Math.round(Math.random()*255);
  color += ",";
  color += Math.round(Math.random()*255);
  color += ",";
  color += Math.round(Math.random()*255);
  color += ")";
  return color;
}

// Global variables and constants for pool function
// var selectedBlend;
// var EMERALD_BLEND = "emerald-blend";
// var JADE_BLEND = "jade-blend";
// var BLUE_BLEND = "blue-blend";

// update pool finish function.
// 2 params - color and finish
function updatePoolFinish( color, finish ) {
  // update current finish text
  $('#currentFinish').removeClass().addClass(color).html( camelCaseHack(finishParent.replace('-', '')) + " " + finish.replace('-', ' ').replace('-', ' '));
  $('#currentDescription').html(descriptions[finish]);
  $('#finishingTouches').html(finishingTouches[finish]);
  $('#printFinishingTouches').html(finishingTouches[finish]);
  var url = ppBase + ppParent + "/" + formatFinishes(finish) + ".png";
  $("#theEntirePoolPickerInOneImage").css('background-image', 'url(' + url + ')');
  // update print
  $('#printFinish').html( capitalize( finishParent.replace('-', '') + " " + finish.replace('-', ' ').replace('-', ' ') ) );
  $('#printFinishDesc').html( descriptions[finish] );
  updateGalleryLinks( finishParent, finish );
}

// update pool color function
// 1 param - color
function updatePool( color ) {
    // get selected finish and update pool finish
    var finish = $('#poolFinishes').find(":selected").val();
    updatePoolFinish( color, finish);
}

function isRGB(str){
  if(str.match(/rgb/g)){
    return true;
  }
  else {
    return false;
  }
}

function updateGalleryLinks(finishParent, finish){
  var link = "#";

  switch(finishParent) {
    case 'beadcrete':
      link = "/beadcrete-image-gallery/?ftg-set=" + finish + "#5";
      break;
    case 'pebble-fina':
      link = "/pebblefina-image-gallery/?ftg-set=" + finish + "#4";
      break;
    case 'pebble-sheen':
      link = "/pebblesheen-image-gallery/?ftg-set=" + finish + "#3";
      break;
    case 'pebble-tec':
      link = "/pebble-tec-image-gallery/?ftg-set=" + finish + "#2";
      break;
    case 'pebble-brilliance':
      link = "/pebblebrilliance-image-gallery/?ftg-set=" + finish + "#8";
      break;
    default:
      link = "#";
      break;
  }

  $("#finishGalleryLink").attr("href", link);

}

function preLoadPoolTextures(){
  var arrayOfImages = new Array();
  switch(finishParent) {
    case 'beadcrete':
      ppParent = "Crete";
      arrayOfImages = [
        ppBase + ppParent + '/AquaMarine.png',
        ppBase + ppParent + '/AquaSplash.png',
        ppBase + ppParent + '/BlackSea.png',
        ppBase + ppParent + '/BlackSplash.png',
        ppBase + ppParent + '/BlueMist.png',
        ppBase + ppParent + '/FrenchQuarter.png',
        ppBase + ppParent + '/Laguna.png',
        ppBase + ppParent + '/Majestic.png',
        ppBase + ppParent + '/Sapphire.png',
        ppBase + ppParent + '/SeaBreeze.png',
        ppBase + ppParent + '/SeaSide.png',
        ppBase + ppParent + '/Tahitan.png',
        ppBase + ppParent + '/WaterBlue.png'
      ];
      break;
    case 'pebble-fina':
      ppParent = "Fina";
      arrayOfImages = [
        ppBase + ppParent + '/Acquos.png',
        ppBase + ppParent + '/BellaBlue.png',
        ppBase + ppParent + '/BlackGalaxy.png',
        ppBase + ppParent + '/CieloBlue.png',
        ppBase + ppParent + '/Classico.png',
        ppBase + ppParent + '/EgyptianSands.png',
        ppBase + ppParent + '/EmeraldGalaxy.png',
        ppBase + ppParent + '/FrescaVerde.png',
        ppBase + ppParent + '/Grigio.png',
        ppBase + ppParent + '/SapphireGalaxy.png',
        ppBase + ppParent + '/SteelGray.png'
      ];
      break;
    case 'pebble-sheen':
      ppParent = "Sheen";
      arrayOfImages = [
        ppBase + ppParent + '/AquaBlue.png',
        ppBase + ppParent + '/ArcticWhite.png',
        ppBase + ppParent + '/BlackOnyx.png',
        ppBase + ppParent + '/BlueGranite.png',
        ppBase + ppParent + '/BlueSurf.png',
        ppBase + ppParent + '/Bordeaux.png',
        ppBase + ppParent + '/CoolBlue.png',
        ppBase + ppParent + '/DesertGold.png',
        ppBase + ppParent + '/FrenchGrey.png',
        ppBase + ppParent + '/IrishMist.png',
        ppBase + ppParent + '/OceanBlue.png',
        ppBase + ppParent + '/PrismBlue.png',
        ppBase + ppParent + '/SeafoamGreen.png',
        ppBase + ppParent + '/SierraBlack.png',
        ppBase + ppParent + '/SlateBlue.png',
        ppBase + ppParent + '/TurtleBay.png',
        ppBase + ppParent + '/WhiteDiamonds.png'
      ];
      break;
    case 'pebble-tec':
      ppParent = "Tec";
      arrayOfImages = [
        ppBase + ppParent + '/BlackCanyon.png',
        ppBase + ppParent + '/BlackMarble.png',
        ppBase + ppParent + '/BlackPearl.png',
        ppBase + ppParent + '/BlueLagoon.png',
        ppBase + ppParent + '/CaribbeanBlue.png',
        ppBase + ppParent + '/CremeDeMenthe.png',
        ppBase + ppParent + '/EmeraldBay.png',
        ppBase + ppParent + '/Jade.png',
        ppBase + ppParent + '/MidnightBlue.png',
        ppBase + ppParent + '/MoonlightGrey.png',
        ppBase + ppParent + '/SandyBeach.png',
        ppBase + ppParent + '/SkyBlue.png',
        ppBase + ppParent + '/SoftWhite.png',
        ppBase + ppParent + '/TahoeBlue.png',
        ppBase + ppParent + '/TropicalBreeze.png',
        ppBase + ppParent + '/WhitePearl.png'
      ];
      break;
    case 'pebble-brilliance':
      ppParent = "Brilliance";
      arrayOfImages = [
        ppBase + ppParent + '/SparklingWater.png',
        ppBase + ppParent + '/AquaFalls.png',
        ppBase + ppParent + '/VividShores.png',
        ppBase + ppParent + '/GlacierBay.png',
        ppBase + ppParent + '/MajesticSound.png',
        ppBase + ppParent + '/DeepCove.png',
        ppBase + ppParent + '/Clearwater.png',
        ppBase + ppParent + '/CrystalHarbor.png'
      ];
      break;
    default:
      arrayOfImages = [
        ppBase + 'Crete/AquaMarine.png',
        ppBase + 'Crete/AquaSplash.png',
        ppBase + 'Crete/BlackSea.png',
        ppBase + 'Crete/BlackSplash.png',
        ppBase + 'Crete/BlueMist.png',
        ppBase + 'Crete/FrenchQuarter.png',
        ppBase + 'Crete/Laguna.png',
        ppBase + 'Crete/Majestic.png',
        ppBase + 'Crete/Sapphire.png',
        ppBase + 'Crete/SeaBreeze.png',
        ppBase + 'Crete/SeaSide.png',
        ppBase + 'Crete/Tahitan.png',
        ppBase + 'Crete/WaterBlue.png',
        ppBase + 'Fina/Acquos.png',
        ppBase + 'Fina/BellaBlue.png',
        ppBase + 'Fina/BlackGalaxy.png',
        ppBase + 'Fina/CieloBlue.png',
        ppBase + 'Fina/Classico.png',
        ppBase + 'Fina/EgyptianSands.png',
        ppBase + 'Fina/EmeraldGalaxy.png',
        ppBase + 'Fina/FrescaVerde.png',
        ppBase + 'Fina/Grigio.png',
        ppBase + 'Fina/SapphireGalaxy.png',
        ppBase + 'Fina/SteelGray.png',
        ppBase + 'Sheen/AquaBlue.png',
        ppBase + 'Sheen/ArcticWhite.png',
        ppBase + 'Sheen/BlackOnyx.png',
        ppBase + 'Sheen/BlueGranite.png',
        ppBase + 'Sheen/BlueSurf.png',
        ppBase + 'Sheen/Bordeaux.png',
        ppBase + 'Sheen/CoolBlue.png',
        ppBase + 'Sheen/DesertGold.png',
        ppBase + 'Sheen/FrenchGrey.png',
        ppBase + 'Sheen/IrishMist.png',
        ppBase + 'Sheen/OceanBlue.png',
        ppBase + 'Sheen/PrismBlue.png',
        ppBase + 'Sheen/SeafoamGreen.png',
        ppBase + 'Sheen/SierraBlack.png',
        ppBase + 'Sheen/SlateBlue.png',
        ppBase + 'Sheen/TurtleBay.png',
        ppBase + 'Sheen/WhiteDiamonds.png',
        ppBase + 'Tec/BlackCanyon.png',
        ppBase + 'Tec/BlackMarble.png',
        ppBase + 'Tec/BlackPearl.png',
        ppBase + 'Tec/BlueLagoon.png',
        ppBase + 'Tec/CaribbeanBlue.png',
        ppBase + 'Tec/CremeDeMenthe.png',
        ppBase + 'Tec/EmeraldBay.png',
        ppBase + 'Tec/Jade.png',
        ppBase + 'Tec/MidnightBlue.png',
        ppBase + 'Tec/MoonlightGrey.png',
        ppBase + 'Tec/SandyBeach.png',
        ppBase + 'Tec/SkyBlue.png',
        ppBase + 'Tec/SoftWhite.png',
        ppBase + 'Tec/TahoeBlue.png',
        ppBase + 'Tec/TropicalBreeze.png',
        ppBase + 'Tec/WhitePearl.png',
        ppBase + '/SparklingWater.png',
        ppBase + '/AquaFalls.png',
        ppBase + '/VividShores.png',
        ppBase + '/GlacierBay.png',
        ppBase + '/MajesticSound.png',
        ppBase + '/DeepCove.png',
        ppBase + '/Clearwater.png',
        ppBase + '/CrystalHarbor.png'
      ];
  }
  // add priority images to beginning of array
  // arrayOfImages.unshift(
  //   "/wp-content/themes/pebbletec/assets/img/finish-textures/pebble-tec.png",
  //   "/wp-content/themes/pebbletec/assets/img/finish-textures/pebble-sheen.png",
  //   "/wp-content/themes/pebbletec/assets/img/finish-textures/pebble-fina.png",
  //   "/wp-content/themes/pebbletec/assets/img/finish-textures/beadcrete.png"
  //   );
  // $(arrayOfImages).each(function(){
  //     $('<img/>')[0].src = this;
  // });
}

function breadCrumbFix() {
  // grab all the a tags in the breadcrumbs div
  var actualLinks = $("#breadcrumbs").find("a");
  // this is a list of all ghost links in the main navigation to my knowledge.
  var ghostLinks = ['/inspirational-tools/', '/why-pebble-tec/', '/browse-our-products/', '/the-process/', '/customer-support/'];
  // loop through every link found in the breadcrumbs
  for(var i = 0; i < actualLinks.length; i++) {
    // set current breadcrumb link to link
    var link = $(actualLinks[i]).attr('href');
    // loop through list of ghost links to compare against the link
    for(var j = 0; j < ghostLinks.length; j++) {
      // set current ghostlink to compstring for easier reading
      var compString = ghostLinks[j];
      // if the compstring is not a substring of the link, the function will return -1.
      // so if it does not return -1. we have a match
      if((link.indexOf(compString)) != -1) {
        // yay we found a ghost link!
        // remove the href and text decoration so it doesnt underline on hover.
        $(actualLinks[i]).removeAttr('href');
        $(actualLinks[i]).css('text-decoration', 'none');
      }
    }
  }
}

function camelCaseHack(finish) {

  var cameledString;

  if(finish.indexOf("pebble") > -1) {
    // format string
    cameledString = finish.substring(0, 6) + finish[6].toUpperCase() + finish.substring(7);
  }
  if(finish.indexOf("bead") > -1) {
    // format string
    cameledString = finish.substring(0, 4) + finish[4].toUpperCase() + finish.substring(5);
  }

  return cameledString;
}

function formatFinishes(finish) {
  // capitalize first character in string
  var str = finish.charAt(0).toUpperCase();
  // first char already pushed, start i at 1
  for(var i = 1; i < finish.length; i++) {
    if(finish.charAt(i) == '-') {
      // skip an index to delete -
      i++;
      // capitalize this character before pushing
      str += finish.charAt(i).toUpperCase();
    }
    else {
      str += finish.charAt(i);
    }
  }
  return str;
}

/* takes in an array of selectors and matches their heights */
function matchHeight(selArr) {
    setTimeout(function(){
      matchHeightHelper(selArr);
    }, 100);
    // call match height again if window resizes
    jQuery(window).resize(function(){
      matchHeightHelper(selArr);
    });
}

/* this function actually matches the heights of the selectors */
function matchHeightHelper(selArr) {
  for(var j = 0; j < selArr.length; j++) {
    var sel = selArr[j];
    // make sure there are elements on the page that match the selector
    if( jQuery(sel).length ) {
      // clear old minheight for accurate measurement
      jQuery(sel).css('min-height', '0');
      // send the elements to an array
      var elements = jQuery(sel).toArray();
      // set max height to first element in array
      var max = jQuery(elements[0]).outerHeight();
      // loop through array and save the tallest element
      for(var i = 1; i < elements.length; i++) {
        // grab height of current element
        var newHeight = jQuery(elements[i]).outerHeight();
        // compare and save
        if(max < newHeight) {
          max = newHeight;
        }
      } // end for
      // round up 1px for cleanliness
      max = Math.floor(max) + 1;
      // set all to min-height of max-height
      for(var i = 0; i < elements.length; i++) {
        jQuery(elements[i]).css("min-height", max + "px");
      } // end for
    }// end if sel.length
  }
}

$.fn.goTo = function() {
  $('html, body').animate({
    scrollTop: $(this).offset().top - 125
  }, 1000);
  return this; // for chaining...
}

/* Date.now shim */
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

function capitalize(string) {
  var str = string.split(" ");
  var rtnstr = "";
  for(var i = 0; i < str.length; i++) {
    rtnstr += str[i].charAt(0).toUpperCase() + str[i].substring(1) + " ";
  }
  return rtnstr;
}

})(jQuery); // Fully reference jQuery after this point
