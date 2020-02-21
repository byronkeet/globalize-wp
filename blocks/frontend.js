/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

document.addEventListener( 'DOMContentLoaded', function() {

	const searchButton = document.querySelector( '.wp-block-globalizewp-globalize-search__button' );
	searchButton.addEventListener( 'click', numberOfStrings );

} );

function numberOfStrings() {

	let slug = document.querySelector( '.wp-block-globalizewp-globalize-search__input' );

	if ( ! slug.value ) {
		alert( __( 'No slug provided.', 'globalizewp' ) );
		return
	}

	let url  = `https://cors-anywhere.herokuapp.com/https://translate.wordpress.org/projects/wp-plugins/${slug.value}/dev/en-au/default/export-translations/?format=json`;

	let xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {

	if ( 4 == this.readyState  && 200 == this.status ) {

		let strings      = JSON.parse( this.responseText );
		let numStrings   = countObjectKeys( strings );
		let numWords     = ( numStrings * 5 );
		let responseDiv  = document.querySelector( '.wp-block-globalizewp-globalize-search__response' );
		let responseText = __( `Your plugin development trunk has ${numStrings} string. Based on an avarage of 5 words per strings, the estimated number of words is ${numWords}.`, 'globalizewp' );

		return responseDiv.innerHTML = responseText;

		}
	};

	xmlhttp.open( 'GET', url, true );
	xmlhttp.send();
}

function countObjectKeys( obj ) {

	return Object.keys( obj ).length;

}
