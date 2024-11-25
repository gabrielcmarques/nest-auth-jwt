import { useState, FormEvent, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const PostForm: React.FC = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState<any | null>(null)
    const [formState, setFormState] = useState({
        title: "",
        description: "",
        content: "",
        errorMessage: "",
    })

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        if (!token) {
            navigate("/login")
        } else {
            const decodedUser = decodeToken(token)
            setUser(decodedUser)
        }
    }, [navigate])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string,
    ) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: e.target.value,
        }))
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (!user) {
            setFormState(prevState => ({
                ...prevState,
                errorMessage: "You must be logged in to create a post.",
            }))
            return
        }

        const { title, description, content } = formState
        console.log(`TITLE  `, title)
        console.log(` DESC `, description)
        console.log(`  CONTENT`, content)
        console.log(`  USER`, user.id)
        console.log(localStorage.getItem("accessToken"))
        try {
            const response = await axios.post(
                "http://localhost:3000/posts/create/",
                {
                    title,
                    description,
                    content,
                    userId: user.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken",
                        )}`,
                    },
                },
            )

            console.log(`RESPONSE @PostForm.tsx axios CREATE: \n ${response}`)

            if (response.status === 201) {
                navigate("/posts")
            }
        } catch (error) {
            console.error("Error creating post:", error)
            setFormState(prevState => ({
                ...prevState,
                errorMessage: "Error creating post. Please try again.",
            }))
        }
    }

    if (!user) {
        return <p>Por favor, faça login para criar um post.</p>
    }

    return (
        <div>
            <h2>Criar um post</h2>
            <p>Posting as: {user.name}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>Título:</label>
                    <input
                        id='title'
                        type='text'
                        value={formState.title}
                        onChange={e => handleChange(e, "title")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='description'>Descrição:</label>
                    <input
                        id='description'
                        type='text'
                        value={formState.description}
                        onChange={e => handleChange(e, "description")}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='content'>Conteúdo:</label>
                    <textarea
                        id='content'
                        value={formState.content}
                        onChange={e => handleChange(e, "content")}
                        required
                    ></textarea>
                </div>
                <button type='submit'>Criar Post</button>
            </form>
            {formState.errorMessage && (
                <p style={{ color: "red" }}>{formState.errorMessage}</p>
            )}
        </div>
    )
}

const decodeToken = (token: string) => {
    try {
        return jwtDecode(token)
    } catch (error) {
        console.error("Error decoding token:", error)
        return null
    }
}

export default PostForm
