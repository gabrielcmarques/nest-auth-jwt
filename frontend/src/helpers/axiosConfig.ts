import axios from "axios"

const apiClient = axios.create({
    baseURL: "http://localhost:3000", 
    // withCredentials: true, // for cookies or auth headers
})

// Intercept requests to add the token to headers
apiClient.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    },
)

// Add an interceptor to refresh tokens on 401 errors
apiClient.interceptors.response.use(
    response => response, // Pass successful responses through
    async error => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken")
            const userId = localStorage.getItem("userId")

            if (refreshToken && userId) {
                try {
                    const response = await apiClient.post(
                        "/auth/refresh-token",
                        {
                            refreshToken,
                            userId: parseInt(userId),
                        },
                    )

                    // Save the new Access Token
                    const { accessToken } = response.data
                    localStorage.setItem("accessToken", accessToken)

                    // Retry the failed request with the new access token
                    error.config.headers[
                        "Authorization"
                    ] = `Bearer ${accessToken}`
                    return apiClient.request(error.config)
                } catch (refreshError) {
                    console.error("Error refreshing token:", refreshError)
                    // Handle token refresh failure (e.g., force logout)
                    localStorage.clear()
                    window.location.href = "/login" // Redirect to login page
                }
            } else {
                console.error("No refresh token or user ID found.")
                // Handle case where refresh token or user ID is missing
                localStorage.clear()
                window.location.href = "/login" // Redirect to login page
            }
        }
        return Promise.reject(error)
    },
)

export default apiClient
