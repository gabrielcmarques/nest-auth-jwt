import { useState, FormEvent, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "../helpers/axiosConfig"

interface LoginState {
    email: string
    password: string
    errorMessage: string
}

const Login: React.FC = () => {
    const [formState, setFormState] = useState<LoginState>({
        email: "",
        password: "",
        errorMessage: "",
    })
    const navigate = useNavigate()

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
            navigate("/posts")
        }
    }, [navigate])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof LoginState,
    ) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: e.target.value,
        }))
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        const { email, password } = formState

        try {
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            })

            const { accessToken, refreshToken } = response.data

            console.log(`RESPONSE.DATA LOGIN: `, response.data)

            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)

            navigate("/posts")
        } catch (error: any) {
            setFormState(prevState => ({
                ...prevState,
                errorMessage:
                    error.response?.status === 401
                        ? "Invalid credentials. Please try again."
                        : "Something went wrong. Please try again later.",
            }))
            console.error("Error logging in:", error)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email: </label>
                    <input
                        id='email'
                        type='email'
                        value={formState.email}
                        onChange={e => handleChange(e, "email")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Senha: </label>
                    <input
                        id='password'
                        type='password'
                        value={formState.password}
                        onChange={e => handleChange(e, "password")}
                        required
                    />
                </div>
                <button type='submit'>Login</button>
            </form>
            {formState.errorMessage && (
                <p style={{ color: "red" }}>{formState.errorMessage}</p>
            )}
        </div>
    )
}

export default Login
