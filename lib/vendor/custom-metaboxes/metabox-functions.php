<?php
/**
 * Include and setup custom metaboxes and fields.
 *
 * @category Pebbletec
 * @package  Metaboxes
 * @license  http://www.opensource.org/licenses/gpl-license.php GPL v2.0 (or later)
 * @link     https://github.com/webdevstudios/Custom-Metaboxes-and-Fields-for-WordPress
 */

add_filter( 'cmb_meta_boxes', 'cmb_product_metaboxes' );
/**
 * Define the metabox and field configurations.
 *
 * @param  array $meta_boxes
 * @return array
 */
function cmb_product_metaboxes( array $meta_boxes ) {

	// Start with an underscore to hide fields from custom fields list
	$prefix = '_cmb_';

	/**
	 * Sample metabox to demonstrate each field type included
	 */
	$meta_boxes['product_info_metabox'] = array(
		'id'         => 'product_info_metabox',
		'title'      => __( 'Product Info', 'cmb' ),
		'pages'      => array( 'product', ), // Post type
		'context'    => 'normal',
		'priority'   => 'high',
		'show_names' => true, // Show field names on the left
		// 'cmb_styles' => true, // Enqueue the CMB stylesheet on the frontend
		'fields'     => array(
			array(
				'name'    => __( 'Product description', 'cmb' ),
				'desc'    => __( 'description text for given product', 'cmb' ),
				'id'      => $prefix . 'product_description',
				'type'    => 'wysiwyg',
				'options' => array( 'textarea_rows' => 5, ),
			),
			array(
				'name' => __( 'Color family image', 'cmb' ),
				'desc' => __( 'Upload an image or enter a URL for the color family.', 'cmb' ),
				'id'   => $prefix . 'color_family_image',
				'type' => 'file',
			),
			array(
				'name' => __( 'Brochure URL', 'cmb' ),
				'desc' => __( 'link to download brochure', 'cmb' ),
				'id'   => $prefix . 'brochure_url',
				'type' => 'text_url',
				// 'protocols' => array('http', 'https', 'ftp', 'ftps', 'mailto', 'news', 'irc', 'gopher', 'nntp', 'feed', 'telnet'), // Array of allowed protocols
				// 'repeatable' => true,
			),
			array(
				'name' => __( 'Depth image', 'cmb' ),
				'desc' => __( 'Upload an image or enter a URL for the depth color.', 'cmb' ),
				'id'   => $prefix . 'depth_image',
				'type' => 'file',
			),
		),
	);

	/**
	 * Repeatable Field Groups
	 */
	$meta_boxes['gallery_images'] = array(
		'id'         => 'gallery_images',
		'title'      => __( 'Gallery Images', 'cmb' ),
		'pages'      => array( 'product', ),
		'fields'     => array(
			array(
				'id'          => $prefix . 'gallery_images',
				'type'        => 'group',
				'description' => __( 'Images for product gallery', 'cmb' ),
				'options'     => array(
					'group_title'   => __( 'Image {#}', 'cmb' ), // {#} gets replaced by row number
					'add_button'    => __( 'Add Another Image', 'cmb' ),
					'remove_button' => __( 'Remove Image', 'cmb' ),
					'sortable'      => true, // beta
				),
				// Fields array works the same, except id's only need to be unique for this group. Prefix is not needed.
				'fields'      => array(
					array(
						'name' => 'Image Title',
						'id'   => 'title',
						'type' => 'text',
						// 'repeatable' => true, // Repeatable fields are supported w/in repeatable groups (for most types)
					),
					array(
						'name' => 'Product Image',
						'id'   => 'image',
						'type' => 'file',
					),
				),
			),
		),
	);




	return $meta_boxes;
}

add_action( 'init', 'cmb_initialize_cmb_meta_boxes', 9999 );
/**
 * Initialize the metabox class.
 */
function cmb_initialize_cmb_meta_boxes() {

	if ( ! class_exists( 'cmb_Meta_Box' ) )
		require_once 'init.php';

}
