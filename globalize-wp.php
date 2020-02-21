<?php
/**
 * Translation Service WordPress Plugin - Globalize WP
 *
 * @package   Globalize_WP
 * @copyright Copyright(c) 2019, Globalize WP
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 *
 * Plugin Name: Globalize WP
 * Plugin URI: https://globalizewp.com
 * Description: The easy and efficient way to translate the backend and globalize accessibility.
 * Version: 1.0.0
 * Author: Luna
 * Author URI: https://byluna.co
 * License: GPL2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: globalize-wp
 * Domain Path: languages
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

// Only load if Gutenberg is available.
if ( ! function_exists( 'register_block_type' ) ) {
	return;
}

/**
 * Set template in regist post type args.
 *
 * @param array  $args The args of the query.
 * @param string $post_type The post type.
 * @return array
 */

/**
 * Enqueue block editor only JavaScript and CSS
 */
function globalizewp_editor_scripts() {

	// Make paths variables so we don't write em twice ;).
	$block_path        = '/assets/js/editor.blocks.js';
	$editor_style_path = '/assets/css/blocks.editor.css';

	// Enqueue the bundled block JS file.
	wp_enqueue_script(
		'globalizewp-blocks-js',
		plugins_url( $block_path, __FILE__ ),
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ],
		filemtime( plugin_dir_path( __FILE__ ) . $block_path ),
		true
	);

	// Enqueue optional editor only styles.
	wp_enqueue_style(
		'globalizewp-blocks-editor-css',
		plugins_url( $editor_style_path, __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . $editor_style_path )
	);

}

// Hook scripts function into block editor hook.
add_action( 'enqueue_block_editor_assets', 'globalizewp_editor_scripts' );


/**
 * Enqueue front end and editor JavaScript and CSS
 */
function globalizewp_scripts() {
	// Make paths variables so we don't write em twice ;).
	$block_path = '/assets/js/frontend.blocks.js';
	$style_path = '/assets/css/blocks.style.css';

	// Enqueue the bundled block JS file.
	wp_enqueue_script(
		'globalizewp-blocks-frontend-js',
		plugins_url( $block_path, __FILE__ ),
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-api', 'wp-editor' ],
		filemtime( plugin_dir_path( __FILE__ ) . $block_path ),
		true
	);

	// Localize the bundled block JS file.
	wp_localize_script(
		'globalizewp-blocks-frontend-js',
		'globalizewp',
		array(
			'nonce' => wp_create_nonce( 'globalizewp_nonce' ),
		)
	);

	// Enqueue frontend and editor block styles.
	wp_enqueue_style(
		'globalizewp-blocks-css',
		plugins_url( $style_path, __FILE__ ),
		null,
		filemtime( plugin_dir_path( __FILE__ ) . $style_path )
	);

}

// Hook scripts function into block editor hook.
add_action( 'enqueue_block_assets', 'globalizewp_scripts' );

// Plugin Slug Search Block.
require plugin_dir_path( __FILE__ ) . 'blocks/globalize-search/index.php';
