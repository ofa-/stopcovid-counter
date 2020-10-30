function onload() {
	var csv = document.querySelector("noscript").textContent.trim()

	var data = parseCSV(csv)
	for (var i=1; i < data.length; i++) {
		data[i][1] = (data[i][1]/1000000).toFixed(2)
	}

	document.body.appendChild(createCounter(data))
	document.body.appendChild(createTable(data))
}

function createCounter(data) {
	var div = document.createElement("div")
	div.setAttribute("class", "counter")

	var curr = data[1]
	var last = data[lookupLast24hDataIndex(data)]

	div.innerHTML = (
		"<b class='users'>utilisateurs<br>+" + ((curr[1] - last[1])*1000).toFixed(0) + " k</b>" +
		"<b class='notif'>notifications<br>+" + (curr[2] - last[2]) + "</b>" +
		"<b class='decl'>déclarations<br>+" + (curr[3] - last[3]) + "</b>" +
		"<b class='cases'>contaminés<br>+" + (curr[4]/1000).toFixed(0) + " k</b>" +
		"")
	return div
}

function createTable(data) {
	var table = document.createElement("table")
	table.setAttribute("class", "log")

	for (var i=0; i < data.length; i++) {
		var tr = document.createElement("tr")
		for (var j=0; j < data[i].length; j++) {
			var td = document.createElement("td")
			td.innerHTML = data[i][j]
			tr.appendChild(td)
		}
		table.appendChild(tr)
	}
	return table
}

function lookupLast24hDataIndex(data) {
	var d = new Date(data[1][0])
	for (var i=2, di; i < data.length; i++) {
		di = new Date(data[i][0])
		if ( (d - di) > 24*60*60*1000 )
			return i - 1
	}
	return data.length - 1
}

// https://stackoverflow.com/a/14991797
function parseCSV(str) {
    var arr = [];
    var quote = false;  // 'true' means we're inside a quoted field

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        arr[row][col] += cc;
    }
    return arr;
}
