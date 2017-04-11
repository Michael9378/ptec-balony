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
      // // check if IE or Firefox, then the pool picker is going to be broken and needs to be fixed with haxzors
      // navigator.sayswho = (function(){
      //     var ua= navigator.userAgent, tem,
      //     M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      //     if(/trident/i.test(M[1])){
      //         tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      //         return 'IE '+(tem[1] || '');
      //     }
      //     if(M[1]=== 'Chrome'){
      //         tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
      //         if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      //     }
      //     M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      //     if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
      //     return M.join(' ');
      // })();
      // // Check if internet explorer or firefox, dont care what version
      // if ((navigator.sayswho.substring(0,2)).toLowerCase() == "ie") {
      //   // console.log("This is IE");
      //   brokenPoolPicker = true;
      // };
      // if ((navigator.sayswho.substring(0,2)).toLowerCase() == "ms") {
      //   // console.log("This is IE");
      //   brokenPoolPicker = true;
      // };
      // if ((navigator.sayswho.substring(0,2)).toLowerCase() == "ed") {
      //   // console.log("This is IE");
      //   brokenPoolPicker = true;
      // };
      // if ((navigator.sayswho.substring(0,2)).toLowerCase() == "fi") {
      //   // console.log("This is Firefox");
      //   brokenPoolPicker = true;
      // };
      // if ((navigator.sayswho.substring(0,2)).toLowerCase() == "op") {
      //   // console.log("This is Firefox");
      //   brokenPoolPicker = true;
      // };

      // to test ie in chrome
      // brokenPoolPicker = true;

      // // initialize finish and color variables
      var finish, color;
      // depth = 5;

      // // add broken class to body for ie fixes
      // if(brokenPoolPicker) {
      //   $("body").addClass("broken-pool-picker");
      // }

      // // initialize depth slider on side of pool visualizer
      // var depthSlider = $('#depthSlider').slider({
      //   orientation: 'vertical'
      // });
      // // bind slide event from slider
      // $(document).on('change', '#depthSlider', function(slideEvt) {
      //   // insert code to change pool depth visualization
      //   // depth will be from 1-10 (int)
      //   if(slideEvt.value.newValue != slideEvt.value.oldValue) {
      //     updateDepth(slideEvt.value.newValue, selectedBlend);
      //   }

      // });

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
            $('#colorPicker').carousel('next', function() { console.log('here'); });
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
              }
              else
                console.log(response.error_message);
            }
            if (counter === 0) {

              stuck = false;

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
            // console.log(userLocation.lat, userLocation.lng);
            map.panTo(userLocation);

            var i = locations.length;
            while (i--) {
              // console.log(locations[i].position.lat, locations[i].position.lng);
              var distance = GetDist(locations[i].position.lat, locations[i].position.lng, userLocation.lat, userLocation.lng);
              // console.log(distance);
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
        return uniqueBuilders;
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

          var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h5 class="teal">' + locations[i].title + '</h5>'+
                '<h5 class="teal">' + locations[i].phone + '</h5>'+
                '<div id="bodyContent">'+
                '<p><a href="https://maps.google.com?q=' + locations[i].address + '" target="_blank" class="address-link" data-locationID="' + locations[i].id + '">' + locations[i].address + '</a></p>'+
                '</div>'+
                '</div>';

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
            // builder_col += '<div class="col-md-4 builder-images">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '<div class="row secondary-row">';
            // builder_col += '<div class="col-md-6 secondary left">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '</div>';
            // builder_col += '<div class="col-md-6 secondary right">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '</div>';
            // builder_col += '</div>';
            // builder_col += '</div>';
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
            // builder_col += '<div class="col-md-4 builder-images">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '<div class="row secondary-row">';
            // builder_col += '<div class="col-md-6 secondary left">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '</div>';
            // builder_col += '<div class="col-md-6 secondary right">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '</div>';
            // builder_col += '</div>';
            // builder_col += '</div>';
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
            // builder_col += '<div class="col-md-4 builder-images">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '<div class="row secondary-row">';
            // builder_col += '<div class="col-md-6 secondary left">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '</div>';
            // builder_col += '<div class="col-md-6 secondary right">';
            // builder_col += '<img src="https://placeimg.com/640/480/nature" class="img-responsive img-rounded">';
            // builder_col += '</div>';
            // builder_col += '</div>';
            // builder_col += '</div>';
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
            console.log("Not all fields filled out. Abort mission Captain.");
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
            builders = filterDuplicateBuilders(builders);

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
        // console.log('Click event: ' + type + ' - ' + locationID);
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
        } else if ( type === 'Remodel' ) {
          $remodels.prop('checked', true ).attr('disabled', true);
          $construction.prop('checked', false ).attr('disabled', false);
        } else {
          $remodels.prop('checked', false ).attr('disabled', false);
          $construction.prop('checked', false ).attr('disabled', false);
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

      // submit get info form
      $leadForm.submit(function (e) {
        e.preventDefault();
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
  // hide all finish options
  // $('.finish-option').hide();
  // // show related options
  // $('.' + finish + '-option').show();
  // if(brokenPoolPicker){
  //   $("#poolLuminious").find("option").removeProp('disabled');
  //   $("#poolLuminious").find("option[style='display: none;']").prop('disabled', true);
  // }
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
  // if the pool picker is broken, call the ie function for update instead

  // if(brokenPoolPicker) {
  //   updatePoolIE();
  //   $('#currentFinish').removeClass().addClass(color);
  // // }
  // else {
    // get selected finish and update pool finish
    var finish = $('#poolFinishes').find(":selected").val();
    updatePoolFinish( color, finish);

    // water color
    // $("#shadowImg").removeClass().addClass(color);

    // // terrain controller
    // var terrain = $("#poolEnvironment").find(":selected").val();
    // $('#terrain').removeClass().addClass(terrain);

    // // pool shape controller
    // var shape =  $("#poolShape").find(":selected").val();
    // $('#deck, #pool, #pool-water').removeClass().addClass(shape);
    // var shapeprefix = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-";
    // var svgurl = shapeprefix+shape+".png";
    // $('#shadowImg').attr('src', svgurl);

    // // decking controller
    // var decking = $("#poolCoping").find(":selected").val();
    // var deckprefix = "/wp-content/themes/pebbletec/assets/poolpicker/PS-Tiles/";
    // var deckImg = deckprefix+decking+".png";
    // $('#deckImg').attr('src', deckImg);

    // // Shimmer
    // var isChecked = $("#poolShimmering")[0].checked;
    // if(isChecked) {
    //   $('img[src="/wp-content/themes/pebbletec/assets/poolpicker/watrz.gif"], img[src="/wp-content/themes/pebbletec/assets/poolpicker/watrzshimmer.gif"]').attr('src', '/wp-content/themes/pebbletec/assets/poolpicker/watrzshimmer.gif');
    // } else {
    //   $('img[src="/wp-content/themes/pebbletec/assets/poolpicker/watrz.gif"], img[src="/wp-content/themes/pebbletec/assets/poolpicker/watrzshimmer.gif"]').attr('src', '/wp-content/themes/pebbletec/assets/poolpicker/watrz.gif');
    // }

    // // set curret blend
  //   // selectedBlend = $("#poolLuminious").find(":selected").val();
  // }
}


// // Depth slider and preloader work in ie, no need to go any further
// function updateDepth(val, currentBlend){
//   // slider defaults to 5, so set the default depth to 0.
//   var depth = 5-val;
//   // grab the background color and parse it into their rgb values (out of 255);
//   var depthColor = initialColor;
//   var red;
//   var green;
//   var blue;

//   // if its in rgb format, parse this way
//   if(isRGB(depthColor)){
//     var temp = depthColor.split("(");
//     var rgb = temp[1].split(",");
//     red = parseInt(rgb[0]);
//     green = parseInt(rgb[1]);
//     blue = parseInt(rgb[2]);
//   } // if not rgb, then most likely hex
//   else {
//     var hex = depthColor.split("#")[1];
//     red = parseInt(hex.substring(0,2), 16);
//     green = parseInt(hex.substring(2,4));
//     blue = parseInt(hex.substring(4,6));
//   }
//   // tint red green and blue by averagering how far from their respective tint they are
//   // if(currentBlend == EMERALD_BLEND){
//   //   // emerald rgb(80, 200, 120)
//   //   red = Math.round((red*2+80)/3);
//   //   green = Math.round((green*2+200)/3);
//   //   blue = Math.round((blue*2+120)/3);
//   // }
//   // if(currentBlend == JADE_BLEND){
//   //   //jade rgb(0, 168, 107)
//   //   red = Math.round((red*2+0)/3);
//   //   green = Math.round((green*2+168)/3);
//   //   blue = Math.round((blue*2+107)/3);
//   // }
//   // if(currentBlend == BLUE_BLEND){
//   //   // blue rgb(63, 118, 165)
//   //   red = Math.round((red+50)/2);
//   //   green = Math.round((green+100)/2);
//   //   blue = Math.round((blue+195)/2);

//   // }

//   // amplify depth measurement and add to colors
//   depth = depth*10;
//   red = depth+red;
//   green = depth+green;
//   blue = depth+blue;

//   // reset water color
//   var str = "rgb("+red+","+green+","+blue+")";
//   if(!brokenPoolPicker){
//     $("#shadowImg").css("background-color", str);
//   }
//   else {
//     $("#waterColor path").attr("fill", str);
//   }

// }

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
// function setUpPoolIE(){
//   $("#poolHolder").html('<div id="terrain" class="grass"> </div><div id="deck" class="kidney"> <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><defs><clipPath id="deck-svg"><path class="deck-path" d="M579,10c44.495-2.119,95.482,0.833,139,4c88.782,6.462,166.833,18.714,232,54 c29.179,15.799,62.745,41.108,70,72c8.155,34.727-12.913,59.514-32,74c-94.048,71.379-297.471,54.632-399,6 c-15.548-7.447-30.536-18.046-46-23c-34.196-10.956-77.612-4.609-109,4c-64.535,17.7-149.398,26.215-220,6 c-31.084-8.9-66.894-25.003-69-56c-2.449-36.044,43.078-65.198,67-78c32.408-17.343,69.135-28.219,107-36 C403.732,19.589,484.619,14.494,579,10z M380,57c-27.56,4.854-57.377,11.983-77,21c-19.631,9.021-51.416,25.939-50,49 c1.134,18.473,26.166,26.918,39,31c27.905,8.875,57.817,9.156,87,6c28.578-3.091,53.307-11.849,81-16 c58.38-8.75,117.601-2.289,166,21c63.975,30.784,170.813,41.596,243,12c22.089-9.057,47.209-26.579,47-51 c-0.15-17.541-11.691-27.907-23-36c-46.784-33.479-97.141-42.951-173-51c-49.512-5.253-108.261-7.511-161-5 C492.416,41.171,438.878,46.631,380,57z"/></clipPath></defs><title>Deck</title><desc>Deck</desc><image clip-path="url(#deck-svg)" width="1200" height="675" xlink:href="/wp-content/themes/pebbletec/assets/poolpicker/PS-Tiles/flagstone.png"/></svg> </div><div id="pool" class="kidney"> <svg id="waterColor" width="1200" height="675" style="position: absolute;"><path class="shape-path" fill="white" d="M273,95c56.369-36.561,139.48-47.094,224-54c86.949-7.104,157.154-7.019,242,3 c38.627,4.562,75.12,11.006,106,23c23.288,9.045,41.177,13.436,57,31c6.691,7.428,14.261,20.891,14,33 c-0.508,23.607-23.584,40.02-45,49c-67.322,28.232-167.596,21.589-231-5c-24.275-10.18-44.981-20.273-69-25 c-26.234-5.163-53.743-6.721-84-5c-53.969,3.069-100.366,25.2-160,20c-11.301-0.985-25.806-3.224-35-6 c-13.235-3.997-39.171-15.042-40-34C251.369,110.566,262.169,98.863,273,95z"></path></svg> <img id="shadowImg" src="/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-kidney.png"> </div><div id="pool-water" class="kidney"> <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" width="1200" height="675"><defs><clipPath id="water-gif-svg"><path class="shape-path" d="M273,95c56.369-36.561,139.48-47.094,224-54c86.949-7.104,157.154-7.019,242,3 c38.627,4.562,75.12,11.006,106,23c23.288,9.045,41.177,13.436,57,31c6.691,7.428,14.261,20.891,14,33 c-0.508,23.607-23.584,40.02-45,49c-67.322,28.232-167.596,21.589-231-5c-24.275-10.18-44.981-20.273-69-25 c-26.234-5.163-53.743-6.721-84-5c-53.969,3.069-100.366,25.2-160,20c-11.301-0.985-25.806-3.224-35-6 c-13.235-3.997-39.171-15.042-40-34C251.369,110.566,262.169,98.863,273,95z"/></clipPath></defs><title>Water Gif</title><desc>Water Gif</desc><image clip-path="url(#water-gif-svg)" width="1200" height="850" xlink:href="/wp-content/themes/pebbletec/assets/poolpicker/watrz.gif"/></svg> </div>');
//   //
// }
// function updatePoolIE( color ) {
//   // get selected finish and update pool finish
//   var finish = $('#poolFinishes').find(":selected").val();
//   updatePoolFinish( color, finish);
//   // clear the class and id from shadowImg
//   $("#shadowImg").removeClass();
//   $("#shadowImg").attr("id",'');
//   // call update Depth to add color to pool fill
//   updateDepth(5, '');

//   // terrain controller
//   var terrain = $("#poolEnvironment").find(":selected").val();
//   $('#terrain').removeClass().addClass(terrain);

//   var KIDNEY_INNER_PATH = "M273,95c56.369-36.561,139.48-47.094,224-54c86.949-7.104,157.154-7.019,242,3   c38.627,4.562,75.12,11.006,106,23c23.288,9.045,41.177,13.436,57,31c6.691,7.428,14.261,20.891,14,33   c-0.508,23.607-23.584,40.02-45,49c-67.322,28.232-167.596,21.589-231-5c-24.275-10.18-44.981-20.273-69-25   c-26.234-5.163-53.743-6.721-84-5c-53.969,3.069-100.366,25.2-160,20c-11.301-0.985-25.806-3.224-35-6   c-13.235-3.997-39.171-15.042-40-34C251.369,110.566,262.169,98.863,273,95z";
//   var KIDNEY_DECK_PATH = "M579,10c44.495-2.119,95.482,0.833,139,4c88.782,6.462,166.833,18.714,232,54   c29.179,15.799,62.745,41.108,70,72c8.155,34.727-12.913,59.514-32,74c-94.048,71.379-297.471,54.632-399,6   c-15.548-7.447-30.536-18.046-46-23c-34.196-10.956-77.612-4.609-109,4c-64.535,17.7-149.398,26.215-220,6   c-31.084-8.9-66.894-25.003-69-56c-2.449-36.044,43.078-65.198,67-78c32.408-17.343,69.135-28.219,107-36   C403.732,19.589,484.619,14.494,579,10z M380,57c-27.56,4.854-57.377,11.983-77,21c-19.631,9.021-51.416,25.939-50,49   c1.134,18.473,26.166,26.918,39,31c27.905,8.875,57.817,9.156,87,6c28.578-3.091,53.307-11.849,81-16   c58.38-8.75,117.601-2.289,166,21c63.975,30.784,170.813,41.596,243,12c22.089-9.057,47.209-26.579,47-51   c-0.15-17.541-11.691-27.907-23-36c-46.784-33.479-97.141-42.951-173-51c-49.512-5.253-108.261-7.511-161-5   C492.416,41.171,438.878,46.631,380,57z";

//   var RECTANGLE_INNER_PATH = "M854,44c39.137,46.198,82.404,93.594,119,139c-254.452,0.365-519.08,1.438-774,1   c-0.46-5.541,6.963-10.956,12-17c32.849-39.418,67.786-83.364,102-122c175.86,4.984,358.181-1.093,539,1   C853.086,45.752,852.678,44.012,854,44z";
//   var RECTANGLE_DECK_PATH = "M285,20c201.001,0,401.996,0,603,0c23.364,14.636,40.242,35.758,60,54   c20.86,16.806,38.283,37.05,59,54c18.699,18.967,38.354,36.979,58,55c9.604,9.396,19.349,18.651,29,28   c8.542,8.795,22.029,17.967,27,27c-349.597,1.074-700.395,0.929-1050,2c-4.616-0.746,3.472-3.954,3-7c2.754-1.912,5.087-4.246,7-7   c31.627-31.372,64.023-61.978,94-95c36.646-35.354,72.088-71.912,108-108C282.956,21.29,283.743,20.41,285,20z M610,46   c-73.657,0.162-191.561,2.666-297,0c-0.294-2.378-2.706,1.111-3,2c-19.289,22.378-37.634,45.699-57,68   c-8.87,12.13-19.667,22.333-28,35c-5.437,4.897-10.229,10.438-14,17c-3.596,1.737-4.98,5.687-8,8c-0.569,2.549-8.108,7.268-4,8   c257.936-0.065,514.329-1.671,773-1c-15.404-22.93-39.006-46.327-58-69c-20.335-22.999-38.868-47.798-61-69   C771.5,48.284,693.162,45.818,610,46z";

//   var FREEFORM_INNER_PATH = "M517,55c4.481,5.519,9.184,10.816,13,17c28.322,13.615,73.291,19.106,109,9   c11.422-3.233,19.486-11.685,32-17c29.326-12.457,72.464-9.739,103-2c9.628,2.44,18.119,9.062,28,8c3.969,1.895,3.999,3.851,6,6   c20.229-2.56,43.386-0.286,64,4c11.706,2.434,21.852,7.593,32,10c3.778,0.896,7.767-0.063,11,1c15.054,4.951,36.147,23.227,23,42   c-40.938-12.489-119.234-16.848-146,12c-22.161,23.885,9.022,53.824,24,65c-27.032,12.385-73.14,6.747-100-2   c-12.895-4.199-23.877-11.155-37-15c-50.351-14.753-116.373-13.134-163,4c-6.077,2.232-13.234,6.78-20,8   c-13.359,2.408-31.222,0-47,0c-15.723,0-31.603,0.193-46-1c-32.288-2.676-73.784-11.182-64-46c-23.807-2.654-52.35-2.745-74-12   c-15.983-6.833-39.639-27.062-22-48c2.678-3.179,7.832-4.738,13-8c13.863-8.749,28.932-16.285,47-22   C374.175,45.486,431.654,59.597,517,55z";
//   var FREEFORM_DECK_PATH = "M577,23c0.256,8.744,0.703,17.297,2,25c21.31,9.544,39.412-6.984,59-13   c37.037-11.375,92.402-13.981,140-8c21.492,2.701,41.706,10.131,63,14c24.686,4.485,49.022,4.653,72,9   c43.546,8.238,84.296,20.43,118,43c14.864,9.954,33.731,25.82,36,44c3.545,28.405-20.951,36.582-31,54   c-31.604-5.065-64.592-23.551-98-27c-14.533-1.5-37.668-0.372-40,12c-2.973,15.768,30.603,27.198,43,34   c17.899,9.82,33.949,18.975,49,29c-50.68,28.729-98.824,51-171,51c-54.274,0-99.705-9.72-140-26c-23.101-9.334-43.779-24.429-80-22   c-26.669,1.788-40.75,11.45-59,22c-5.147,2.976-12.048,7.922-17,9c-10.961,2.387-28.115,0-44,0c-109.414,0-236.807,9.875-264-71   c-26.04-4.613-53.018-12.253-72-25c-14.792-9.933-31.03-24.987-25-52c8.294-37.157,59.449-60.736,97-74   c44.517-15.725,89.026-24.489,143-27C428.58,20.717,508.284,24.379,577,23z M303,68c-18.068,5.715-33.137,13.251-47,22   c-5.168,3.262-10.322,4.821-13,8c-17.639,20.938,6.017,41.167,22,48c21.65,9.255,50.193,9.346,74,12   c-9.784,34.818,31.712,43.324,64,46c14.397,1.193,30.277,1,46,1c15.778,0,33.641,2.408,47,0c6.766-1.22,13.923-5.768,20-8   c46.627-17.134,112.649-18.753,163-4c13.123,3.845,24.105,10.801,37,15c26.86,8.747,72.968,14.385,100,2   c-14.978-11.176-46.161-41.115-24-65c26.766-28.848,105.063-24.489,146-12c13.147-18.773-7.946-37.049-23-42   c-3.233-1.063-7.222-0.104-11-1c-10.148-2.407-20.294-7.566-32-10c-20.614-4.286-43.771-6.56-64-4c-2.001-2.149-2.031-4.105-6-6   c-9.881,1.062-18.372-5.56-28-8c-30.536-7.739-73.674-10.457-103,2c-12.514,5.315-20.578,13.767-32,17   c-35.709,10.106-80.678,4.615-109-9c-3.816-6.184-8.519-11.481-13-17C431.654,59.597,374.175,45.486,303,68z";

//   var GRECIAN_INNER_PATH = "M799,68c3.469-0.469,0.573,5.427,3,6c33.979,1.021,64.115,5.885,88,17   c16.348-1.751,42.052,18.221,42,33c-0.091,25.855-47.118,29.054-74,30c-3.918,1.77,4.918,4.23,1,6   c-25.928-1.277-52.451,9.505-45,32c-151.971,0.043-310.982,1.677-467,1c4.479-27.363-22.313-31.528-48-32   c-4.788-0.233,0.768-3.546,0-6c-22.784-0.775-48.438-3.12-64-12c-10.822-6.175-22.699-21.242-9-35c3.398-3.413,16.051-9.357,23-13   c22.625-11.86,57.286-20.123,91-20c3.068-0.599,4.907-2.426,5-6c20.636,3.534,49.544-1.714,58-17c80.688,0,168.662,0,252,0   c28.288,0,56.748-2.883,83,0c1.825,0.2,0.131-1.92,2-1c4.444,2.188,8.067,7.084,13,12C765.768,65.942,784.249,73.692,799,68z";
//   var GRECIAN_DECK_PATH = "M1155,143c0,2,0,4,0,6c-12.843,32.491-54.976,35.691-99,37   c-4.84,2.176,9.213,7.196,6,11c-28.334,0.343-63.633,2.903-67,27c-1.967,14.078,8.176,24.344,13,33   c-277.762-0.093-555.413-0.083-831,2c29.916-40.303-17.464-65.767-64-61c-2.545-2.079,11.153-9.658,4-10   c-22.662-1.138-44.771-2.914-65-9c-17.271-5.196-38.911-14.652-40-34c-1.008-17.92,18.755-35.827,33-45   c48.932-31.51,119.011-45.39,189-48c10.446-8.304,30.076-5.082,47-8c10.403-1.793,22.303-4.788,32-9   c8.341-3.623,13.385-11.432,21-13c16.326-3.363,39.231,0,60,0c120.736,0,240.084-1,360-1c20.438,0,45.245-3.667,61,0   c6.553,1.525,14.569,9.515,23,13c9.816,4.057,20.743,6.944,32,9c12.861,2.349,26.439,0.358,39,3c4.487,0.944,8.149,4.133,12,5   c10.682,2.406,22.264,1.042,33,2c32.576,2.905,60.53,9.15,88,17C1088.422,83.267,1138.081,101.318,1155,143z M753,63   c-4.933-4.916-8.556-9.812-13-12c-1.869-0.92-0.175,1.2-2,1c-26.252-2.883-54.712,0-83,0c-83.338,0-171.313,0-252,0   c-8.456,15.286-37.364,20.534-58,17c-0.093,3.574-1.932,5.401-5,6c-33.714-0.123-68.375,8.14-91,20   c-6.949,3.643-19.602,9.587-23,13c-13.699,13.758-1.822,28.825,9,35c15.562,8.88,41.216,11.225,64,12c0.768,2.454-4.788,5.767,0,6   c25.687,0.472,52.479,4.637,48,32c156.018,0.677,315.029-0.957,467-1c-7.451-22.495,19.072-33.277,45-32c3.918-1.77-4.918-4.23-1-6   c26.882-0.946,73.909-4.145,74-30c0.052-14.779-25.652-34.751-42-33c-23.885-11.115-54.021-15.979-88-17   c-2.427-0.573,0.469-6.469-3-6C784.249,73.692,765.768,65.942,753,63z";

//   var LSHAPE_INNER_PATH = "M895,52c23.889,27.445,51.339,56.66,72,84c-162.332,0-324.669,0-487,0    c-4.469,37.393-5.101,74.786-8,115c-94.395-0.71-194.341,1.645-292,1c33.963-66.704,69.629-131.703,104-198    c207.368,2.939,421.116-0.533,609,0C894.086,53.753,893.678,52.012,895,52z";
//   var LSHAPE_DECK_PATH = "M155,326c-21.935,0-50.849,0-77,0c-26.024,0-53.895,3.278-76,0   c-1.611-0.239-1.956-0.315-2-2c65.027-86.15,127.198-175.672,193-266c6.616-9.083,21.323-33.673,29-36c9.434-2.86,29.032,0,46,0   c213.889,0,419.933-1,634-1c15.768,0,33.966-2.676,45,0c7.201,1.747,16.883,14.24,23,20c50.599,47.643,99.872,90.654,149,139   c0.304,0.299,4.542,2.401,2,4c-177.939-0.272-353.568,1.764-532,1c5.156,46.516,13.364,95.296,17,140   C455.999,325.667,303.333,323.667,155,326z M893,54c-187.884-0.533-401.632,2.939-609,0c-34.371,66.297-70.037,131.296-104,198   c97.659,0.645,197.605-1.71,292-1c2.899-40.214,3.531-77.607,8-115c162.331,0,324.668,0,487,0c-20.661-27.34-48.111-56.555-72-84   C893.678,52.012,894.086,53.753,893,54z";

//   var OVAL_INNER_PATH = "M688.557,32.918c74.334-2.314,166.644,6.52,237.394,18.009c16.117,2.617,35.377,8.795,50.753,13.916   c5.472,1.822,11.031,2.135,15.553,4.093c13.216,5.722,33.238,20.381,32.744,38.474c-0.689,25.283-39.184,33.762-63.851,39.293   c-29.543,6.624-59.16,12.318-86.772,16.372c-128.189,18.818-252.837,17.645-373.282,1.637c-28.269-3.757-58.179-9.54-86.772-16.372   c-25.341-6.054-64.75-13.09-67.125-36.018c-1.601-15.454,9.846-24.333,21.284-30.288c12.534-6.526,22.285-12.445,35.2-17.191   c31.532-11.586,56.843-15.055,86.772-18.828C557.785,37.527,616.357,35.166,688.557,32.918z";
//   var OVAL_DECK_PATH = "M690.016,0c20.723,0,41.446,0,62.169,0c40.172,1.309,81.42,3.473,120.302,7.267c37.243,3.634,75.001,6.256,112.228,13.726   c30.264,6.072,65.011,17.957,93.658,32.296c26.067,13.047,72.313,43.399,57.325,81.547c-9.38,23.871-43.865,38.725-74.28,47.636   c-32.996,9.668-66.603,16.908-99.309,22.607c-70.552,12.294-141.723,21.8-222.033,21.8c-123.642,0-232.998-6.834-333.454-30.681   c-32.827-7.792-68.776-15.329-92.85-29.066c-12.14-6.927-25.883-18.74-29.066-33.103c-8.608-38.84,40.398-66.965,62.977-78.317   C438.262,10.17,564.064,6.883,690.016,0z M519.656,39.562c-29.519,3.721-54.484,7.142-85.584,18.57   c-12.738,4.68-22.356,10.519-34.718,16.955c-11.281,5.874-22.572,14.632-20.992,29.874c2.343,22.614,41.213,29.554,66.206,35.525   c28.201,6.739,57.702,12.442,85.584,16.148c118.796,15.789,241.738,16.946,368.172-1.615c27.233-3.998,56.445-9.614,85.584-16.148   c24.329-5.456,62.297-13.818,62.977-38.755c0.487-17.846-19.26-32.304-32.296-37.947c-4.461-1.931-9.943-2.24-15.341-4.037   c-15.166-5.051-34.162-11.144-50.058-13.726c-69.781-11.332-160.828-20.045-234.144-17.763   C643.834,28.861,586.063,31.19,519.656,39.562z";

//   var KIDNEY_POOL_SHADOW = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-kidney.png";
//   var RECTANGLE_POOL_SHADOW = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-rectangle.png";
//   var FREEFORM_POOL_SHADOW = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-freeform.png";
//   var GRECIAN_POOL_SHADOW = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-grecian.png";
//   var LSHAPE_POOL_SHADOW = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-l-shape.png";
//   var OVAL_POOL_SHADOW = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-oval.png";

//   // pool shape controller
//   var shape =  $("#poolShape").find(":selected").val();
//   var innerSVG;
//   var deckSVG;
//   switch (shape) {
//     case "kidney":
//       innerSVG = KIDNEY_INNER_PATH;
//       deckSVG = KIDNEY_DECK_PATH;
//       poolShadow = KIDNEY_POOL_SHADOW;
//       break;
//     case "rectangle":
//       innerSVG = RECTANGLE_INNER_PATH;
//       deckSVG = RECTANGLE_DECK_PATH;
//       poolShadow = RECTANGLE_POOL_SHADOW;
//       break;
//     case "freeform":
//       innerSVG = FREEFORM_INNER_PATH;
//       deckSVG = FREEFORM_DECK_PATH;
//       poolShadow = FREEFORM_POOL_SHADOW;
//       break;
//     case "grecian":
//       innerSVG = GRECIAN_INNER_PATH;
//       deckSVG = GRECIAN_DECK_PATH;
//       poolShadow = GRECIAN_POOL_SHADOW;
//       break;
//     case "l-shape":
//       innerSVG = LSHAPE_INNER_PATH;
//       deckSVG = LSHAPE_DECK_PATH;
//       poolShadow = LSHAPE_POOL_SHADOW;
//       break;
//     case "oval":
//       innerSVG = OVAL_INNER_PATH;
//       deckSVG = OVAL_DECK_PATH;
//       poolShadow = OVAL_POOL_SHADOW;
//       break;
//   }
//   $(".deck-path").attr('d',deckSVG);
//   $(".shape-path").attr('d',innerSVG);
//   $('#pool img').attr('src', poolShadow);
//   $('#pool, #pool-water, #deck').removeClass().addClass(shape);


//   // decking controller
//   var decking = $("#poolCoping").find(":selected").val();
//   var deckprefix = "/wp-content/themes/pebbletec/assets/poolpicker/PS-Tiles/";
//   var deckImg = deckprefix+decking+".png";
//   $('#deck image').attr('xlink:href', deckImg);

//   // Shimmer
//   var isChecked = $("#poolShimmering")[0].checked;
//   if(isChecked) {
//     $("#pool-water image").attr("height",'600');
//     $("#pool-water image").attr("xlink:href",'/wp-content/themes/pebbletec/assets/poolpicker/watrzshimmerie.gif');

//   } else {
//     $("#pool-water image").attr("height",'1200');
//     $("#pool-water image").attr("xlink:href",'/wp-content/themes/pebbletec/assets/poolpicker/watrz.gif');

//   }
// //  if(isChecked) {
// //    $("#pool-water image").attr("xlink:href", "/wp-content/themes/pebbletec/assets/poolpicker/watrzshimmer.gif");
// //  } else {
// //    $("#pool-water image").attr("xlink:href", "/wp-content/themes/pebbletec/assets/poolpicker/watrz.gif");
// //  }

//   // set curret blend
//   selectedBlend = $("#poolLuminious").find(":selected").val();
// }

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
