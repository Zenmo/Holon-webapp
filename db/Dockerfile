FROM postgres:12 as db
WORKDIR /app
COPY init.sh /docker-entrypoint-initdb.d
COPY prod.sql /scripts/db/dump.sql
