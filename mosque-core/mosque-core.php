<?php
/**
 * Plugin Name: Mosque Core
 * Description: Core functionality for the Mosque website, including custom API endpoints.
 * Version: 1.0.0
 * Author: Antigravity
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Register API routes
add_action( 'rest_api_init', function () {
    register_rest_route( 'mosque/v1', '/settings', array(
        'methods'  => 'GET',
        'callback' => 'mosque_get_settings',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( 'mosque/v1', '/contact', array(
        'methods'  => 'POST',
        'callback' => 'mosque_submit_contact_form',
        'permission_callback' => '__return_true', // Validation happens inside
    ) );
} );

// Include Admin Settings
require_once plugin_dir_path( __FILE__ ) . 'includes/admin-settings.php';

// Include CPT Registrations
require_once plugin_dir_path( __FILE__ ) . 'includes/cpt-registrations.php';

// Include CPT Meta Boxes
require_once plugin_dir_path( __FILE__ ) . 'includes/cpt-metaboxes.php';

/**
 * Handle Contact Form Submission
 */
function mosque_submit_contact_form( $request ) {
    $params = $request->get_params();

    // 1. Verify Nonce (CSRF Protection)
    $nonce = $request->get_header( 'X-WP-Nonce' );
    if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
        return new WP_Error( 'rest_forbidden', 'Invalid security token.', array( 'status' => 403 ) );
    }

    // 2. Rate Limiting (Brute-force Protection)
    $ip = $_SERVER['REMOTE_ADDR'];
    $transient_key = 'mosque_contact_limit_' . md5( $ip );
    if ( get_transient( $transient_key ) ) {
        return new WP_Error( 'rest_rate_limit', 'Too many requests. Please try again in 5 minutes.', array( 'status' => 429 ) );
    }

    // 3. Validation
    $name    = sanitize_text_field( $params['name'] ?? '' );
    $email   = sanitize_email( $params['email'] ?? '' );
    $phone   = sanitize_text_field( $params['phone'] ?? '' );
    $message = sanitize_textarea_field( $params['message'] ?? '' );

    if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
        return new WP_Error( 'rest_invalid_params', 'All fields are required.', array( 'status' => 400 ) );
    }

    if ( ! is_email( $email ) ) {
        return new WP_Error( 'rest_invalid_email', 'Invalid email address.', array( 'status' => 400 ) );
    }

    // 4. Create Message Post
    $post_id = wp_insert_post( array(
        'post_type'    => 'mosque_contact_msg',
        'post_title'   => 'New Message from ' . $name,
        'post_content' => $message,
        'post_status'  => 'publish',
        'meta_input'   => array(
            'contact_name'  => $name,
            'contact_email' => $email,
            'contact_phone' => $phone,
        ),
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_Error( 'rest_internal_error', 'Could not save message.', array( 'status' => 500 ) );
    }

    // 5. Send Email Notification
    $admin_email = get_option( 'mosque_email', get_option( 'admin_email' ) );
    $subject = 'New Contact Message: ' . $name;
    $body = "You have received a new message from the contact form.\n\n";
    $body .= "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n\n";
    $body .= "Message:\n$message\n\n";
    $body .= "---\nThis message was sent from the Masjid Baitun Noor website.";

    wp_mail( $admin_email, $subject, $body );

    // 6. Set Rate Limit Transient (5 minutes)
    set_transient( $transient_key, true, 5 * MINUTE_IN_SECONDS );

    return new WP_REST_Response( array( 'message' => 'Your message has been sent successfully!' ), 200 );
}

/**
 * Get prayer times from IslamicAPI.com or cache
 */
function mosque_get_prayer_times() {
    $api_key = get_option( 'mosque_islamic_api_key' );
    $lat     = get_option( 'mosque_latitude' );
    $lon     = get_option( 'mosque_longitude' );
    $method  = get_option( 'mosque_calculation_method', '2' );
    $school  = get_option( 'mosque_juristic_school', '1' );

    // If no API key or coords, return empty/default
    if ( ! $api_key || ! $lat || ! $lon ) {
        return false;
    }

    $transient_key = 'mosque_prayer_times_' . md5( $lat . $lon . $method . $school );
    $cached_data   = get_transient( $transient_key );

    if ( false !== $cached_data ) {
        return $cached_data;
    }

    // Call IslamicAPI
    // https://islamicapi.com/api/v1/prayer-time/?lat={latitude}&lon={longitude}&method={method}&school={school}&api_key={YOUR_API_KEY}
    $url = sprintf( 
        'https://islamicapi.com/api/v1/prayer-time/?lat=%s&lon=%s&method=%s&school=%s&api_key=%s',
        $lat, $lon, $method, $school, $api_key
    );

    $response = wp_remote_get( $url );

    if ( is_wp_error( $response ) ) {
        return false;
    }

    $body = wp_remote_retrieve_body( $response );
    $data = json_decode( $body, true );

    if ( isset( $data['code'] ) && $data['code'] == 200 && isset( $data['data']['times'] ) ) {
        // Cache for 24 hours
        set_transient( $transient_key, $data['data']['times'], DAY_IN_SECONDS );
        return $data['data']['times'];
    }

    return false;
}

/**
 * Callback for the settings endpoint.
 */
function mosque_get_settings() {
    // Get stored options or defaults
    $primary_color = get_option( 'mosque_primary_color', '#CF5D00' );
    $logo_url      = get_option( 'mosque_logo_url', '' );
    $main_image    = get_option( 'mosque_main_image_url', '' ); // Background image logic to be handled by frontend

    $phone   = get_option( 'mosque_phone', '' );
    $email   = get_option( 'mosque_email', get_option( 'admin_email' ) );
    $address = get_option( 'mosque_address', '' );
    $website = get_option( 'mosque_website', get_bloginfo( 'url' ) );

    $facebook  = get_option( 'mosque_facebook', '' );
    $instagram = get_option( 'mosque_instagram', '' );
    $twitter   = get_option( 'mosque_twitter', '' );
    $youtube   = get_option( 'mosque_youtube', '' );

    // Get Prayer Times
    $prayer_times = mosque_get_prayer_times();
    if ( ! $prayer_times ) {
        // Fallback
        $prayer_times = array(
            'Fajr'    => '05:00',
            'Sunrise' => '06:30',
            'Dhuhr'   => '13:30',
            'Asr'     => '16:45',
            'Maghrib' => '18:15',
            'Isha'    => '20:00',
            'Jummah'  => '13:30',
        );
    }
    // Add Jummah manually if missing from API (usually is)
    if ( ! isset( $prayer_times['Jummah'] ) ) {
        $prayer_times['Jummah'] = '13:30'; 
    }

    $settings = array(
        'branding' => array(
            'name'          => get_bloginfo( 'name' ),
            'description'   => get_bloginfo( 'description' ),
            'primary_color' => $primary_color,
            'logo_url'      => $logo_url,
            'main_image'    => $main_image,
            'intro_video_url' => get_option( 'mosque_intro_video_url', '' ),
        ),
        'contact' => array(
            'phone'     => $phone,
            'email'     => $email,
            'address'   => $address,
            'website'   => $website,
            'latitude'  => get_option( 'mosque_latitude', '' ),
            'longitude' => get_option( 'mosque_longitude', '' ),
        ),
        'social' => array(
            'facebook'  => $facebook,
            'instagram' => $instagram,
            'twitter'   => $twitter,
            'youtube'   => $youtube,
        ),
        'prayer_times' => $prayer_times,
        'nonce'        => wp_create_nonce( 'wp_rest' ), // Expose nonce for CSRF protection
    );

    return new WP_REST_Response( $settings, 200 );
}
