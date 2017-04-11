<?php

function pebbletec_product() {
	register_post_type( 'product',
		array( 'labels' => array(
			'name' => __( 'Products'),
			'singular_name' => __( 'Product'),
			'all_items' => __( 'All Products'),
			'add_new' => __( 'Add New'),
			'add_new_item' => __( 'Add New Product'),
			'edit' => __( 'Edit'),
			'edit_item' => __( 'Edit Products'),
			'new_item' => __( 'New Product'),
			'view_item' => __( 'View Product'),
			'search_items' => __( 'Search Product'),
			'not_found' =>  __( 'Nothing found in the Database.'),
			'not_found_in_trash' => __( 'Nothing found in Trash'),
			'parent_item_colon' => ''
			),
			'description' => __( 'This is a product'),
			'public' => true,
			'publicly_queryable' => true,
			'exclude_from_search' => true,
			'show_ui' => true,
			'query_var' => true,
			'menu_position' => 8,
			'menu_icon' => get_stylesheet_directory_uri() . '/library/images/custom-post-icon.png',
			'rewrite'	=> array( 'slug' => 'product', 'with_front' => false ),
			'has_archive' => 'product',
			'capability_type' => 'post',
			'hierarchical' => false,
			'supports' => array( 'title', 'thumbnail')
		)
	);

	// flush_rewrite_rules( false );
}

add_action( 'init', 'pebbletec_product');

register_taxonomy( 'product_cat',
	array('product'),
	array('hierarchical' => true,
		'labels' => array(
			'name' => __( 'Product Categories'),
			'singular_name' => __( 'Product Category'),
			'search_items' =>  __( 'Search Product Categories'),
			'all_items' => __( 'All Product Categories'),
			'parent_item' => __( 'Parent Product Category'),
			'parent_item_colon' => __( 'Parent Product Category:'),
			'edit_item' => __( 'Edit Product Category'),
			'update_item' => __( 'Update Product Category'),
			'add_new_item' => __( 'Add New Product Category'),
			'new_item_name' => __( 'New Product Category Name')
		),
		'show_admin_column' => true,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'product_cat' ),
	)
);

register_taxonomy( 'pool_finishes',
	array('product'),
	array('hierarchical' => true,
		'labels' => array(
			'name' => __( 'Pool Finishes'),
			'singular_name' => __( 'Pool Finish'),
			'search_items' =>  __( 'Search Pool Finishes'),
			'all_items' => __( 'All Pool Finishes'),
			'parent_item' => __( 'Parent Pool Finish'),
			'parent_item_colon' => __( 'Parent Pool Finish:'),
			'edit_item' => __( 'Edit Pool Finish'),
			'update_item' => __( 'Update Pool Finish'),
			'add_new_item' => __( 'Add New Pool Finish'),
			'new_item_name' => __( 'New Pool Finish Name')
		),
		'show_admin_column' => true,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'pool_finishes' ),
	)
);

register_taxonomy( 'water_color',
	array('product'),
	array('hierarchical' => true,
		'labels' => array(
			'name' => __( 'Water Color Family'),
			'singular_name' => __( 'Water Color Family'),
			'search_items' =>  __( 'Search Water Color Families'),
			'all_items' => __( 'All Water Color Families'),
			'parent_item' => __( 'Parent Water Color Family'),
			'parent_item_colon' => __( 'Parent Water Color Family:'),
			'edit_item' => __( 'Edit Water Color Family'),
			'update_item' => __( 'Update Water Color Family'),
			'add_new_item' => __( 'Add New Water Color Family'),
			'new_item_name' => __( 'New Water Color Family Name')
		),
		'show_admin_column' => true,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'water_color' ),
	)
);

register_taxonomy( 'finishing_touches',
	array('product'),
	array('hierarchical' => true,
		'labels' => array(
			'name' => __( 'Finishing Touches'),
			'singular_name' => __( 'Finishing Touch'),
			'search_items' =>  __( 'Search Finishing Touches'),
			'all_items' => __( 'All Finishing Touches'),
			'parent_item' => __( 'Parent Finishing Touch'),
			'parent_item_colon' => __( 'Parent Finishing Touch:'),
			'edit_item' => __( 'Edit Finishing Touch'),
			'update_item' => __( 'Update Finishing Touch'),
			'add_new_item' => __( 'Add New Finishing Touch'),
			'new_item_name' => __( 'New Finishing Touch Name')
		),
		'show_admin_column' => true,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'finishing_touches' ),
	)
);

register_taxonomy( 'luminious',
	array('product'),
	array('hierarchical' => true,
		'labels' => array(
			'name' => __( 'Luminious'),
			'singular_name' => __( 'Luminious'),
			'search_items' =>  __( 'Search Luminious'),
			'all_items' => __( 'All Luminious'),
			'parent_item' => __( 'Parent Luminious'),
			'parent_item_colon' => __( 'Parent Luminious:'),
			'edit_item' => __( 'Edit Luminious'),
			'update_item' => __( 'Update Luminious'),
			'add_new_item' => __( 'Add New Luminious'),
			'new_item_name' => __( 'New Luminious Name')
		),
		'show_admin_column' => true,
		'show_ui' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'luminious' ),
	)
);

?>
