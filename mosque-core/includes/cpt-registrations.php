<?php
/**
 * Custom Post Type Registrations
 */

function mosque_register_cpts() {
    // Event CPT
    $event_labels = array(
        'name'               => 'Events',
        'singular_name'      => 'Event',
        'menu_name'          => 'Events',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Event',
        'edit_item'          => 'Edit Event',
        'new_item'           => 'New Event',
        'view_item'          => 'View Event',
        'search_items'       => 'Search Events',
        'not_found'          => 'No events found',
        'not_found_in_trash' => 'No events found in Trash'
    );

    register_post_type( 'mosque_event', array(
        'labels'              => $event_labels,
        'public'              => true,
        'has_archive'         => true,
        'menu_icon'           => 'dashicons-calendar-alt',
        'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'        => true, // Essential for React
        'rewrite'             => array( 'slug' => 'events' ),
    ) );

    // Service CPT
    $service_labels = array(
        'name'               => 'Services',
        'singular_name'      => 'Service',
        'menu_name'          => 'Services',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Service',
        'edit_item'          => 'Edit Service',
        'new_item'           => 'New Service',
        'view_item'          => 'View Service',
        'search_items'       => 'Search Services',
        'not_found'          => 'No services found',
        'not_found_in_trash' => 'No services found in Trash'
    );

    register_post_type( 'mosque_service', array(
        'labels'              => $service_labels,
        'public'              => true,
        'has_archive'         => true,
        'menu_icon'           => 'dashicons-hammer',
        'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'        => true,
        'rewrite'             => array( 'slug' => 'services' ),
    ) );

    // Sermon CPT
    $sermon_labels = array(
        'name'               => 'Sermons',
        'singular_name'      => 'Sermon',
        'menu_name'          => 'Sermons',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Sermon',
        'edit_item'          => 'Edit Sermon',
        'new_item'           => 'New Sermon',
        'view_item'          => 'View Sermon',
        'search_items'       => 'Search Sermons',
        'not_found'          => 'No sermons found',
        'not_found_in_trash' => 'No sermons found in Trash'
    );

    register_post_type( 'mosque_sermon', array(
        'labels'              => $sermon_labels,
        'public'              => true,
        'has_archive'         => true,
        'menu_icon'           => 'dashicons-megaphone',
        'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'        => true,
        'rewrite'             => array( 'slug' => 'sermons' ),
    ) );
    // Register donations
    register_post_type( 'mosque_donation', array(
        'labels'              => array(
            'name'          => 'Donations',
            'singular_name' => 'Donation',
            'add_new_item'  => 'Add New Donation Cause',
            'edit_item'     => 'Edit Donation Cause',
        ),
        'public'              => true,
        'has_archive'         => true,
        'menu_icon'           => 'dashicons-heart', // Changed from Megaphone to Heart
        'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest'        => true,
        'rewrite'             => array( 'slug' => 'donations' ),
    ) );

    // Contact Messages CPT (Private - Managed via REST API)
    register_post_type( 'mosque_contact_msg', array(
        'labels'              => array(
            'name'          => 'Contact Messages',
            'singular_name' => 'Message',
            'menu_name'     => 'Messages',
        ),
        'public'              => false, // Hidden from public search
        'show_ui'             => true,  // Show in WordPress Admin
        'show_in_menu'        => true,
        'menu_icon'           => 'dashicons-email',
        'supports'            => array( 'title', 'editor', 'custom-fields' ),
        'show_in_rest'        => false, // Don't expose list via REST for security
    ) );
}
add_action( 'init', 'mosque_register_cpts' );


// Register Custom Meta Fields for REST API
function mosque_register_meta() {
    
    // Event Meta
    register_post_meta( 'mosque_event', 'event_date', array(
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string', // Storing YYYY-MM-DD
    ) );
    register_post_meta( 'mosque_event', 'event_time', array(
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string', // Storing HH:MM
    ) );
    register_post_meta( 'mosque_event', 'event_location', array(
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string',
    ) );

    // Service Meta
    register_post_meta( 'mosque_service', 'service_icon', array( // e.g., 'BookOpen', 'Users'
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string',
    ) );
    
    // Sermon Meta
    register_post_meta( 'mosque_sermon', 'sermon_video_url', array(
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string',
    ) );
    register_post_meta( 'mosque_sermon', 'sermon_preacher', array(
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string',
    ) );

    // Donation Meta
    register_post_meta( 'mosque_donation', 'donation_link', array(
        'show_in_rest' => true,
        'single'       => true,
        'type'         => 'string',
    ) );
}
add_action( 'init', 'mosque_register_meta' );
