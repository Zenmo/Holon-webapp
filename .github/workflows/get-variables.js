
const configPerBranch = {
    main: {
        DB_NAME: 'holon-wagtail-v2-test',
        DB_USER: 'holon_wagtail_test',
        DB_PASSWORD_KEY: 'DB_PASSWORD_TEST',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'azure-test',
        NEXT_HOSTNAME: 'test.holontool.nl',
        DOMAIN_HOST: 'https://test.holontool.nl',
        WAGTAIL_HOSTNAME: 'cms-test.holontool.nl',
        MEDIA_LOCATION: 'media-test',
        STATIC_LOCATION: 'static-test',
        wagtail: {
            CPU: '0.25',
            MEMORY: '0.5',
            N_WORKERS: '2',
        }
    },
    acceptance: {
        DB_NAME: 'holon-wagtail-v2-acceptatie',
        DB_USER: 'holon_wagtail_acceptance',
        DB_PASSWORD_KEY: 'DB_PASSWORD_ACCEPTANCE',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'azure-acceptance',
        NEXT_HOSTNAME: 'acceptatie.holontool.nl',
        DOMAIN_HOST: 'https://acceptatie.holontool.nl',
        WAGTAIL_HOSTNAME: 'cms-acceptatie.holontool.nl',
        MEDIA_LOCATION: 'media-acceptatie',
        STATIC_LOCATION: 'static-acceptatie',
        wagtail: {
            CPU: '0.5',
            MEMORY: '1',
            N_WORKERS: '4',
        }
    },
    production: {
        DB_NAME: 'holon-wagtail-v2',
        DB_USER: 'holon_wagtail_prod',
        DB_PASSWORD_KEY: 'DB_PASSWORD_PROD',
        RETURN_SCENARIO: 'False',
        SENTRY_ENVIRONMENT: 'azure-production',
        NEXT_HOSTNAME: 'holontool.nl',
        DOMAIN_HOST: 'https://holontool.nl',
        WAGTAIL_HOSTNAME: 'cms.holontool.nl',
        MEDIA_LOCATION: 'media',
        STATIC_LOCATION: 'static',
        // It seems we only need to scale Wagtail but not Next.js
        wagtail: {
            CPU: '0.5',
            MEMORY: '1',
            N_WORKERS: '4',
        }
    },
}

module.exports = (branchName) => {
    if (!Object.keys(configPerBranch).includes(branchName)) {
        throw Error(`No config for branch ${branchName}`)
    }

    return configPerBranch[branchName]
}
