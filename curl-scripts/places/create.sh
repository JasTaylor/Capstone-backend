#!/bin/bash

API="http://localhost:4741"
URL_PATH="/places"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "place": {
      "title": "'"${TITLE}"'",
      "city": "'"${CITY}"'",
      "text": "'"${TEXT}"'",
      "country": "'"${COUNTRY}"'"
    }
  }'

echo
