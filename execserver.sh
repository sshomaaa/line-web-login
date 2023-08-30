#!/usr/bin/env bash
cd $(dirname $0)

docker build --file=- --tag=line-web-login:latest . <<EOF
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
    -p "9000:9000" \
	line-web-login:latest
