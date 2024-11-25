import React from "react"
import { useNavigate } from "react-router-dom"

const Header: React.FC = () => {
    const navigate = useNavigate()

    // Get user info from localStorage
    const userName = localStorage.getItem("userName")
    const userEmail = localStorage.getItem("userEmail")

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("userName")
        localStorage.removeItem("userEmail")
        navigate("/login")
    }

    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
            }}
        >
            <div>
                <h1>
                    Projeto Autenticação / Autorização com NestJS - Gabriel de
                    Christo Marques
                </h1>
            </div>
            <div>
                {userName && userEmail ? (
                    <div style={{ textAlign: "right" }}>
                        <p>
                            Bem-vindo, <strong>{userName}</strong>
                        </p>
                        <small>{userEmail}</small>
                        <br />
                        <button
                            onClick={handleLogout}
                            style={{ marginTop: "0.5rem" }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => navigate("/login")}>Login</button>
                )}
            </div>
        </header>
    )
}

export default Header
