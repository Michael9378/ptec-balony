<?php

use Abraham\TwitterOAuth\TwitterOAuth;

/**
 * Clean up the_excerpt()
 */
function roots_excerpt_more() {
  return ' &hellip; <a href="' . get_permalink() . '">' . __('Continued', 'roots') . '</a>';
}
add_filter('excerpt_more', 'roots_excerpt_more');


// return carousel of latest tweets
function get_latest_tweets() {
	define(CONSUMER_KEY, 'NaYWLEgmGCVeF0ghWlVQqazVe');
	define(CONSUMER_SECRET, 'Ewo8PeK0DJpIvxDplycg0hiifGxNXelKPJFL3eJBn3E8zPFhp3');

	$access_token = '1655743602-Nn2UpkUGd8bK3sau4vSxdsyuFNyRimBn9H16HJp';
	$access_token_secret = 'vfUOfvdPoFFaOI7QtS5E4tyJllrtvwvx2fRaPWh8kWpHo';

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);
	$tweets = $connection->get("statuses/user_timeline", array("screen_name" => 'Pebble_Tec', 'exclude_replies' => 'true', 'include_rts' => 'false', 'count' => '4'));

	$returnTweets = '';

	if(!empty($tweets)) {
	    foreach($tweets as $tweet) {

	        # Access as an object
	        $tweetText = $tweet->text;

	        # linkify
	        $tweetText = linkify_twitter_status($tweetText);

	        # Output
	        $returnTweets .= '<div class="tweet-element"><p>' . $tweetText . '</p></div>';

	    }
	}

	return $returnTweets;
}


// linkify twitter status
function linkify_twitter_status($status_text)
{
  // linkify URLs
  $status_text = preg_replace(
    '/(https?:\/\/\S+)/',
    '<a href="\1">\1</a>',
    $status_text
  );

  // linkify twitter users
  $status_text = preg_replace(
    '/(^|\s)@(\w+)/',
    '\1<a href="http://twitter.com/\2">@\2</a>',
    $status_text
  );

  // linkify tags
  $status_text = preg_replace(
    '/(^|\s)#(\w+)/',
    '\1<a href="http://search.twitter.com/search?q=%23\2">#\2</a>',
    $status_text
  );

  return $status_text;
}

// breadcrumbs
function the_breadcrumbs() {
 
  global $post;

  if (!is_page_template('home.php')) {

      echo "<a href='";
      echo get_option('home');
      echo "'>";
      echo "Home";
      echo "</a>";

      if (is_category() || is_single()) {

          echo " > ";
          $cats = get_the_category( $post->ID );

          foreach ( $cats as $cat ){
              echo $cat->cat_name;
              echo " > ";
          }
          if (is_single()) {
              the_title();
          }
      } elseif (is_page()) {

          if($post->post_parent){
              $anc = get_post_ancestors( $post->ID );
              $anc_link = get_page_link( $post->post_parent );

              foreach ( $anc as $ancestor ) {
                  $output = " > <a href=".$anc_link.">".get_the_title($ancestor)."</a> > ";
              }

              echo $output . '<span class="breadcrumb-title">';
              the_title();
              echo '</span>';

          } else {
              echo ' > <strong>' . the_title() . '</strong>';
          }
      } elseif (is_home()) {

        echo "  > <a href='/connect-with-us/'>Connect With Us</a> > <strong>News</strong>";
      }
  }
  elseif (is_tag()) {single_tag_title();}
  elseif (is_day()) {echo"Archive: "; the_time('F jS, Y'); echo'</li>';}
  elseif (is_month()) {echo"Archive: "; the_time('F, Y'); echo'</li>';}
  elseif (is_year()) {echo"Archive: "; the_time('Y'); echo'</li>';}
  elseif (is_author()) {echo"Author's archive: "; echo'</li>';}
  elseif (isset($_GET['paged']) && !empty($_GET['paged'])) {echo "Blogarchive: "; echo'';}
  elseif (is_search()) {echo"Search results: "; }
}

