
const configPerBranch = {
    main: {
        DB_NAME: 'holon-wagtail-v2-test',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'azure-test',
        NEXT_HOSTNAME: 'test.holontool.nl',
        DOMAIN_HOST: 'https://test.holontool.nl',
        DJANGO_SETTINGS_MODULE: 'pipit.settings.test',
        WAGTAIL_HOSTNAME: 'cms-test.holontool.nl',
    },
    acceptance: {
        DB_NAME: 'holon-wagtail-v2-acceptatie',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'azure-acceptance',
        NEXT_HOSTNAME: 'acceptatie.holontool.nl',
        DOMAIN_HOST: 'https://acceptatie.holontool.nl',
        DJANGO_SETTINGS_MODULE: 'pipit.settings.prod',
        WAGTAIL_HOSTNAME: 'cms-acceptatie.holontool.nl',
    },
    production: {
        DB_NAME: 'holon-wagtail-v2',
        RETURN_SCENARIO: 'False',
        SENTRY_ENVIRONMENT: 'azure-production',
        NEXT_HOSTNAME: 'holontool.nl',
        DOMAIN_HOST: 'https://holontool.nl',
        DJANGO_SETTINGS_MODULE: 'pipit.settings.prod',
        WAGTAIL_HOSTNAME: 'cms.holontool.nl',
    },
}

configPerBranch['container-apps'] = configPerBranch['main']

module.exports = (branchName) => {
    if (!Object.keys(configPerBranch).includes(branchName)) {
        throw Error(`No config for branch ${branchName}`)
    }

    return configPerBranch[branchName]
}
