<?php
/*
Plugin Name: Custom Endpoint
Plugin URI: 
Description: Custom Services Endpoints
Version: 1.0.0
Author: David
Text Domain: 
Domain Path: /lang
*/

// Exit if Accessed Directly
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

// Service Content
require_once( plugin_dir_path( __FILE__ ) . 'includes/get_services.php' );
