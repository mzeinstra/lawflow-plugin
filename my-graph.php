<?php
/*
Plugin Name: My Graph Plugin
Description: A plugin to display a graph as a series of questions and buttons.
Version: 1.0
Author: Maarten Zeinstra and ChatGPT
Author URI: https://ip-squared.com/
*/

function my_graph_shortcode( $atts ) {
  // Get the shortcode attributes and set default values
  $atts = shortcode_atts( array(
    'graphml_file' => '',
  ), $atts );

  // Load the JavaScript file for the plugin
  wp_enqueue_script( 'my-graph', plugin_dir_url( __FILE__ ) . 'js/my-graph.js', array(), '1.0', false );


  // Create a div to hold the question container
  $output = '<div id="previousQuestions-container"></div><div id="question-container"></div><div id="graph-container"></div><div id="file-container"></div>';

  // Create a script tag to initialize the plugin
  $output .= '<script>myGraphInit("' . $atts['graphml_file'] . '");</script>';

  return $output;
}
add_shortcode( 'my-graph', 'my_graph_shortcode' );
