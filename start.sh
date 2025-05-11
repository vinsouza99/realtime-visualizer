#!/bin/bash
# start.sh
node server.js &

npx serve -s ../realtime-visualizer/dist -l 5173

wait

