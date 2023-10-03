FROM python:3.9-alpine
LABEL version="v0.0.0"

ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=pipit.settings.local \
    ALLOWED_HOSTS=* \
    INTERNAL_IPS=0.0.0.0 \
    SECRET_KEY=generatesecretkeyhere \
    MEDIA_PATH=/app/media \
    STATIC_PATH=/app/static \
    DB_USER=postgres \
    DB_PASSWORD=postgres \
    DB_NAME=postgres \
    DB_HOST=db \
    PYTHONPATH="${PYTHONPATH}:/app"

WORKDIR /app
ADD . /app/

RUN apk update \
    && apk add netcat-openbsd gcc libpq-dev binutils vim curl gettext linux-headers musl-dev

RUN pip install --upgrade pip \
    && pip install -r requirements/prod.txt --no-cache-dir \
    && pip install ipython ipdb

EXPOSE 8000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
CMD ["runserver"]
