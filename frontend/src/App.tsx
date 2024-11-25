import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom"
import Register from "./components/Register"
import Login from "./components/Login"
import PostForm from "./components/PostForm"
import PostsList from "./components/PostsList"
import Header from "./components/Header"
import React, { useEffect, useState } from "react"
// import PrivateRoute from "./components/PrivateRoute"

interface User {
    id: number
    name: string
    email: string
}

interface UserContextType {
    user: User | null 
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

const App: React.FC = () => {
    const [user, setUser] = useState<{
        id: number
        name: string
        email: string
    } | null>(null)

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId")
        const storedUserName = localStorage.getItem("userName")
        const storedUserEmail = localStorage.getItem("userEmail")

        if (storedUserId && storedUserName && storedUserEmail) {
            setUser({
                id: parseInt(storedUserId),
                name: storedUserName,
                email: storedUserEmail,
            })
        }
    }, [])

    console.log(`APP.TSX's user: \n ${user}`)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Header />
                <Routes>
                    <Route
                        path='/'
                        element={<Navigate to={user ? "/posts" : "/login"} />}
                    />
                    {/* <PrivateRoute path='/posts' element={<PostsList />} /> */}
                    <Route path='/posts' element={<PostsList />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/posts/create' element={<PostForm />} />
                </Routes>
            </Router>
        </UserContext.Provider>
    )
}

export default App
