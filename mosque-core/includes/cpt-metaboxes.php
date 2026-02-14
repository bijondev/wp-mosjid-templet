<?php
/**
 * Custom Meta Boxes for CPTs
 */

// Add Meta Boxes
function mosque_add_meta_boxes() {
    add_meta_box( 'mosque_event_meta', 'Event Details', 'mosque_render_event_meta', 'mosque_event', 'side', 'high' );
    add_meta_box( 'mosque_service_meta', 'Service Details', 'mosque_render_service_meta', 'mosque_service', 'side', 'high' );
    add_meta_box( 'mosque_sermon_meta', 'Sermon Details', 'mosque_render_sermon_meta', 'mosque_sermon', 'side', 'high' );
    add_meta_box( 'mosque_donation_meta', 'Donation Details', 'mosque_render_donation_meta', 'mosque_donation', 'side', 'high' );
}
add_action( 'add_meta_boxes', 'mosque_add_meta_boxes', 20 );

// Render Event Meta
function mosque_render_event_meta( $post ) {
    $date = get_post_meta( $post->ID, 'event_date', true );
    $time = get_post_meta( $post->ID, 'event_time', true );
    $location = get_post_meta( $post->ID, 'event_location', true );
    wp_nonce_field( 'mosque_save_meta', 'mosque_meta_nonce' );
    ?>
    <p>
        <label for="event_date">Date:</label>
        <input type="date" id="event_date" name="event_date" value="<?php echo esc_attr( $date ); ?>" class="widefat" min="<?php echo date('Y-m-d'); ?>">
    </p>
    <p>
        <label for="event_time">Time:</label>
        <input type="text" id="event_time" name="event_time" value="<?php echo esc_attr( $time ); ?>" class="widefat" placeholder="e.g. 6:30 PM">
    </p>
    <p>
        <label for="event_location">Location:</label>
        <input type="text" id="event_location" name="event_location" value="<?php echo esc_attr( $location ); ?>" class="widefat" placeholder="e.g. Main Hall">
    </p>
    <?php
}

// Render Service Meta
function mosque_render_service_meta( $post ) {
    $icon = get_post_meta( $post->ID, 'service_icon', true );
    wp_nonce_field( 'mosque_save_meta', 'mosque_meta_nonce' );
    ?>
    <p>
        <label for="service_icon">Icon Name (Lucide):</label>
        <input type="text" id="service_icon" name="service_icon" value="<?php echo esc_attr( $icon ); ?>" class="widefat" placeholder="e.g. Users, BookOpen, Heart">
        <small>Use icon names from <a href="https://lucide.dev/icons" target="_blank">Lucide React</a>.</small>
    </p>
    <?php
}

// Render Sermon Meta
function mosque_render_sermon_meta( $post ) {
    $video_url = get_post_meta( $post->ID, 'sermon_video_url', true );
    $preacher = get_post_meta( $post->ID, 'sermon_preacher', true );
    wp_nonce_field( 'mosque_save_meta', 'mosque_meta_nonce' );
    ?>
    <p>
        <label for="sermon_preacher">Preacher/Imam:</label>
        <input type="text" id="sermon_preacher" name="sermon_preacher" value="<?php echo esc_attr( $preacher ); ?>" class="widefat">
    </p>
    <p>
        <label for="sermon_video_url">Video URL (YouTube/Vimeo):</label>
        <input type="url" id="sermon_video_url" name="sermon_video_url" value="<?php echo esc_attr( $video_url ); ?>" class="widefat">
    </p>
    <?php
}

// Render Donation Meta
function mosque_render_donation_meta( $post ) {
    $link = get_post_meta( $post->ID, 'donation_link', true );
    wp_nonce_field( 'mosque_save_meta', 'mosque_meta_nonce' );
    ?>
    <p>
        <label for="donation_link">Donation Link (URL):</label>
        <input type="url" id="donation_link" name="donation_link" value="<?php echo esc_url( $link ); ?>" class="widefat" placeholder="e.g. https://paypal.me/yourmosque">
        <small>Enter the full URL where users should be redirected to donate.</small>
    </p>
    <?php
}

// Save Meta Data
function mosque_save_meta( $post_id ) {
    if ( ! isset( $_POST['mosque_meta_nonce'] ) || ! wp_verify_nonce( $_POST['mosque_meta_nonce'], 'mosque_save_meta' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    // Save Event Meta
    if ( isset( $_POST['event_date'] ) ) update_post_meta( $post_id, 'event_date', sanitize_text_field( $_POST['event_date'] ) );
    if ( isset( $_POST['event_time'] ) ) update_post_meta( $post_id, 'event_time', sanitize_text_field( $_POST['event_time'] ) );
    if ( isset( $_POST['event_location'] ) ) update_post_meta( $post_id, 'event_location', sanitize_text_field( $_POST['event_location'] ) );

    // Save Service Meta
    if ( isset( $_POST['service_icon'] ) ) update_post_meta( $post_id, 'service_icon', sanitize_text_field( $_POST['service_icon'] ) );

    // Save Sermon Meta
    if ( isset( $_POST['sermon_preacher'] ) ) update_post_meta( $post_id, 'sermon_preacher', sanitize_text_field( $_POST['sermon_preacher'] ) );
    if ( isset( $_POST['sermon_video_url'] ) ) update_post_meta( $post_id, 'sermon_video_url', esc_url_raw( $_POST['sermon_video_url'] ) );

    // Save Donation Meta
    if ( isset( $_POST['donation_link'] ) ) update_post_meta( $post_id, 'donation_link', esc_url_raw( $_POST['donation_link'] ) );
}
add_action( 'save_post', 'mosque_save_meta' );
