# Holon webapp

This repo contains the webapp part of the HOLON project. This includes the NextJS frontend and the Django/Wagtail backend. This repo and other repos are licensed under the [MIT license](LICENSE.md). Other repos are:

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
  - [Deployment](#deployment)
  - [Datamodel](#datamodel)
    - [Development on datamodel](#development-on-datamodel)
    - [Datamodel scenario feedback in any environment](#datamodel-scenario-feedback-in-any-environment)
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

## Datamodel

Refer to the datamodel readme: [datamodel.readme.md](src/holon/datamodel.readme.md)

### Development on datamodel

Use convenience `migrate_and_create_fixture.sh` before every commit to make sure that the fixtures or present datamodels survive the changes you are making to the datamodel.

### Datamodel scenario feedback in any environment

A feature to help debug AnyLogic model results. This setting is used in the `/wt/api/nextjs/v2/holon/` endpoint to determine whether to send back the used scenario (through the serializer) or not. This should ideally not be set to true in production since it will impact performance.

```conf
RETURN_SCENARIO=True
```

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

### Create all the redentions from the original images

```
python manage.py wagtail_update_image_renditions
```
