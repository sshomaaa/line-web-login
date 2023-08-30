#!/usr/bin/env bash
cd $(dirname $0)

docker build --file=- --tag=line-web-login:latest . <<EOF
FROM node:18.17.1-bookworm
RUN groupadd -g $(id -g) user && useradd -m -s /bin/bash -u $(id -u) -g $(id -g) user; exit 0
USER $(id -u)
WORKDIR /src
RUN git clone https://github.com/sshomaaa/line-web-login.git app
WORKDIR /src/app
ENTRYPOINT [ "bash" ]
CMD [ "-c", "npm install && npm run start" ]
EOF

docker run --rm \
    -it \
	--user "$(id -u):$(id -g)" \
	-v "$(pwd):/src" \
    -e "LINE_LOGIN_CHANNEL_ID=${LINE_LOGIN_CHANNEL_ID}" \
    -e "LINE_LOGIN_REDIRECT_URI=${LINE_LOGIN_REDIRECT_URI}" \
    -p "9000:9000" \
	line-web-login:latest
