# Same version as on Azure
FROM postgres:13.9 as db
WORKDIR /app
COPY init.sh /docker-entrypoint-initdb.d
COPY prod.sql /scripts/db/dump.sql
