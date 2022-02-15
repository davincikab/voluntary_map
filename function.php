
ALL-INKL.COM - WEBFTP
awoberlin.de | logout
view file
back
File name: /awoberlin.de_202102/wordpress/wp-content/themes/awoberlin-website/Components/GridPostsArchive/functions.php
URL: http://awoberlin.de/wp-content/themes/awoberlin-website/Components/GridPostsArchive/functions.php
<?php
 
namespace Flynt\Components\GridPostsArchive ;
 
use Flynt\FieldVariables ;
use Flynt\Utils\Options ;
use Timber\Term ;
use Timber\PostQuery ;
use Timber\Timber ;
use Flynt\Utils\Asset ;
 
add_filter ( 'Flynt/addComponentData?name=GridPostsArchive' , function ( $data ) {
$postType = $data [ 'postType' ] ;
$taxonomies = get_object_taxonomies ( $data [ 'postType' ] ) ;
foreach ( $taxonomies as $taxonomy ) {
$terms [ ] = get_terms ( [
'taxonomy' => $taxonomy ,
'hide_empty' => true ,
] ) ;
}
 
$args = array (
'post_type' => $postType ,
'posts_per_page' => - 1 ,
'post_status' => 'publish' ,
'orderby' => 'title' ,
'order' => 'ASC' ,
) ;
 
if ( $postType === 'event' ) {
$args = array (
'post_type' => $postType ,
'posts_per_page' => - 1 ,
'post_status' => 'publish' ,
'meta_key' => 'endDate' ,
'orderby' => 'meta_value_num' ,
'order' => 'DESC' ,
) ;
} else if ( $postType == 'news' || $postType == 'pressrelease' ) {
$args = array (
'post_type' => $postType ,
'posts_per_page' => - 1 ,
'post_status' => 'publish' ,
'orderby' => 'date' ,
'order' => 'DESC' ,
) ;
}
$data [ 'posts' ] = new PostQuery ( $args ) ;
 
$data [ 'terms' ] = $terms ;
$data [ 'taxonomies' ] = $taxonomies ;
 
$data [ 'icons' ] = [
'arrow' => Asset :: getContents ( "../assets/icons/arrow.svg" ) ,
'calendar' => Asset :: getContents ( "../assets/icons/calendar_eventteaser.svg" ) ,
] ;
 
$data [ 'jsonData' ] = [
'postsPerPage' => $data [ 'postsPerPage' ]
] ;
 
return $data ;
} ) ;
 
function getACFLayout ( )
{
return [
'name' => 'GridPostsArchive' ,
'label' => 'Grid: Post Archive' ,
'sub_fields' => [
[
'label' => __ ( 'Title' , 'flynt' ) ,
'name' => 'preContentHtml' ,
'type' => 'wysiwyg' ,
'instructions' => __ ( 'Want to add a headline? And a paragraph? Go ahead! Or just leave it empty and nothing will be shown.' , 'flynt' ) ,
'tabs' => 'visual,text' ,
'media_upload' => 0 ,
'delay' => 1 ,
] ,
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
'default_value' => 'news'
] ,
[
'label' => __ ( 'Posts per page' , 'flynt' ) ,
'name' => 'postsPerPage' ,
'type' => 'number' ,
'min' => 0 ,
'step' => 1 ,
'default_value' => 12 ,
'required' => true
] ,
] ,
] ;
}
 
Options :: addGlobal ( 'GridPostsArchive' , [
[
'label' => __ ( 'News Archive' , 'flynt' ) ,
'name' => 'newsArchive' ,
'type' => 'page_link' ,
'post_type' => [
'page'
] ,
'allow_null' => 0 ,
'multiple' => 0
] ,
[
'label' => __ ( 'Event Archive' , 'flynt' ) ,
'name' => 'eventArchive' ,
'type' => 'page_link' ,
'post_type' => [
'page'
] ,
'allow_null' => 0 ,
'multiple' => 0
] ,
[
'label' => __ ( 'Service Archive' , 'flynt' ) ,
'name' => 'serviceArchive' ,
'type' => 'page_link' ,
'post_type' => [
'page'
] ,
'allow_null' => 0 ,
'multiple' => 0
] ,
[
'label' => __ ( 'Press Releases Archive' , 'flynt' ) ,
'name' => 'pressArchive' ,
'type' => 'page_link' ,
'post_type' => [
'page'
] ,
'allow_null' => 0 ,
'multiple' => 0
] ,
] ) ;
 
