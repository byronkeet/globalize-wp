/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

document.addEventListener( 'DOMContentLoaded', function() {

	const searchButton = document.querySelector( '.wp-block-globalizewp-globalize-search__button' );
	searchButton.addEventListener( 'click', numberOfStrings );

} );

let request = obj => {
	return new Promise( ( resolve, reject ) => {
		let xhr = new XMLHttpRequest();
		xhr.open( obj.method || "GET", obj.url );
		if ( obj.headers ) {
			Object.keys( obj.headers ).forEach( key => {
				xhr.setRequestHeader( key, obj.headers[key] );
			});
		}
		xhr.onload = () => {
			if ( xhr.status >= 200 && xhr.status < 300 ) {
				resolve( xhr.response );
			} else {
				reject( xhr.statusText );
			}
		};
		xhr.onerror = () => reject( xhr.statusText );
		xhr.send( obj.body );
	});
};

function numberOfStrings() {

	let slug = document.querySelector( '.wp-block-globalizewp-globalize-search__input' );

	if ( ! slug.value ) {
		alert( __( 'No slug provided.', 'globalizewp' ) );
		return
	}

	const developmentUrl  = `https://cors-anywhere.herokuapp.com/https://translate.wordpress.org/projects/wp-plugins/${slug.value}/dev/en-au/default/export-translations/?format=json`;

	let readmeUrl = `https://cors-anywhere.herokuapp.com/https://wordpress.org/plugins/${slug.value}/#description/`;

	request({url: developmentUrl})
	.then(data => {

		let strings    = JSON.parse( data );
		let numStrings = countObjectKeys( strings );
		let numWords   = 0;

		for ( let key in strings ) {

			numWords += countWords( key );

		}

		JSONToCSVConvertor( strings, slug.value );

		request( {url: readmeUrl} )
			.then( data => {

			var parser         = new DOMParser ();
			var doc            = parser.parseFromString ( data, "text/html" );
			var readmeNumWords = doc.querySelector( '#tab-description' ).innerText.split(' ').length;

			let totalWords = ( numWords + readmeNumWords );
			let totalCost  = ( ( Math.ceil( totalWords / 500 ) * 10 * 20 ) * 2 );

			let responseDiv  = document.querySelector( '.wp-block-globalizewp-globalize-search__response' );
			let responseText = __(
				`Your plugin development trunk has ${numStrings} strings which contain a total of ${numWords} words. The readme details page contains a total of ${readmeNumWords} words. Based on a combined total of ${totalWords} words, the setup cost will be $${totalCost}.`
			, 'globalizewp' );

			responseDiv.innerHTML = responseText;

			})
			.catch( error => {
				console.log( error );
			});
})
.catch( error => {
	console.log( error );
});
}

function countObjectKeys( obj ) {

	return Object.keys( obj ).length;

}

function countWords( str ) {

	str = str.replace( /(^\s*)|(\s*$)/gi,"" );
	str = str.replace( /[ ]{2,}/gi," " );
	str = str.replace( /\n /,"\n" );

	return str.split(' ').length;

}

function JSONToCSVConvertor( JSONData, ReportTitle ) {
	//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	var arrData = typeof JSONData != 'object' ? JSON.parse( JSONData ) : JSONData;

	arrData = Object.keys( arrData );

	var CSV = '';

	//1st loop is to extract each row
	for ( var i = 0; i < arrData.length; i++ ) {
		var row = "";

		row += '"' + arrData[i] + '",';

		row.slice( 0, row.length - 1 );

		//add a line break after each row
		CSV += row + '\r\n';
	}
	console.log(CSV);

	if ( CSV == '' ) {
		alert( "Invalid data" );
		return;
	}

	//Generate a file name
	var fileName = "dev-trunk-";
	//this will remove the blank-spaces from the title and replace it with an underscore
	fileName += ReportTitle.replace(/ /g,"_");

	//Initialize file format you want csv or xls
	var uri = 'data:text/csv;charset=utf-8,' + encodeURI(CSV);

	// Now the little tricky part.
	// you can use either>> window.open(uri);
	// but this will not work in some browsers
	// or you will not get the correct file extension

	//this trick will generate a temp <a /> tag
	var link = document.createElement( "a" );
	link.href = uri;

	//set the visibility hidden so it will not effect on your web-layout
	link.style = "visibility:hidden";
	link.download = fileName + ".csv";

	//this part will append the anchor tag and remove it after automatic click
	document.body.appendChild( link );
	link.click();
	document.body.removeChild( link );
}
