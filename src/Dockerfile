FROM python:3.8-slim
LABEL version="v0.0.0"

ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=pipit.settings.local \
    ALLOWED_HOSTS=* \
    INTERNAL_IPS=0.0.0.0 \
    SECRET_KEY=generatesecretkeyhere \
    MEDIA_PATH=/app/media \
    STATIC_PATH=/app/static \
    REQUIREMENTS=local.txt \
    DB_USER=postgres \
    DB_PASSWORD=postgres \
    DB_NAME=postgres \
    DB_HOST=db \
    PYTHONPATH="${PYTHONPATH}:/app"

WORKDIR /app
ADD . /app/

RUN apt-get update \
    && apt-get install -y netcat gcc libpq-dev \
    && apt-get install -y binutils libproj-dev gdal-bin \
    && apt-get install -y vim curl gettext \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip \
    && pip install -r requirements/$REQUIREMENTS --no-cache-dir \
    && pip install ipython ipdb

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["runserver"]
