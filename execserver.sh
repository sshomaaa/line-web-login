#!/usr/bin/env bash
cd $(dirname $0)

docker run --rm \
    -it \
	--user "$(id -u):$(id -g)" \
	-v "$(pwd):/src" \
    -e "LINE_LOGIN_CHANNEL_ID=${LINE_LOGIN_CHANNEL_ID}" \
    -e "LINE_LOGIN_REDIRECT_URI=${LINE_LOGIN_REDIRECT_URI}" \
    -p "9000:9000" \
	--workdir /src \
	--entrypoint bash \
    node:18.17.1-bookworm \
    -c "npm install && npm run start"