// allow html in descriptions for custom post type categories
remove_filter( 'pre_term_description', 'wp_filter_kses' );

// pool picker functionality
add_action( 'wp_ajax_get_pool_textures', 'get_pool_textures' );
add_action( 'wp_ajax_nopriv_get_pool_textures', 'get_pool_textures' );

// return pool colors
function get_pool_textures() {
  $color = $_GET['color'];

  $args = array(
    'fields'    => 'ids',
    'post_type' => 'product',
    'tax_query' => array(
      array(
          'taxonomy'  => 'water_color',
          'field'   => 'slug',
          'terms'   => $color
      ),
    ),  
  );

  $products = new WP_Query($args);

  $textures = wp_get_object_terms( $products->posts, 'pool_finishes' );
  $textures = array_reverse ( $textures );

  $return_html = '';
  $i = 0;
  foreach ($textures as $texture) {
    // 5 finishes, row of 3 on top, 2 on bottom with offset
    if($i == 3) { $return_html .= '<div class="clearfix"></div><div class="col-md-2"></div>'; }
    $return_html .= '<a href="#" data-pool-finish="' . $texture->slug . '" class="finish-choice">';
    $return_html .= '<div class="col-md-4 ' . $texture->slug . '">';
    $return_html .= '<div class="finish-holder cursor">';
    $return_html .= '<img src="' . get_template_directory_uri() . '/assets/img/finish-textures/' . $texture->slug . '.png" class="finish-image">';
    $return_html .= '<h3>' . $texture->name . '</h3>';
    $return_html .= '<div class="finish-description">' . $texture->description . '</div>';
    $return_html .= '</div>';
    $return_html .= '</div>';
    $return_html .= '</a>';
    $i++;
  }
  echo $return_html;
  wp_die();
}

add_action( 'wp_ajax_get_pool_finishes', 'get_pool_finishes' );
add_action( 'wp_ajax_nopriv_get_pool_finishes', 'get_pool_finishes' );

function get_pool_finishes() {
  $finish = $_GET['finish'];
  $color = $_GET['color'];

  $args = array(
    'post_type' => 'product',
    'tax_query' => array(
      'relation' => 'AND',
      array(
          'taxonomy'  => 'pool_finishes',
          'field'   => 'slug',
          'terms'   => $finish
      ),
      array(
          'taxonomy'  => 'water_color',
          'field'   => 'slug',
          'terms'   => $color
      ),
    ),  
  );

  $products = new WP_Query($args);

  $posts = $products->posts;

  $finish_html = '';
  $finishing_touches_html = '';
  $finishing_touches_array = array();
  $luminous_html = '';
  $lum_array = array();
  $descriptions = array();

  foreach ( $posts as $post ) {
    $finish_html .= '<option value="' . $post->post_name . '" id="' . $post->slug .'">' . $post->post_title . '</option>';

    $finishing_touches = wp_get_post_terms( $post->ID, 'finishing_touches' );
    $finishing_touches_html = '';
    foreach ( $finishing_touches as $touch ) {
      $finishing_touches_html .= '<li class="media '. $post->post_name . '-option finish-option">';
      $finishing_touches_html .= '<div class="media-left">';
      $finishing_touches_html .= '<img class="media-object" src="' . get_template_directory_uri() . '/assets/img/finishing-touches/' . $touch->slug . '.png" alt="">';
      $finishing_touches_html .= '</div>';
      $finishing_touches_html .= '<div class="media-body">';
      $finishing_touches_html .= '<h4 class="media-heading"><strong>' . $touch->name . '</strong></h4>';
      $finishing_touches_html .= '<p>'.$touch->description.'</p>';
      $finishing_touches_html .= '</div>';
      $finishing_touches_html .= '</li>';
    }
    $finishing_touches_array[$post->post_name] = $finishing_touches_html;

    $luminious = wp_get_object_terms( $post->ID, 'luminious' );
    $luminious_html = '';
    $luminious_html .= '<option value="" class="' . $post->post_name .'-option finish-option">---</option>';
    foreach( $luminious as $lum ) {
        $luminious_html .= '<option value="' . $lum->slug . '" class="' . $post->post_name .'-option finish-option">' . $lum->name . '</option>';
    }
    $lum_array[$post->post_name] =  $luminious_html;

    $description = get_post_meta ( $post->ID, '_cmb_product_description', true);
    $descriptions[$post->post_name] =  $description;

  }

  $return_array = array( 'finishes' => $finish_html, 'finishing_touches' => $finishing_touches_array, 'luminious' => $lum_array, 'descriptions' => $descriptions );
  echo json_encode( $return_array );

  wp_die();
}

