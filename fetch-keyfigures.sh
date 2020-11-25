#!/bin/bash

DATA_URL=https://app.stopcovid.gouv.fr/infos/key-figures.json
DATA_CSV=data.csv

HEADER="date,registered,notified,declared,new_cases"
FIELDS=".registered, .notification, .qrcodes, .nombrecas"

DATE=$(date +'%F %H:%M')

[ -f $DATA_CSV ] || cat > $DATA_CSV <<< "$HEADER"

data=$(wget -q --timeout=30 -O - $DATA_URL \
| sed 's:labelKey:Key:g; s:valueGlobal:Value:g; s:keyfigure.::g' \
| jq ". | from_entries | [ $FIELDS ] | @csv" \
| tr -d \"
)

[ "$data" ] || { echo "no data"; exit 1; }

sed -i "1 a\\
$DATE,$data" $DATA_CSV

sed -n 2p $DATA_CSV | tr , "\t"
