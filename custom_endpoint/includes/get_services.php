<?php
    function get_latest_posts_by_type($request) {
        // return rest_ensure_response('API Works');

        $args = array(
            'post_type' => $request['post_type'],
            'per_page' => $request['per_page']
        );
            
        $posts = get_posts($args);
            
        if(empty($posts)) {
            return new WP_Error( 'empty_category', 'There are no posts to display', array('status' => 404) );
        }
            
        $response = new WP_REST_Response($posts);
        $response->set_status(200);
            
        return $response;
            
    }

    add_action('rest_api_init', function () {
        register_rest_route( 'services/v1/', 'service', array(
                    'methods'  => 'GET',
                    'callback' => 'get_latest_posts_by_type'
            ));
    });
?>