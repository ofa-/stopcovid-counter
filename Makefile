all:

update:
	./fetch-keyfigures.sh

html:
	./update-index.sh

get-state: $(addprefix get_, data.csv)

push-state: $(addprefix put_, data.csv index.html)

init-target: $(addprefix put_, data.csv index.html style.css script.js)


put_%:;	$(TARGET)/$* -T - < $*
get_%:;	$(TARGET)/$*      > $*
