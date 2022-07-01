# Holon web application prototype

Prototype of the Holon web application

## First setup / Start the application

```
docker-compose up -d
```

Everything should be build automatically.
After everything is done, the envoriments are available at:

```
frontend: localhost:3000
backend: localhost:8000
```

For the frontend Prettier and EsLint is used. Make sure you installed there extenstions in your VSCode.

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

If you want for example do an Django migration, you have to that inside of the container

docker-compose exec [container_name] [command]

```
docker-compose exec backend python manage.py migrate
```
