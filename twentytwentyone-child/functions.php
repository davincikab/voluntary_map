<?php
function function get_latest_posts_by_type($request) {
    return rest_ensure_response('API Works')
}

add_action('rest_api_init', function () {
    register_rest_route( 'services/v1/', 'service', array(
                  'methods'  => 'GET',
                  'callback' => 'get_latest_posts_by_type'
        ));
});

?>