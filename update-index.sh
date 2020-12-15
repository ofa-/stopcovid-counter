#!/bin/bash

sed -i "
	/^date,/	d
	/^....-../	d
	/<noscript>/	r data.csv
" index.html

sed -i "
	/^date,/	s:,:,\t\t\t:
	/^....-../	s:,:,\t:g
" index.html
