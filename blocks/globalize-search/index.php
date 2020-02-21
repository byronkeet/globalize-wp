<?php
/**
 * Server-side rendering of the `Globalze Search` block.
 *
 * @package Globalize WP
 */

/**
 * Dynamically renders the `core/search` block.
 *
 * @param array $attributes The block attributes.
 *
 * @return string The search block markup.
 */
function render_block_globalize_search( $attributes ) {
	static $instance_id = 0;

	$input_id      = 'wp-block-globalizewp-globalize-search__input-' . ( ++$instance_id );
	$label_markup  = '';
	$button_markup = '';

	if ( ! empty( $attributes['label'] ) ) {
		$label_markup = sprintf(
			'<label for="%s" class="wp-block-globalizewp-globalize-search__label">%s</label>',
			$input_id,
			$attributes['label']
		);
	} else {
		$label_markup = sprintf(
			'<label for="%s" class="wp-block-globalizewp-globalize-search__label screen-reader-text">%s</label>',
			$input_id,
			__( 'Search' )
		);
	}

	$input_markup = sprintf(
		'<input type="search" id="%s" class="wp-block-globalizewp-globalize-search__input" name="s" value="%s" placeholder="%s" required />',
		$input_id,
		esc_attr( get_search_query() ),
		esc_attr( $attributes['placeholder'] )
	);

	if ( ! empty( $attributes['buttonText'] ) ) {
		$button_markup = sprintf(
			'<button type="submit" class="wp-block-globalizewp-globalize-search__button">%s</button>',
			$attributes['buttonText']
		);
	}

	$class = 'wp-block-globalizewp-globalize-search';
	if ( isset( $attributes['className'] ) ) {
		$class .= ' ' . $attributes['className'];
	}
	if ( isset( $attributes['align'] ) ) {
		$class .= ' align' . $attributes['align'];
	}

	return sprintf(
		'<div class="%s" role="search" method="get" action="%s">%s</div><div class="wp-block-globalizewp-globalize-search__response"></div>',
		$class,
		esc_url( home_url( '/' ) ),
		$label_markup . $input_markup . $button_markup
	);
}

/**
 * Registers the `Globalize Search` block on the server.
 */
function register_block_globalize_search() {
	register_block_type(
		'globalizewp/globalize-search',
		array(
			'attributes'      => array(
				'align'       => array(
					'type' => 'string',
					'enum' => array( 'left', 'center', 'right', 'wide', 'full' ),
				),
				'className'   => array(
					'type' => 'string',
				),
				'label'       => array(
					'type'    => 'string',
					'default' => __( 'Search For Plugin', 'globalizewp' ),
				),
				'placeholder' => array(
					'type'    => 'string',
					'default' => __( 'plugin-slug', 'globalizewp' ),
				),
				'buttonText'  => array(
					'type'    => 'string',
					'default' => __( 'Search', 'globalizewp' ),
				),
			),
			'render_callback' => 'render_block_globalize_search',
		)
	);
}
add_action( 'plugins_loaded', 'register_block_globalize_search' );
