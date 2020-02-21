/**
 * Block dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	RichText,
	BlockControls,
	BlockAlignmentToolbar,
}  = wp.editor;


export default registerBlockType(
	'globalizewp/globalize-search',
	{
		title: __( 'Globalize Search', 'globalizewp' ),
		description: __( 'Look up plugin slug.', 'globalizewp' ),
		icon: {
			src: 'admin-site-alt2',
		},
		category: 'common',
		keywords: [
			__( 'slug', 'globalizewp' ),
			__( 'find', 'globalizewp' ),
		],
		attributes: {
			label: {
				type: 'string',
				default: __( 'Search For Plugin', 'globalizewp' ),
			},
			placeholder: {
				type: 'string',
				default: __( 'plugin-slug', 'globalizewp' ),
			},
			buttonText: {
				type: 'string',
				default: __( 'Search', 'globalizewp' ),
			},
			blockAlignment: {
				type: 'string',
				default: 'wide',
			},
		},
		getEditWrapperProps( { blockAlignment } ) {
			if ( 'left' === blockAlignment || 'right' === blockAlignment || 'full' === blockAlignment ) {
				return { 'data-align': blockAlignment };
			}
		},
		edit: props => {
			const {
				attributes: { label, placeholder, buttonText, blockAlignment }, className, setAttributes } = props;

			return (
				<div className={ className }>
					<BlockControls>
						<BlockAlignmentToolbar
							value={ blockAlignment }
							onChange={ blockAlignment => setAttributes( { blockAlignment } ) }
						/>
					</BlockControls>
					<RichText
						className="wp-block-globalizewp-globalize-search__label"
						aria-label={ __( 'Label text' ) }
						placeholder={ __( 'Add label…' ) }
						withoutInteractiveFormatting
						value={ label }
						onChange={ ( html ) => setAttributes( { label: html } ) }
					/>
					<input
						className="wp-block-globalizewp-globalize-search__input"
						aria-label={ __( 'Optional placeholder text' ) }
						// We hide the placeholder field's placeholder when there is a value. This
						// stops screen readers from reading the placeholder field's placeholder
						// which is confusing.
						placeholder={ placeholder ? undefined : __( 'Optional placeholder…' ) }
						value={ placeholder }
						onChange={ ( event ) => setAttributes( { placeholder: event.target.value } ) }
					/>
					<RichText
						className="wp-block-globalizewp-globalize-search__button"
						aria-label={ __( 'Button text' ) }
						placeholder={ __( 'Add button text…' ) }
						withoutInteractiveFormatting
						value={ buttonText }
						onChange={ ( html ) => setAttributes( { buttonText: html } ) }
					/>
				</div>
			);
		},
		save() {
			// Rendering in PHP
			return null;
		},
	}
);
