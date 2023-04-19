# Holon webapp

This repo contains the webapp part of the HOLON project. This includes the NextJS frontend and the Django/Wagtail backend. Other repos are:

1. [AnyLogic](https://github.com/ZEnMo/HOLON)
2. [ETM service](https://github.com/ZEnMo/HOLON-ETM)
3. [cloudclient](https://github.com/ZEnMo/HOLON-cloudclient) (legacy)

## Content

- [Holon webapp](#holon-webapp)
  - [Content](#content)
  - [Environments](#environments)
  - [First setup / Start the application](#first-setup--start-the-application)
  - [Start Dev Container](#start-dev-container)
  - [Configure stuff inside the container](#configure-stuff-inside-the-container)
  - [Admin](#admin)
  - [Integration testing environment (pizza)](#integration-testing-environment-pizza)
    - [Initial deploy](#initial-deploy)
    - [Refresh](#refresh)
    - [Update the snapshot](#update-the-snapshot)
  - [Deployment](#deployment)
  - [Datamodel](#datamodel)
    - [Development on datamodel](#development-on-datamodel)
- [Resetting database and building project](#resetting-database-and-building-project)

## Environments

We work using LTAP. Local runs on dev containers (see below). All TAP environments are automatically built containers that are hosted on Azure webapp instances. In addition, we have a bleeding edge Integration Testing (IT) environment.

## First setup / Start the application

First copy the .env.example to .env in the .devcontainer folder You don't have to change anything inside
the .env file:

```bash
cp .devcontainer/.env.example .devcontainer/.env
```

- note: If you decide to make some changes to the .env files, rebuild the devcontainer

```
Ctrl-Shift-P > Remote-Containers: Rebuild Container
```

Next do the same in the /src folder, except name it to .env.local instead of .env

## Start Dev Container

Visual Studio Code will detect that you are working in a Dev Container, click "Reopen in Container" to start the Dev container. After you reopen visual studio code in a devcontainer you are ready to start the backend and frontend, run the following commands in two seperate terminals:

```
cd frontend
npm run dev

cd src
python manage.py runserver
```

For the frontend Prettier and EsLint is used. Make sure you installed these extenstions in your VSCode. These extensions are automatically installed in the dev container:

```
Name: ESLint
Id: dbaeumer.vscode-eslint
Description: Integrates ESLint JavaScript into VS Code.
Publisher: Microsoft
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

---

Name: Prettier - Code formatter
Id: esbenp.prettier-vscode
Description: Code formatter using prettier
Publisher: Prettier
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

```

## Configure stuff inside the container

If you want for example do an Django migration, you can just run any command from the terminal in the correct folder, for example:

```
cd src
python manage.py makemigrations
```

## Admin

To see the data that is saved in the database, you can take a look in the admin.
To do so, you have to create a local superuseraccount:

```
cd src
python manage.py createsuperuser
```

After finishing all the steps, you can login on localhost:8000/admin

## Integration testing environment (pizza)

Runs on Hetzner cloud instance. Uses the acceptance static&media CDN.

### Initial deploy

1. Set DNS and certify domain

```bash
# ~/HOLON-webapp
sudo certbot certonly
# copy both privkey.pem and fullchain.pem
cp <cert-location> ./docker/files/certs
```

2. Copy environment variable files and set correct value

```bash
# ~/HOLON-webapp
```

Make sure the following env vars are set:

```bash
# To be set manually
SECRET_KEY
AZURE_STORAGE_KEY

# With default value (check if applicable)
ALLOWED_HOSTS=*
DOMAIN_HOST="https://pizzaoven.holontool.nl"
AZURE_ACCOUNT_NAME=holonstorage
CUSTOM_STATIC_LOCATION="static-acceptatie"
CUSTOM_MEDIA_LOCATION="media-acceptatie"
```

**make sure to set the CORS settings at the blob storage, otherwise errors will occur**

3. Make an export of the production database (or the one that you want to sync) and place that file as `prod.sql` in the `db` folder.
1. Use docker compose up to start the service

```bash
docker compose up
```

### Refresh

Checkout to the branch that you want to use. Stop the Python service, rebuild and restart the service

```bash
docker compose stop python
docker compose build python
docker compose up -d python
```

### Update the snapshot

1. Remove the database container (will remove all data!)

```bash
docker compose rm db
```

2. Place the new `dump.sql` as `prod.sql` in the `db` folder.
3. Restart using `docker compose up`

```bash
docker compose up
```

## Deployment

Deployment is automatically done with GitHub actions to the Azure portal, the following mapping between code and azure is done:

- frontend: Azure Static Web App named 'holon-nextjs-frontend'
- backend: Azure App Service named 'holon-backend'

For Github the following variables are configured:

- AZUREAPPSERVICE_PUBLISHPROFILE_C1BA75B35DEF43759E17CDB9F366E04C: The publish profile from the Azure App Service
- AZURE_STATIC_WEB_APPS_API_TOKEN_PURPLE_WATER_049BE5703: The API token from the Azure Static Web App
- NEXT_PUBLIC_BACKEND_URL: The url for the deployed backend on Azure App

In Azure the following variables are configured for the App Service:

- DBHOST: Azure PostgreSQL host name
- DBNAME: Database name
- DBPASS: Database password
- DBUSER: Database user name

## Datamodel

Refer to the datamodel readme: [datamodel.readme.md](src/holon/datamodel.readme.md)

### Development on datamodel

Use convenience `migrate_and_create_fixture.sh` before every commit to make sure that the fixtures or present datamodels survive the changes you are making to the datamodel.

# Resetting database and building project

When you first start the project, fixtures will be automatically loaded via the .devcontainer/docker-entrypoint.sh script.
To reset your database while developing, you can do the following steps:

- Make sure your backend server is not running
- Go to localhost:5000 and login with the credentials given in the .devcontainer/docker-compose.yml file or your own ./devcontainer/.env file. (credentials in ./devcontainer/.env are leading)
- Email Adress / Username: in .devcontainer/docker-compose.yml or ./devcontainer/.env file Look for PGADMIN_DEFAULT_EMAIL
- Password: in .devcontainer/docker-compose.yml or ./devcontainer/.env file look for PGADMIN_DEFAULT_PASSWORD

- After login open the Holontool server with the credentials given in the docker-compose file. Add for the hostname: db.
- Open your added server and delete the db holontool with right-click > delete.
- Add a new db by rightclicking and name it holontool
- Now you can do two things:

1. Rebuild the whole project OR...
2. execute the .devcontainer/docker-entrypoint.sh by executing the following commands: cd .devcontainer and second ./docker-entrypoint.sh
