name="pizza"
docker build ./src -t $name:wagtail -f ./src/Dockerfile.prod
docker build ./frontend --build-arg NEXT_PUBLIC_WAGTAIL_API_URL=$NEXT_PUBLIC_WAGTAIL_API_URL -t $name:next -f ./frontend/Dockerfile.prod
docker build ./docker -t $name:web