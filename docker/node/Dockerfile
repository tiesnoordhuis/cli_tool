FROM node:latest

ENV NPM_CONFIG_LOGLEVEL debug
ENV PORT 3000
ENV APP_ROOT /home/node/app

EXPOSE 3000

COPY entry.sh /usr/local/bin/entry.sh
RUN chmod +x /usr/local/bin/entry.sh

COPY setup-app.mjs /usr/local/bin/setup-app.mjs
RUN chmod +x /usr/local/bin/setup-app.mjs

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
# ENTRYPOINT ["/usr/local/bin/entry.sh"]