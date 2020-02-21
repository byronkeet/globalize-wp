/**
 * Internal block libraries
 */
const { __ }        = wp.i18n;
const { Component } = wp.element;
const {	RichText }  = wp.editor;

export default function SearchEdit( { className, attributes, setAttributes } ) {
	const { label, placeholder, buttonText } = attributes;

	return (
		<div className={ className }>
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
}
