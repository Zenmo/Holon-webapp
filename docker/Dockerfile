FROM nginx:alpine

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./files/config/nginx.conf.template /etc/nginx/templates/default.conf.template

WORKDIR /app

COPY ./files/static/502.html 502.html