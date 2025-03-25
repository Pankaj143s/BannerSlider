<?php
/**
 * Plugin Name: My Slider Plugin
 * Plugin URI:  https://example.com
 * Description: A custom slider plugin with fade/scale animations and an embedded video sequence.
 * Version:     1.0
 * Author:      Your Name
 * Author URI:  https://example.com
 * License:     GPL2
 */

// Prevent direct file access
if ( ! defined('ABSPATH') ) {
    exit;
}

/**
 * Enqueue Plugin Styles and Scripts
 */
function my_slider_plugin_enqueue_assets() {
    // Register + Enqueue CSS
    wp_enqueue_style(
        'my-slider-plugin-style',
        plugin_dir_url(__FILE__) . 'assets/style.css',
        array(), // no dependencies
        '1.0',
        'all'
    );

    // Register + Enqueue JS
    // (Load in footer => true)
    wp_enqueue_script(
        'my-slider-plugin-script',
        plugin_dir_url(__FILE__) . 'assets/script.js',
        array(), 
        '1.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'my_slider_plugin_enqueue_assets' );

/**
 * Shortcode to Render the Slider
 * Usage: [my_slider]
 */
function my_slider_plugin_shortcode() {
    // Start output buffering
    ob_start();
    ?>
    <!-- BEGIN MY SLIDER MARKUP -->
    <div class="placeholder">
      <h1>Welcome to Our Page</h1>
      <p>Scroll or click the arrows to move through slides.</p>
    </div>

    <div class="slider-viewport" id="sliderSection">
      <div class="slider-container">
        <!-- Slide 1 -->
        <div class="slide slide1 active" id="slide1">
          <div class="slide-title">
            <div class="word-an">AN</div>
            <div class="word-aaron">AARON</div>
            <div class="word-einstein">EINSTEIN</div>
            <div class="word-project">PROJECT</div>
          </div>
        </div>

        <!-- Slide 2 -->
        <div class="slide slide2" id="slide2">
          <img
            src="<?php echo plugin_dir_url(__FILE__); ?>assets/Jens and Aron in lab.jpeg"
            alt="Jens and Aron in lab"
          />
        </div>

        <!-- Slide 3: video + text -->
        <div class="slide slide3" id="slide3">
          <div class="video-content">
            <!-- Text #1: appears first, THEN video starts -->
            <div class="repellent-text1" id="repellentText1">
              How do you test a tick repellent ?
            </div>

            <!-- The video (no autoplay so we detect end) -->
            <video id="tickVideo" muted>
              <!-- Adjust if your mp4 name differs -->
              <source src="<?php echo plugin_dir_url(__FILE__); ?>assets/Tick_Repellent_Test.mp4" type="video/mp4" />
            </video>

            <!-- Text #2: after the video ends -->
            <div class="repellent-text2" id="repellentText2">
              Ever wondered how many tick repellents don't pass this test?
            </div>

            <!-- Animated counter (0% -> 95%) -->
            <div class="repellent-count" id="repellentCount">0%</div>

            <!-- Text #3: after the counter finishes -->
            <div class="repellent-text3" id="repellentText3">
              In fact – a startling 95% of the tick repellents we evaluated did
              not pass this test. Isn't that surprising?
            </div>
          </div>
        </div>
      </div>

      <!-- Arrow Navigation -->
      <div class="slider-arrow left" id="arrowLeft">&#9664;</div>
      <div class="slider-arrow right" id="arrowRight">&#9654;</div>
    </div>

    <div class="placeholder">
      <h1>More Content Below</h1>
      <p>Keep scrolling for more content.</p>
    </div>
    <!-- END MY SLIDER MARKUP -->
    <?php
    return ob_get_clean();
}
add_shortcode( 'my_slider', 'my_slider_plugin_shortcode' );
