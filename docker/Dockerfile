FROM nginx:alpine

COPY ./files/config/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY ./files/config/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY ./files/static/502.html 502.html