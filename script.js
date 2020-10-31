function onload() {
	var csv = document.querySelector("noscript").textContent.trim()

	var data = parseCSV(csv)
	for (var i=1; i < data.length; i++) {
		data[i][1] = (data[i][1]/1000000).toFixed(2)
	}

	var counter, table
	document.body.appendChild(counter = createCounter(data))
	document.body.appendChild(table = createTable(data))

	for (var i = lookupLast24hDataIndex(data); i > 0; i--) {
		table.children[i].setAttribute("class", "last24h")
	}
}

function createCounter(data) {
	var div = document.createElement("div")
	div.setAttribute("class", "counter")

	div.innerHTML = (
		"<b class='users'>utilisateurs<p></p></b>" +
		"<b class='notif'>notifications<p></p></b>" +
		"<b class='decl'>déclarations<p></p></b>" +
		"<b class='cases'>contaminés<p></p></b>"
		)
	div.data = data
	div.setValues = counterSetValues
	div.setValues()
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

function counterSetValues(index=1) {
	var data = this.data, counter = this
	var curr = data[index]
	var last = data[lookupLast24hDataIndex(data, index)]

	function set(child, value) {
		counter.children[child].lastChild.innerHTML = value
	}
	set(0, "+" + ((curr[1] - last[1])*1000).toFixed(0) + " k")
	set(1, "+" + (curr[2] - last[2]))
	set(2, "+" + (curr[3] - last[3]))
	set(3, "+" + (curr[4]/1000).toFixed(0) + " k")
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