function ga_tag() {
  echo "<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-39343011-1', 'auto');
    ga('send', 'pageview');
  </script>";
}
// echos google analytics tag if we are on the live site
if($_SERVER['HTTP_HOST'] == "www.pebbletec.com") {
  add_action( 'wp_head', 'ga_tag' );  
}

function allow_CORS() {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: *");
}
add_action('init', 'allow_CORS');

// add ajax url
add_action('wp_head', 'myplugin_ajaxurl');

function myplugin_ajaxurl() {
 echo '<script type="text/javascript">
         var ajaxurl = "' . admin_url('admin-ajax.php') . '";
       </script>';
}

// add_action( 'wp_ajax_get_states', 'get_states' );
// add_action( 'wp_ajax_nopriv_get_states', 'get_states' );

// function get_states() {
//   $curl = curl_init();

//   curl_setopt_array($curl, array(
//     CURLOPT_URL => "https://pebbletec.quickbase.com/db/bkj7phuri?a=API_DoQuery&apptoken=cxdg5psdqnwkygdp6zwgccy6tjr3&fmt=structured&query=%7B9.GT.0%7D",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_ENCODING => "",
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 30,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_VERBOSE => TRUE,
//     CURLOPT_HTTPHEADER => array(
//       "cache-control: no-cache",
//       "content-type: application/xml",
//       "content-length: "
//     ),
//   ));

//   $response = curl_exec($curl);
//   $err = curl_error($curl);

//   curl_close($curl);

//   if ($err) {
//     echo "cURL Error #:" . $err;
//   } else {
//     $xml = simplexml_load_string($response);
//     $json = json_encode($xml);
//     wp_die( $json );
//   }
// }

add_action( 'wp_ajax_get_county', 'get_county' );
add_action( 'wp_ajax_nopriv_get_county', 'get_county' );

