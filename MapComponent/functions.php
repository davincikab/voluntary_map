<?php
 
namespace Flynt\Components\MapComponent ;
 
use Flynt\FieldVariables ;
use Flynt\Utils\Options ;
use Timber\Term ;
use Timber\PostQuery ;
use Timber\Timber ;
use Flynt\Utils\Asset ;
 
 
add_filter ( 'Flynt/addComponentData?name=MapComponent' , function ( $data ) {
    $postType = $data ['postType'];
    $taxonomies = get_object_taxonomies($data['postType']) ;

    foreach ( $taxonomies as $taxonomy ) {
        $terms [ ] = get_terms ([
            'taxonomy' => $taxonomy ,
            'hide_empty' => true ,
        ]);
    }

    $args = array (
        'post_type' => $postType ,
        'posts_per_page' => - 1 ,
        'post_status' => 'publish' ,
        'orderby' => 'title' ,
        'order' => 'ASC' ,
    );

    $posts = new PostQuery( $args );

    foreach ( $posts as $post ) {
        foreach ( $taxonomies as $taxonomy ) {
            $termsQ = $post->terms($taxonomy);
            $pterms = array();

            foreach($termsQ as $term) {
                array_push($pterms, $term->name);
            }

            $post->$taxonomy = join(",", $pterms);
             
        }
    }

    $data['posts'] = $posts;
    $data [ 'terms' ] = $terms;
    $data [ 'taxonomies' ] = $taxonomies;

    $data [ 'icons' ] = [
        'arrow' => Asset :: getContents ( "../assets/icons/arrow.svg" ) ,
        'calendar' => Asset :: getContents ( "../assets/icons/calendar_eventteaser.svg" ) ,
        ] ;
         
    $data [ 'jsonData' ] = [
        'posts' => $data['posts'],
        'terms' => $data [ 'terms' ],
        'taxonomies' => $data [ 'taxonomies' ],
        'postsPerPage' => $data ['postsPerPage'],
        'dataUrl' => Asset :: requireUrl ( 'Components/MapComponent/assets' )
    ];

    return $data ;
});

function getACFLayout () {
    return [
        'name' => 'MapComponent' ,
        'label' => __ ( 'Block: MapComponent' , 'flynt' ) ,
        'sub_fields' => [
            [
                'label' => __ ( 'General' , 'flynt' ) ,
                'name' => 'generalTab' ,
                'type' => 'tab' ,
                'placement' => 'top' ,
                'endpoint' => 0 ,
            ],
            [
                'label' => __ ( 'Post Type' , 'flynt' ) ,
                'name' => 'postType' ,
                'type' => 'select' ,
                'allow_null' => 0 ,
                'multiple' => 0 ,
                'ui' => 1 ,
                'ajax' => 0 ,
                'choices' => [
                    'news' => __ ( 'news' , 'flynt' ) ,
                    'event' => __ ( 'Events' , 'flynt' ) ,
                    'pressrelease' => __ ( 'Press Releases' , 'flynt' ) ,
                    'service' => __ ( 'Services' , 'flynt' ) ,
                ] ,
                'default_value' => 'service'
            ],
            [
                'label' => __ ( 'Posts per page' , 'flynt' ) ,
                'name' => 'postsPerPage' ,
                'type' => 'number' ,
                'min' => 0 ,
                'step' => 1 ,
                'default_value' => 1000,
                'required' => true
            ], 
            [
                'label' => __ ( 'Content' , 'flynt' ) ,
                'name' => 'contentHtml' ,
                'type' => 'wysiwyg' ,
                'delay' => 1 ,
                'media_upload' => 0 ,
                'required' => 0 ,
            ],
        ]
    ];
}
 
Options :: addTranslatable ( 'MapComponent' , [
 
] ) ;
 
Options :: addGlobal ( 'MapComponent' , [
 
]) ;