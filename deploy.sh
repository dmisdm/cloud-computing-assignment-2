#!/bin/bash

rsync -rltvh --progress --exclude 'node_modules'  --exclude 'web/.next' . assignment2:~/app

ssh assignment2 docker build -t app_server ./app && docker rm -f app_server && docker run -d --name app_server -p 80:80 app_server
