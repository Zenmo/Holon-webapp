
const configPerBranch = {
    main: {
        GITHUB_ENVIRONMENT: 'test',
        DB_NAME: 'holon-test',
        DB_USER: 'holon-test',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'swarm-test',
        NEXT_HOSTNAME: 'test.holons.energy',
        NEXT_REDIRECT_HOSTS: 'test.holontool.nl',
        WAGTAIL_HOSTNAME: 'cms-test.holons.energy',
        MEDIA_LOCATION: 'media-test',
        STATIC_LOCATION: 'static-test',
    },
    acceptance: {
        GITHUB_ENVIRONMENT: 'acceptance',
        DB_NAME: 'holon-acceptance',
        DB_USER: 'holon-acceptance',
        RETURN_SCENARIO: 'True',
        SENTRY_ENVIRONMENT: 'swarm-acceptance',
        NEXT_HOSTNAME: 'acceptatie.holons.energy',
        NEXT_REDIRECT_HOSTS: 'acceptatie.holontool.nl',
        WAGTAIL_HOSTNAME: 'cms-acceptatie.holons.energy',
        MEDIA_LOCATION: 'media-acceptatie',
        STATIC_LOCATION: 'static-acceptatie',
    },
    production: {
        GITHUB_ENVIRONMENT: 'production',
        DB_NAME: 'holon-production',
        DB_USER: 'holon-production',
        RETURN_SCENARIO: 'False',
        SENTRY_ENVIRONMENT: 'swarm-production',
        NEXT_HOSTNAME: 'holons.energy',
        NEXT_REDIRECT_HOSTS: 'holontool.nl, www.holontool.nl, www.holons.energy',
        WAGTAIL_HOSTNAME: 'cms.holons.energy',
        MEDIA_LOCATION: 'media',
        STATIC_LOCATION: 'static',
    },
}

module.exports = (branchName) => {
    if (!Object.keys(configPerBranch).includes(branchName)) {
        throw Error(`No config for branch ${branchName}`)
    }

    return configPerBranch[branchName]
}
