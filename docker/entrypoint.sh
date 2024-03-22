#!/bin/sh

sed -i "s,\$CCP_API_URL,$CCP_API_URL,g" /usr/share/nginx/html/env.js

nginx -g 'daemon off;'
