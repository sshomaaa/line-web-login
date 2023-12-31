#!/usr/bin/env bash
cd $(dirname $0)

docker build --no-cache --file=- --tag=line-web-login:latest . <<EOF
FROM node:18.17.1-bookworm
RUN git clone https://github.com/sshomaaa/line-web-login.git src
WORKDIR /src
ENTRYPOINT [ "bash" ]
CMD [ "-c", "npm install && npm run start" ]
EOF

docker run --rm \
    -it \
    -e "LINE_LOGIN_CHANNEL_ID=${LINE_LOGIN_CHANNEL_ID}" \
    -e "LINE_LOGIN_REDIRECT_URI=${LINE_LOGIN_REDIRECT_URI}" \
    -e "LINE_LOGIN_STATE=${LINE_LOGIN_STATE}" \
    -e "NODE_ENV=${NODE_ENV:-development}" \
    -p "9000:9000" \
	line-web-login:latest
