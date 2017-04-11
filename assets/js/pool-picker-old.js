/* Old code
// Pool picker page
  water_color_picker: {
    init: function() {
      // JavaScript to be fired on the pool picker

      // initialize finish and color variables
      var finish, color, depth;
      depth = 5;

      // initialize depth slider on side of pool visualizer
      var depthSlider = $('#depthSlider').slider({ 
        orientation: 'vertical'
      });
      // bind slide event from slider
      $(document).on('change', '#depthSlider', function(slideEvt) {
        // insert code to change pool depth visualization
        // depth will be from 1-10 (int)
        if(slideEvt.value.newValue != slideEvt.value.oldValue) {
          updateDepth(slideEvt.value.newValue, selectedBlend);
        }
        else {
          console.log("Depth didn't change, not doing a damn thing.");
        }

      });

      // triggered when user clicks on a finish choice. gets colors that are 
      // related to that finish and moves to the next panel
      $(document).on('click', '.finish-choice', function (e) {
        e.preventDefault();
        // get selected finish
        finish = $(this).data('pool-finish');

        // ajax request. /lib/extras.php line 136
        $.ajax({
          type: "get",
          dataType: "html",
          url: '/wp-admin/admin-ajax.php',
          data: { action : 'get_pool_colors', finish : finish },
          success: function(response) {
            // display returned choices and move to next slide
            $('#colorHolder').html(response);
            $('#colorPicker').carousel('next');
          }
        });
        
        // preload texture images
        preLoadPoolTextures();
      
      });

      // triggered when user clicks on a color choice. gets associated products 
      // related to their two choices and returns the pool visualizer 
      $(document).on('click', '.color-choice', function (e) {
        e.preventDefault();
        // get user choices
        $(this).addClass('selected-color');
        color = $(this).data('water-color');

        // ajax request. /lib/extras.php line 173
        $.ajax({
          type: "get",
          dataType: "json",
          url: '/wp-admin/admin-ajax.php',
          data: { action : 'get_pool_finishes', color : color, finish : finish },
          success: function(response) {
            // set pool finish dropdown options
            $('#poolFinishes').html(response.finishes);
            // set luminious dropdown options
            $('#poolLuminious').html(response.luminious);
            // set finishing touches html
            $('#finishingTouches').html(response.finishing_touches);
            // set initial finish option to the first returned option
            $('#poolFinish option:first-child').attr('selected', 'selected');
            // initial call to set pool
            updatePool( color );
            // set initial color for depth slider
            initialColor = $("#shadowImg").css("background-color");
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
        updateDepth( $('#depthSlider').val(), selectedBlend );
      });

      // when user changes pool finish option, display correct luminious options
      $(document).on('change', '#poolFinishes', function (e) {
        e.preventDefault();
        // get selected finish
        var finish = $('#poolFinishes').find(":selected").val();
        // hide all luminious options, show only related options
        $('#poolLuminious .finish-option').hide();
        $('#poolLuminious .' + finish + '-option').show();
        $('#poolLuminious').val('');
      });
      // commented out feature/plant in html
      
      //$("#plant").click(function(){
      //  changeFeature();
      //});
    }
  }


// Global variables and constants for pool function
var selectedBlend;
var initialColor;
var EMERALD_BLEND = "emerald-blend";
var JADE_BLEND = "jade-blend";
var BLUE_BLEND = "blue-blend";

// update pool finish function.
// 2 params - color and finish 
function updatePoolFinish( color, finish ) {
  // hide all finish options
  $('.finish-option').hide();
  // show related options
  $('.' + finish + '-option').show();
  // update current finish text
  $('#currentFinish').removeClass().addClass(color).html(finish.replace('-', ' ').replace('-', ' '));
}

// update pool color function
// 1 param - color
function updatePool( color ) {
  // get selected finish and update pool finish
  var finish = $('#poolFinishes').find(":selected").val();
  updatePoolFinish( color, finish);

  // water color 
  $("#shadowImg").removeClass().addClass(color);
  
  // terrain controller
  var terrain = $("#poolEnvironment").find(":selected").val();
  $('#terrain').removeClass().addClass(terrain);

  // pool shape controller
  var shape =  $("#poolShape").find(":selected").val();
  $('#deck, #pool, #pool-water').removeClass().addClass(shape);
  var shapeprefix = "/wp-content/themes/pebbletec/assets/poolpicker/shadow-pool-"
  var svgurl = shapeprefix+shape+".png"
  $('#shadowImg').attr('src', svgurl);

  // decking controller
  var decking = $("#poolCoping").find(":selected").val();
  var deckprefix = "/wp-content/themes/pebbletec/assets/poolpicker/PS-Tiles/";
  var deckImg = deckprefix+decking+".png";
  $('#deckImg').attr('src', deckImg);

  // Shimmer
  var isChecked = $("#poolShimmering")[0].checked;
  if(isChecked) {
    $("#shimmer").show();
  } else {
    $("#shimmer").hide();
  }

  // set curret blend
  selectedBlend = $("#poolLuminious").find(":selected").val();
}

*/