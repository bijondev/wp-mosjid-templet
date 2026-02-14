<?php
/**
 * Admin Settings for Mosque Core
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Register Settings
add_action( 'admin_init', 'mosque_register_settings' );

function mosque_register_settings() {
    // --- Branding Group ---
    register_setting( 'mosque_options_group', 'mosque_primary_color' );
    register_setting( 'mosque_options_group', 'mosque_logo_url' );
    register_setting( 'mosque_options_group', 'mosque_main_image_url' );
    register_setting( 'mosque_options_group', 'mosque_gallery_hero_image' );
    register_setting( 'mosque_options_group', 'mosque_intro_video_url' );

    // --- Contact Group ---
    register_setting( 'mosque_options_group', 'mosque_phone' );
    register_setting( 'mosque_options_group', 'mosque_email' );
    register_setting( 'mosque_options_group', 'mosque_address' );
    register_setting( 'mosque_options_group', 'mosque_website' );

    // --- Social Group ---
    register_setting( 'mosque_options_group', 'mosque_facebook' );
    register_setting( 'mosque_options_group', 'mosque_instagram' );
    register_setting( 'mosque_options_group', 'mosque_twitter' );
    register_setting( 'mosque_options_group', 'mosque_youtube' );

    // --- Prayer API Group ---
    register_setting( 'mosque_options_group', 'mosque_islamic_api_key' );
    register_setting( 'mosque_options_group', 'mosque_latitude' );
    register_setting( 'mosque_options_group', 'mosque_longitude' );
    register_setting( 'mosque_options_group', 'mosque_calculation_method' );
    register_setting( 'mosque_options_group', 'mosque_juristic_school' );

    // --- About Page Highlights ---
    register_setting( 'mosque_options_group', 'mosque_mission_title' );
    register_setting( 'mosque_options_group', 'mosque_mission_desc' );
    register_setting( 'mosque_options_group', 'mosque_vision_title' );
    register_setting( 'mosque_options_group', 'mosque_vision_desc' );
    register_setting( 'mosque_options_group', 'mosque_community_title' );
    register_setting( 'mosque_options_group', 'mosque_community_desc' );
    register_setting( 'mosque_options_group', 'mosque_education_title' );
    register_setting( 'mosque_options_group', 'mosque_education_title' );
    register_setting( 'mosque_options_group', 'mosque_education_desc' );
}

// Add Options Page
add_action( 'admin_menu', 'mosque_register_options_page' );

function mosque_register_options_page() {
    add_options_page(
        'Mosque Settings',
        'Mosque Settings',
        'manage_options',
        'mosque-settings',
        'mosque_render_options_page'
    );
}

// Enqueue Media Uploader Scripts
add_action( 'admin_enqueue_scripts', 'mosque_admin_scripts' );

function mosque_admin_scripts( $hook ) {
    if ( 'settings_page_mosque-settings' !== $hook ) {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script( 'mosque-admin-script', false, array( 'jquery' ), false, true );
}

// Render Options Page
function mosque_render_options_page() {
    ?>
    <div class="wrap">
        <h1>Mosque Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields( 'mosque_options_group' ); ?>
            <?php do_settings_sections( 'mosque_options_group' ); ?>

            <table class="form-table">
                <tr valign="top">
                    <td colspan="2"><h2>Branding</h2></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Primary Color</th>
                    <td><input type="color" name="mosque_primary_color" value="<?php echo esc_attr( get_option( 'mosque_primary_color', '#10B981' ) ); ?>" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Logo URL</th>
                    <td>
                        <input type="text" name="mosque_logo_url" id="mosque_logo_url" value="<?php echo esc_attr( get_option( 'mosque_logo_url' ) ); ?>" class="regular-text" />
                        <button type="button" class="button mosque-upload-btn" data-target="mosque_logo_url">Upload Logo</button>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Main Image URL (Home Background)</th>
                    <td>
                        <input type="text" name="mosque_main_image_url" id="mosque_main_image_url" value="<?php echo esc_attr( get_option( 'mosque_main_image_url' ) ); ?>" class="regular-text" />
                        <button type="button" class="button mosque-upload-btn" data-target="mosque_main_image_url">Upload Image</button>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Gallery Hero Image URL</th>
                    <td>
                        <input type="text" name="mosque_gallery_hero_image" id="mosque_gallery_hero_image" value="<?php echo esc_attr( get_option( 'mosque_gallery_hero_image' ) ); ?>" class="regular-text" />
                        <button type="button" class="button mosque-upload-btn" data-target="mosque_gallery_hero_image">Upload Image</button>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Intro Video URL (YouTube/Vimeo)</th>
                    <td>
                        <input type="url" name="mosque_intro_video_url" id="mosque_intro_video_url" value="<?php echo esc_attr( get_option( 'mosque_intro_video_url' ) ); ?>" class="regular-text" placeholder="https://www.youtube.com/watch?v=..." />
                        <p class="description">Paste the link to your feature video. Supports YouTube and Vimeo.</p>
                    </td>
                </tr>

                <tr valign="top">
                    <td colspan="2"><h2>Contact Info</h2></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Phone</th>
                    <td><input type="text" name="mosque_phone" value="<?php echo esc_attr( get_option( 'mosque_phone' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Custom Email</th>
                    <td><input type="email" name="mosque_email" value="<?php echo esc_attr( get_option( 'mosque_email' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Address</th>
                    <td><textarea name="mosque_address" class="large-text" rows="3"><?php echo esc_textarea( get_option( 'mosque_address' ) ); ?></textarea></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Website URL</th>
                    <td><input type="url" name="mosque_website" value="<?php echo esc_attr( get_option( 'mosque_website' ) ); ?>" class="regular-text" /></td>
                </tr>

                <tr valign="top">
                    <td colspan="2"><h2>Social Media</h2></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Facebook</th>
                    <td><input type="url" name="mosque_facebook" value="<?php echo esc_attr( get_option( 'mosque_facebook' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Instagram</th>
                    <td><input type="url" name="mosque_instagram" value="<?php echo esc_attr( get_option( 'mosque_instagram' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Twitter/X</th>
                    <td><input type="url" name="mosque_twitter" value="<?php echo esc_attr( get_option( 'mosque_twitter' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">YouTube</th>
                    <td><input type="url" name="mosque_youtube" value="<?php echo esc_attr( get_option( 'mosque_youtube' ) ); ?>" class="regular-text" /></td>
                </tr>

                <tr valign="top">
                    <td colspan="2"><h2>Prayer Times API (IslamicAPI.com)</h2></td>
                </tr>
                <tr valign="top">
                    <th scope="row">API Key</th>
                    <td><input type="text" name="mosque_islamic_api_key" value="<?php echo esc_attr( get_option( 'mosque_islamic_api_key' ) ); ?>" class="regular-text" /> <p class="description">Get your key from <a href="https://islamicapi.com" target="_blank">islamicapi.com</a></p></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Latitude</th>
                    <td><input type="text" name="mosque_latitude" value="<?php echo esc_attr( get_option( 'mosque_latitude' ) ); ?>" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Longitude</th>
                    <td><input type="text" name="mosque_longitude" value="<?php echo esc_attr( get_option( 'mosque_longitude' ) ); ?>" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Calculation Method</th>
                    <td>
                        <select name="mosque_calculation_method">
                            <?php 
                            $method = get_option( 'mosque_calculation_method', '2' );
                            $methods = [
                                '1' => 'University of Islamic Sciences, Karachi',
                                '2' => 'Islamic Society of North America (ISNA)',
                                '3' => 'Muslim World League (MWL)',
                                '4' => 'Umm Al-Qura University, Makkah',
                                '5' => 'Egyptian General Authority of Survey',
                            ];
                            foreach ( $methods as $key => $label ) {
                                echo '<option value="' . esc_attr( $key ) . '" ' . selected( $method, $key, false ) . '>' . esc_html( $label ) . '</option>';
                            }
                            ?>
                        </select>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Juristic School (Asr)</th>
                    <td>
                        <select name="mosque_juristic_school">
                            <?php 
                            $school = get_option( 'mosque_juristic_school', '1' );
                            $schools = [
                                '1' => 'Shafi (Standard)',
                                '2' => 'Hanafi',
                            ];
                            foreach ( $schools as $key => $label ) {
                                echo '<option value="' . esc_attr( $key ) . '" ' . selected( $school, $key, false ) . '>' . esc_html( $label ) . '</option>';
                            }
                            ?>
                        </select>
                    </td>
                </tr>

                <tr valign="top">
                    <td colspan="2"><h2>About Page Highlights</h2></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Mission Title</th>
                    <td><input type="text" name="mosque_mission_title" value="<?php echo esc_attr( get_option( 'mosque_mission_title', 'Our Mission' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Mission Description</th>
                    <td><textarea name="mosque_mission_desc" class="large-text" rows="3"><?php echo esc_textarea( get_option( 'mosque_mission_desc', 'To serve Allah and our community by providing religious, educational, and social services that inspire righteousness and compassion.' ) ); ?></textarea></td>
                </tr>
                
                <tr valign="top">
                    <th scope="row">Vision Title</th>
                    <td><input type="text" name="mosque_vision_title" value="<?php echo esc_attr( get_option( 'mosque_vision_title', 'Our Vision' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Vision Description</th>
                    <td><textarea name="mosque_vision_desc" class="large-text" rows="3"><?php echo esc_textarea( get_option( 'mosque_vision_desc', 'To be a beacon of Islamic values and a center of excellence for spiritual growth and community development in the region.' ) ); ?></textarea></td>
                </tr>

                <tr valign="top">
                    <th scope="row">Community Title</th>
                    <td><input type="text" name="mosque_community_title" value="<?php echo esc_attr( get_option( 'mosque_community_title', 'Community First' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Community Description</th>
                    <td><textarea name="mosque_community_desc" class="large-text" rows="3"><?php echo esc_textarea( get_option( 'mosque_community_desc', 'We believe in the power of unity and strive to create an inclusive environment where everyone feels welcome and supported.' ) ); ?></textarea></td>
                </tr>

                <tr valign="top">
                    <th scope="row">Education Title</th>
                    <td><input type="text" name="mosque_education_title" value="<?php echo esc_attr( get_option( 'mosque_education_title', 'Lifelong Learning' ) ); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Education Description</th>
                    <td><textarea name="mosque_education_desc" class="large-text" rows="3"><?php echo esc_textarea( get_option( 'mosque_education_desc', 'Commitment to providing authentic Islamic knowledge and practical life skills through our various educational programs.' ) ); ?></textarea></td>
                </tr>
            </table>
            
            <?php submit_button(); ?>
        </form>

        <script>
        jQuery(document).ready(function($){
            $('.mosque-upload-btn').click(function(e) {
                e.preventDefault();
                var button = $(this);
                var targetId = button.data('target');
                var custom_uploader = wp.media({
                    title: 'Select Image',
                    button: { text: 'Use this image' },
                    multiple: false
                }).on('select', function() {
                    var attachment = custom_uploader.state().get('selection').first().toJSON();
                    $('#' + targetId).val(attachment.url);
                }).open();
            });
        });
        </script>
    </div>
    <?php
}