Options :: addTranslatable ( 'GridPostsArchive' , [
[
'label' => '' ,
'name' => 'label' ,
'type' => 'group' ,
'sub_fields' => [
 
[
'label' => __ ( 'Filter posts label' , 'flynt' ) ,
'name' => 'filterPosts' ,
'type' => 'text' ,
'default_value' => 'Filter entries' ,
'instructions' => 'This will be prefixed by the amount of posts' ,
'wrapper' => [
'width' => '50' ,
] ,
] ,
[
'label' => __ ( 'Found posts label' , 'flynt' ) ,
'name' => 'foundPosts' ,
'type' => 'text' ,
'default_value' => 'Entries found' ,
'instructions' => 'This will be prefixed by the amount of posts' ,
'wrapper' => [
'width' => '50' ,
] ,
] ,
[
'label' => __ ( 'No Posts Found Text' , 'flynt' ) ,
'name' => 'noPostsFound' ,
'type' => 'text' ,
'default_value' => 'No posts found.' ,
'required' => 1 ,
'wrapper' => [
'width' => '50' ,
] ,
] ,
[
'label' => __ ( 'Where Text' , 'flynt' ) ,
'name' => 'where' ,
'type' => 'text' ,
'default_value' => 'Where?' ,
'required' => 1 ,
'wrapper' => [
'width' => '50' ,
] ,
] ,
[
'label' => __ ( 'Hours until' , 'flynt' ) ,
'name' => 'hoursUntil' ,
'type' => 'text' ,
'default_value' => 'Time until'
] ,
[
'label' => __ ( 'Hours' , 'flynt' ) ,
'name' => 'hours' ,
'type' => 'text' ,
'default_value' => 'clock'
] ,
[
'label' => __ ( 'Service instructions' , 'flynt' ) ,
'name' => 'serviceInstructions' ,
'type' => 'text' ,
'default_value' => 'Filter our offers'
] ,
[
'label' => __ ( 'News category All label' , 'flynt' ) ,
'name' => 'category' ,
'type' => 'text' ,
'default_value' => __ ( 'All News' , 'flynt' )
] ,
[
'label' => __ ( 'Hashtag All label' , 'flynt' ) ,
'name' => 'hashtag' ,
'type' => 'text' ,
'default_value' => __ ( 'All Topics' , 'flynt' )
] ,
[
'label' => __ ( 'Event languages ​​All label' , 'flynt' ) ,
'name' => 'event language' ,
'type' => 'text' ,
'default_value' => __ ( 'All languages' , 'flynt' )
] ,
[
'label' => __ ( 'Services languages ​​All label' , 'flynt' ) ,
'name' => 'service language' ,
'type' => 'text' ,
'default_value' => __ ( 'All languages' , 'flynt' )
] ,
[
'label' => __ ( 'Neighborhoods All label' , 'flynt' ) ,
'name' => 'neighborhood' ,
'type' => 'text' ,
'default_value' => __ ( 'All districts' , 'flynt' )
] ,
[
'label' => __ ( 'Service category All label' , 'flynt' ) ,
'name' => 'service category' ,
'type' => 'text' ,
'default_value' => __ ( 'All Services' , 'flynt' )
] ,
[
'label' => __ ( 'Months All label' , 'flynt' ) ,
'name' => 'month' ,
'type' => 'text' ,
'default_value' => __ ( 'All months' , 'flynt' )
] ,
] ,
] ,
] ) ;
 
back
Imprint | Terms and Conditions | Privacy Information
ALL-INKL.COM | Main Street 68 | D-02742 Friedersdorf | Phone +49 35872 353-10 | Fax +49 35872 353-30
 	 	 
