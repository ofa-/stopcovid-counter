all:

update:
	./fetch-keyfigures.sh

html:
	./update-index.sh

get-state:
	lftp -c "open $(TARGET); get data.csv"

push-state:
	lftp -c "open $(TARGET); put data.csv index.html"

init-target:
	lftp -c "open $(TARGET); put data.csv index.html style.css script.js"
