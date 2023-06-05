FROM python:3.9-alpine AS base

# Create app directory
RUN mkdir -p /home/app

# Create app user
RUN addgroup -S app && adduser -S app -G app

# Create directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/static
RUN mkdir $APP_HOME/media
WORKDIR $APP_HOME

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install server packages
RUN apk update \
    && apk add postgresql-dev make automake gcc g++ subversion python3-dev musl-dev libffi-dev openssl-dev \
    && apk add jpeg-dev libwebp-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev libxml2-dev libxslt-dev libxml2 git openssh

# Install ImageMagick
RUN apk add --no-cache imagemagick && \
    apk add --no-cache imagemagick-dev

# Install Python packages
RUN pip install pip --upgrade
ADD requirements $APP_HOME/requirements
RUN pip install -r ./requirements/prod.txt

# Copy project
COPY . $APP_HOME

FROM base AS clean-scenarios
ENTRYPOINT ["python", "manage.py", "loop_clean_scenarios"]

FROM base AS wagtail
RUN pip install gunicorn

# Copy ssh files
COPY sshd_config /etc/ssh/

# Chown all files
RUN chown -R app:app $APP_HOME
RUN chmod -R +x $APP_HOME

# Start and enable SSH
RUN echo "root:Docker!" | chpasswd \
    && chmod +x ./docker-entrypoint.prod.sh \
    && cd /etc/ssh/ \
    && ssh-keygen -A

# Run entrypoint.prod.sh
ENTRYPOINT ["sh", "docker-entrypoint.prod.sh", "gunicorn"]