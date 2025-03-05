import querystring from "querystring"
import { keysToCamelFromSnake, keysToSnakeFromCamel } from "../utils/caseconverters"

const WAGTAIL_API_URL = process.env.WAGTAIL_API_URL

const NEXT_PUBLIC_API_URL = process.env.WAGTAIL_API_URL || "/wt/api/nextjs" // Use environment variable for browser requests if it exists and the domain root if this variable is empty on production

export async function getPage(path: string, params, options) {
    if (path.includes("v1/page_by_path")) {
        throw new Error(
            `Aborting possibly recursive request for ${path} with params ${JSON.stringify(params)}`,
        )
    }

    params = params || {}
    params = {
        htmlPath: path,
        ...params,
    }

    return await getRequest(`${WAGTAIL_API_URL}/v1/page_by_path/`, params, options)
}

export async function getPasswordProtectedPage(restrictionId, pageId, params, options) {
    params = params || {}
    return await postRequest(
        `${NEXT_PUBLIC_API_URL}/v1/password_protected_page/${restrictionId}/${pageId}/`,
        params,
        options,
    )
}

export async function getAllPages(params, options, source = "page_relative_urls") {
    return await getRequest(`${WAGTAIL_API_URL}/v1/${source}/`, params, options)
}

export async function getPagePreview(contentType, token, params, options) {
    params = params || {}
    params = {
        contentType,
        token,
        ...params,
    }

    return await getRequest(`${WAGTAIL_API_URL}/v1/page_preview/`, params, options)
}

export async function getPublicViewData(slug, params?, options?) {
    return await getRequest(
        `${NEXT_PUBLIC_API_URL}/v1/external_view_data/${slug}/`,
        params,
        options,
    )
}

export async function getViewData(slug, params, options) {
    return await getRequest(`${WAGTAIL_API_URL}/v1/external_view_data/${slug}/`, params, options)
}

export async function getRedirect(path, params, options) {
    params = params || {}
    params = {
        htmlPath: path,
        ...params,
    }

    return await getRequest(`${WAGTAIL_API_URL}/v1/redirect_by_path/`, params, options)
}

export async function getRequest(url, params?, options?) {
    params = params || {}
    params = keysToSnakeFromCamel(params)

    let headers = options?.headers || {}
    headers = {
        "Content-Type": "application/json",
        ...headers,
    }
    const queryString = querystring.stringify(params)
    const fullUrl = `${url}?${queryString}`
    console.log(`- OUTGOING GET ${fullUrl}`)
    const res = await fetch(fullUrl, { headers })

    if (res.status < 200 || res.status >= 300) {
        const error = new WagtailApiResponseError(res, url, params)
        error.response = res
        throw error
    }

    const json = await res.json()
    return {
        headers: res.headers,
        json: keysToCamelFromSnake(json),
    }
}

export async function postRequest(
    url: string,
    bodyJson: object,
    options?: RequestInit,
    queryParams: URLSearchParams = new URLSearchParams(),
) {
    bodyJson = bodyJson || {}
    bodyJson = keysToSnakeFromCamel(bodyJson)

    let headers = options?.headers || {}
    headers = {
        "Content-Type": "application/json",
        ...headers,
    }
    url = queryParams.size > 0 ? `${url}?${queryParams.toString()}` : url
    console.log(`- OUTGOING POST ${url}`)
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(bodyJson),
        credentials: "include",
        headers,
    })

    if (res.status < 200 || res.status >= 300) {
        let responseBody = null
        try {
            responseBody = await res.json()
        } catch (e) {}
        const error = new WagtailApiResponseError(res, url, bodyJson, responseBody)
        error.response = res
        throw error
    }

    const json = await res.json()
    return {
        headers: res.headers,
        json: keysToCamelFromSnake(json),
    }
}

export class WagtailApiResponseError extends Error {
    public name: any

    constructor(res, url, params, responseBody = null) {
        super(
            `${res.statusText}. Url: ${url}. Params: ${JSON.stringify(params)}, Response: ${JSON.stringify(responseBody)}`,
        )
        this.name = "WagtailApiResponseError"
    }
}
