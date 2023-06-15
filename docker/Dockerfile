FROM nginx:1.25.0-alpine3.17

COPY ./files/config/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY ./files/config/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY ./files/static/502.html 502.html
