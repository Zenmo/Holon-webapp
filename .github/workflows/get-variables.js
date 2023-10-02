
const configPerBranch = {
    main: {
        DB_NAME: 'holon-wagtail-v2-test',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'azure-test',
        NEXT_HOSTNAME: 'test.holontool.nl',
        DOMAIN_HOST: 'https://test.holontool.nl',
        DJANGO_SETTINGS_MODULE: 'pipit.settings.prod',
        WAGTAIL_HOSTNAME: 'cms-test.holontool.nl',
        MEDIA_LOCATION: 'media-test',
        STATIC_LOCATION: 'static-test',
        wagtail: {
            CPU: '0.25',
            MEMORY: '0.5',
            N_WORKERS: '4',
        }
    },
    acceptance: {
        DB_NAME: 'holon-wagtail-v2-acceptatie',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'azure-acceptance',
        NEXT_HOSTNAME: 'acceptatie.holontool.nl',
        DOMAIN_HOST: 'https://acceptatie.holontool.nl',
        DJANGO_SETTINGS_MODULE: 'pipit.settings.prod',
        WAGTAIL_HOSTNAME: 'cms-acceptatie.holontool.nl',
        MEDIA_LOCATION: 'media', // TODO: change to media-acceptatie
        STATIC_LOCATION: 'static', // TODO: change to static-acceptatie
        wagtail: {
            CPU: '0.25',
            MEMORY: '0.5',
            N_WORKERS: '4',
        }
    },
    production: {
        DB_NAME: 'holon-wagtail-v2',
        RETURN_SCENARIO: 'False',
        SENTRY_ENVIRONMENT: 'azure-production',
        NEXT_HOSTNAME: 'holontool.nl',
        DOMAIN_HOST: 'https://holontool.nl',
        DJANGO_SETTINGS_MODULE: 'pipit.settings.prod',
        WAGTAIL_HOSTNAME: 'cms.holontool.nl',
        MEDIA_LOCATION: 'media',
        STATIC_LOCATION: 'static',
        // It seems we only need to scale Wagtail but not Next.js
        wagtail: {
            CPU: '0.5',
            MEMORY: '1',
            N_WORKERS: '8',
        }
    },
}

module.exports = (branchName) => {
    if (!Object.keys(configPerBranch).includes(branchName)) {
        throw Error(`No config for branch ${branchName}`)
    }

    return configPerBranch[branchName]
}
