const ACCESS_TOKEN_KEY = "accessToken_holontool"
const REFRESH_TOKEN_KEY = "refreshToken_holontool"
import * as Cookies from "es-cookie"

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || ""

const TokenService = {
    setCSRFToken() {
        if (!Cookies.get("csrftoken")) {
            fetch(`${API_URL}/wt/csrf`, {
                method: "GET",
            })
                .then(response => response.json())
                .then(json => Cookies.set("csrftoken", json.token))
        }
    },

    getAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    },

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    setAccessToken(accessToken: string) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    },

    setRefreshToken(refreshToken: string) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    },

    removeAccessToken() {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
    },

    removeRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    },

    removeAllTokens() {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    },

    hasAccessToken() {
        return !!this.getAccessToken()
    },

    hasRefreshToken() {
        return !!this.getRefreshToken()
    },

    hasTokens() {
        return !!this.getAccessToken() && !!this.getRefreshToken()
    },
}

export default TokenService
