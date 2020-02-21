/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

document.addEventListener( 'DOMContentLoaded', function() {

	const searchButton = document.querySelector( '.wp-block-globalizewp-globalize-search__button' );
	searchButton.addEventListener( 'click', numberOfStrings );

} );

let request = obj => {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open(obj.method || "GET", obj.url);
		if (obj.headers) {
			Object.keys(obj.headers).forEach(key => {
				xhr.setRequestHeader(key, obj.headers[key]);
			});
		}
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.response);
			} else {
				reject(xhr.statusText);
			}
		};
		xhr.onerror = () => reject(xhr.statusText);
		xhr.send(obj.body);
	});
};

function numberOfStrings() {

	let slug = document.querySelector( '.wp-block-globalizewp-globalize-search__input' );

	if ( ! slug.value ) {
		alert( __( 'No slug provided.', 'globalizewp' ) );
		return
	}

	const developmentUrl  = `https://cors-anywhere.herokuapp.com/https://translate.wordpress.org/projects/wp-plugins/${slug.value}/dev/en-au/default/export-translations/?format=json`;

	let readmeUrl = `https://cors-anywhere.herokuapp.com/https://translate.wordpress.org/projects/wp-plugins/${slug.value}/dev-readme/en-au/default/export-translations/?format=json`;

	request({url: developmentUrl})
	.then(data => {

		let strings    = JSON.parse(data);
		let numStrings = countObjectKeys( strings );
		let numWords   = 0;

		for (let key in strings) {

			numWords += countWords(key);

		}

		request({url: readmeUrl})
			.then(data => {

			let readmeStrings    = JSON.parse(data);
			let readmeNumStrings = countObjectKeys( readmeStrings );
			let readmeNumWords   = 0;

			for (let key in readmeStrings) {

				readmeNumWords += countWords(key);

			}

			let totalWords = ( numWords + readmeNumWords );
			let totalCost  = ( ( Math.ceil( totalWords / 500 ) * 10 * 20 ) * 2 );

			let responseDiv  = document.querySelector( '.wp-block-globalizewp-globalize-search__response' );
			let responseText = __(
				`Your plugin development trunk has ${numStrings} strings which contain a total of ${numWords} words. The readme trunk has ${readmeNumStrings} strings which contain a total of ${readmeNumWords} words. Based on a combined total of ${totalWords} words, the setup cost will be $${totalCost}.`
			, 'globalizewp' );

			responseDiv.innerHTML = responseText;

			})
			.catch(error => {
				console.log(error);
			});
})
.catch(error => {
	console.log(error);
});
}

function countObjectKeys( obj ) {

	return Object.keys( obj ).length;

}

function countWords(str) {

	str = str.replace(/(^\s*)|(\s*$)/gi,"");
	str = str.replace(/[ ]{2,}/gi," ");
	str = str.replace(/\n /,"\n");

	return str.split(' ').length;

}
