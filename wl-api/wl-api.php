<?php
/**
 * Plugin Name: Custom API
 */

function wl_posts() {
    return "Custom Endpont"
}
add_action('init', function() {
    register_rest_route('w1/v1', 'posts', [
        'methods'=>'GET',
        'callback' => 'wl_posts'
    ]);
})