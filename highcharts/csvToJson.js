_.mixin({

	// This will parse a delimited string into an array of
	// arrays. The default delimiter is the comma, but this
	// can be overriden in the second argument.
	CSVtoJSON: function( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// FIX: add an ending carriage return if missing
		if( strData.substr(-1) !== "\n" ) strData += "\n";

		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
			);


		// Create an array to hold our data.
		var jsonData = [];

		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		var keys = [];
		var row = [];

		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){

			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			var newRow = strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter);

			if ( newRow ){
				// first row is the keys
				if(!keys.length){
					keys = row;
				} else {
					// Since we have reached a new row of data,
					// add an empty row to our data array.
					// combine row with keys
					var data = {};
					for( var i in row){
						data[ keys[i] ] = row[i];
					}
					jsonData.push( data );
				}
				// eighter way reset the row
				row = [];
			}


			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
					);

			} else {

				// We found a non-quoted value.
				var strMatchedValue = arrMatches[ 3 ];

			}

			// Now that we have our value string, let's add
			// it to the data array.
			row.push( strMatchedValue );
		}

		// Return the parsed data.
		return( jsonData );
	}

});