function get_county() {
  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://pebbletec.quickbase.com/db/bk4rfue5b?a=API_DoQuery&apptoken=cxdg5psdqnwkygdp6zwgccy6tjr3&query={6.CT.". $_POST['zip'] ."}&slist=6&clist=a&fmt=structured",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_VERBOSE => TRUE,
    CURLOPT_HTTPHEADER => array(
      "cache-control: no-cache",
      "content-type: application/xml",
      "content-length: "
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {
    $xml = simplexml_load_string($response);
    $json = json_encode($xml);
    wp_die( $json );
  }
}

// add_action( 'wp_ajax_get_counties', 'get_counties' );
// add_action( 'wp_ajax_nopriv_get_counties', 'get_counties' );

// function get_counties() {
//   $curl = curl_init();

//   curl_setopt_array($curl, array(
//     CURLOPT_URL => "https://pebbletec.quickbase.com/db/bkgwpeju3?a=API_DoQuery&apptoken=cxdg5psdqnwkygdp6zwgccy6tjr3&query=%7B17.EX.". $_POST['state'] ."%7D&slist=6&clist=a&fmt=structured",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_ENCODING => "",
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 30,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_VERBOSE => TRUE,
//     CURLOPT_HTTPHEADER => array(
//       "cache-control: no-cache",
//       "content-type: application/xml",
//       "content-length: "
//     ),
//   ));

//   $response = curl_exec($curl);
//   $err = curl_error($curl);

//   curl_close($curl);

//   if ($err) {
//     echo "cURL Error #:" . $err;
//   } else {
//     $xml = simplexml_load_string($response);
//     $json = json_encode($xml);
//     wp_die( $json );
//   }
// }

add_action( 'wp_ajax_get_builders', 'get_builders' );
add_action( 'wp_ajax_nopriv_get_builders', 'get_builders' );

function get_builders() {

  $url = '';
  $services = '';
  $types = '';
  $query = '{34.EX.1}'; // make sure returned builders are admin approved

  $data = array();
  parse_str( $_POST['form_data'], $data ) ;

  // if services are selected, we will need to filter by these services
  if( is_array( $data['Services'] ) ){
    foreach ($data['Services'] as $service):
      switch ($service) {
        case 'Residential Pools':
          $services .= '{32.EX.\'true\'}AND';
          break;
        case 'Backend Design Services':
          $services .= '{28.EX.\'true\'}AND';
          break;
        case 'Commercial Pools':
          $services .= '{29.EX.\'true\'}AND';
          break;
      }
    endforeach;
    // check for type to add service for remodel or new construction
    if( $data['Type'] == 'Applicator' ){
      // selected services are services from above.
      // do not specify whether they should have remodels or not, only pull on selected services from above
    }
    elseif( $data['Type'] == 'Remodel' ){
      // if we are Remodel, return Remodel
      $services .= '{31.EX.\'true\'}'; // Remodel
    }
    else {
      // we are new construction.
      $services .= '{30.EX.\'true\'}'; // new construction
    }
  }
  else{
    // no services were selected.
    if( $data['Type'] == 'Applicator' ){
      // if we are applicator, return any applicator with any service
      $services = '{28.EX.\'true\'}OR{29.EX.\'true\'}OR{30.EX.\'true\'}OR{31.EX.\'true\'}OR{32.EX.\'true\'}';
    }
    elseif( $data['Type'] == 'Remodel' ){
      // if we are Remodel, return all rows with 'Remodel' as true
      $services .= '{31.EX.\'true\'}'; // Remodel
    }
    else {
      // if we are Construction, return all rows with 'Construction' as true
      $services .= '{30.EX.\'true\'}'; // new construction
    }
  }
  // wrap in ( )
  $query .= "AND(" . $services . ")";
  // services are all captured.
  // query is admin_approved and services

  // if type is applicator, filter out anyone that isnt applicator, applicator/builder, and certified repair
  if( $data['Type'] == 'Applicator' ){
    // 21.EX.TYPE_OF_BUILDER_LITERAL
    /* 
    Builder Types
      Applicator
      Builder/Applicator
      Builder
      Certified Repair Agent
    */
    $query .= 'AND({21.EX.Applicator}OR{21.EX.Builder/Applicator}OR{21.EX.Certified Repair Agent})';
  }

  // if country is not USA, get rid of all previous filters and just get all builders in country
  if( $data['Country'] !== 'USA' ) {
    // if country is not USA, query for country ( {36.EX.LITERAL_COUNTRY} ) and admin approved ( {34.EX.1} )
    // ignore previously built query
    $query = '{34.EX.1}AND{36.EX.'. $data["Country"] .'}';
  }
  else {
    // add passed county to query
    $query .= 'AND{19.EX.' . $data["State"] . '}';
  }

  $query = urlencode($query);

  $url = 'https://pebbletec.quickbase.com/db/bkgwpj2wi?a=API_DoQuery&apptoken=cxdg5psdqnwkygdp6zwgccy6tjr3&query=' . $query . '&clist=a&slist=13&fmt=structured';

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_VERBOSE => TRUE,
    CURLOPT_HTTPHEADER => array(
      "cache-control: no-cache",
      "content-type: application/xml",
      "content-length: "
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {
    $xml = simplexml_load_string($response);
    $json = json_encode($xml);
    wp_die( $json );
  }
  
}

add_action( 'wp_ajax_get_ticket', 'get_ticket' );
add_action( 'wp_ajax_nopriv_get_ticket', 'get_ticket' );

function get_ticket() {
  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => "https://pebbletec.quickbase.com/db/main?a=API_Authenticate&username=billy@lucidagency.com&password=W0HpR!8F7eeX",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_VERBOSE => TRUE,
    CURLOPT_HTTPHEADER => array(
      "cache-control: no-cache",
      "content-type: application/xml",
      "content-length: "
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {
    $xml = simplexml_load_string($response);
    $json = json_encode($xml);
    wp_die( $json );
  }
}

add_action( 'wp_ajax_submit_lead', 'submit_lead' );
add_action( 'wp_ajax_nopriv_submit_lead', 'submit_lead' );

function submit_lead() {
  $data = array();
  parse_str( $_POST['form_data'], $data ) ;
  $ticket = $_POST['ticket'];
  $url = "https://pebbletec.quickbase.com/db/bknmk8vj2?a=API_AddRecord&apptoken=cxdg5psdqnwkygdp6zwgccy6tjr3psdqnwkygdp6zwgccy&ticket=".$ticket."&_fid_6=".urlencode($data['First_Name'])."&_fid_7=".urlencode($data['Last_Name'])."&_fid_8=".urlencode($data['Daytime_Phone'])."&_fid_9=".urlencode($data['Email_Address'])."&_fid_11=".urlencode($data['Street_Address'])."&_fid_13=".urlencode($data['City'])."&_fid_14=".urlencode($data['State'])."&_fid_15=".urlencode($data['Zip_Code'])."&_fid_17=".urlencode($data['Preferred_Contact_Method'])."&_fid_18=".urlencode($data['Reason_for_Inquiry'])."&_fid_19=".urlencode($data['Project_Description'])."&_fid_36=".urlencode($data['Corrected_Interested_Products']);

  if( isset($data['Fire_And_Water']) && $data['Fire_And_Water'] == 'interested'):
    $url .= "&_fid_20=1";
  endif;

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_VERBOSE => TRUE,
    CURLOPT_HTTPHEADER => array(
      "cache-control: no-cache",
      "content-type: application/xml",
      "content-length: "
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {
    $xml = simplexml_load_string($response);
    $json = json_encode($xml);
    wp_die( $json );
  }
}

add_action( 'wp_ajax_submit_builder_lead', 'submit_builder_lead' );
add_action( 'wp_ajax_nopriv_submit_builder_lead', 'submit_builder_lead' );

function submit_builder_lead() {
  $ticket = $_POST['ticket'];
  $rid = $_POST['rid'];
  $builderID = $_POST['builderID'];
  $url = "https://pebbletec.quickbase.com/db/bkxpc2g2b?a=API_AddRecord&apptoken=cxdg5psdqnwkygdp6zwgccy6tjr3psdqnwkygdp6zwgccy&ticket=".$ticket."&_fid_6=".$builderID."&_fid_8=".$rid;

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_VERBOSE => TRUE,
    CURLOPT_HTTPHEADER => array(
      "cache-control: no-cache",
      "content-type: application/xml",
      "content-length: "
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {
    $xml = simplexml_load_string($response);
    $json = json_encode($xml);
    wp_die( $json );
  }
}

add_action( 'wp_ajax_track_click', 'track_click' );
add_action( 'wp_ajax_nopriv_track_click', 'track_click' );

function track_click() {
  $ticket = $_POST['ticket'];
  $locationID = $_POST['locationID'];
  $type = urlencode($_POST['type']);
  $time = $_POST['time'];
  $url = "https://pebbletec.quickbase.com/db/bk32c68t9?a=API_AddRecord&apptoken=cxdg5psdqnwkygdp6zwgccy6tjr3psdqnwkygdp6zwgccy&ticket=".$ticket."&_fid_6=".$type."&_fid_7=".$time.'&_fid_9='.$locationID;

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_VERBOSE => TRUE,
    CURLOPT_HTTPHEADER => array(
      "cache-control: no-cache",
      "content-type: application/xml",
      "content-length: "
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);

  curl_close($curl);

  if ($err) {
    echo "cURL Error #:" . $err;
  } else {
    $xml = simplexml_load_string($response);
    $json = json_encode($xml);
    wp_die( $json );
  }
}