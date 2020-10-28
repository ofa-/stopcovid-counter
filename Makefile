all:

update:
	./fetch-keyfigures.sh

html: index.html = index.html
html:
	sed -i "/^date,/ d; /^....-../ d" $(index.html)
	sed -i "/<noscript>/ r data.csv" $(index.html)
	sed -i "/^date, / s:,:, \t\t\t:" $(index.html)
	sed -i "/^....-../ s:,:,\t:g" $(index.html)

get-state:
	lftp -c "open $(TARGET); get data.csv"

push-state:
	lftp -c "open $(TARGET); put data.csv index.html"

init-target:
	lftp -c "open $(TARGET); put data.csv index.html style.css script.js"
