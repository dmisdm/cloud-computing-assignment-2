#!/bin/bash

rsync -rltvh --progress --exclude 'node_modules'  --exclude 'web/.next' . assignment2:~/app

ssh assignment2 "cd app && sudo docker-compose build && sudo docker-compose up -d"
