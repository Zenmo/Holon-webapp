#!/bin/bash
set -e

## This script removes all manifests from the Azure container registry which have no tag.
## Manifests like this accumulate because we reuse tags like "main" and "production".
## It's recommended to run this after a period of active development to reduce storage costs.

REGISTRY="holonregistry"
DOMAIN="${REGISTRY}.azurecr.io"
REPOSITORIES="nextjs nginx wagtail"

for REPOSITORY in $REPOSITORIES
do
    echo "Cleaning $DOMAIN/$REPOSITORY"
    az acr manifest list-metadata $DOMAIN/$REPOSITORY --orderby time_asc --query "[?tags[0]==null].digest" --output tsv \
    | while read -r DIGEST ; do
        IMAGE=$REPOSITORY@$DIGEST
        echo "Deleting $DOMAIN/$IMAGE"
        az acr repository delete --name $REGISTRY --image $IMAGE --yes
    done
done
