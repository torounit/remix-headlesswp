<?php
/**
 * Plugin Name: Preview Link
 */

add_filter('preview_post_link', function ($link) {
    return $link;
    $resource = rest_get_queried_resource_route();
    $url = esc_url( rest_url( $resource ) );

    $link = add_query_arg(
        array(
            'preview' => 'true',
            'preview_id' => get_the_ID(),
            'preview_nonce' => wp_create_nonce('wp_rest'),
        ),
        home_url('/')
    );

    return $link;
});
