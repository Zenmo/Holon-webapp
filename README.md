# Holon-wagtail

# Holon web application prototype

Prototype of the Holon web application

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
