import React, { useState } from "react"
import "../style/Register.css"
import apiClient from "../helpers/axiosConfig"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await apiClient.post("/auth/register", formData)
            setSuccess(response.data.message)
            setError("")
            navigate("/login")
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong")
            setSuccess("")
        }
    }

    return (
        <div className='register-container'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='name'>Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type='submit'>Register</button>
            </form>
            {error && <p className='error'>{error}</p>}
            {success && <p className='success'>{success}</p>}
        </div>
    )
}

export default Register
