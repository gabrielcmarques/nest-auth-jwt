import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import "../style/PostsList.css"

interface Post {
    id: number
    title: string
    description: string
    content: string
    createdAt: string
    updatedAt: string
    userId: number
}

interface DecodedToken {
    id: number
    username: string
    exp: number
}

const PostsList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    // const [_, setUser] = useState<any | null>(null)
    const navigate = useNavigate()
    const token = localStorage.getItem("accessToken")
    const userId = token ? (jwtDecode(token) as DecodedToken).id : null

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/posts",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "accessToken",
                            )}`,
                        },
                    },
                )
                setPosts(response.data)
            } catch (error) {
                console.error("Error fetching posts:", error)
                setError("Failed to load posts. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    const handleDeletePost = async (postId: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?",
        )
        if (!confirmDelete) {
            return
        }

        try {
            await axios.delete(`http://localhost:3000/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "accessToken",
                    )}`,
                },
                data: {
                    userId: userId,
                },
            })
            setPosts(posts.filter(post => post.id !== postId))
        } catch (error) {
            console.error("Error deleting post:", error)
            alert("Failed to delete the post.")
        }
    }

    const handleCreatePost = () => {
        navigate("/posts/create")
    }

    const truncateContent = (content: string, maxLength: number): string => {
        if (content.length > maxLength) {
            return content.slice(0, maxLength) + "..."
        }
        return content
    }

    return (
        <div className='blog-container'>
            <div className='blog-header'>
                <h2 className='blog-title'>Timeline</h2>
                <button
                    className='create-post-button'
                    onClick={handleCreatePost}
                >
                    Criar novo post
                </button>
            </div>
            {loading ? (
                <p className='loading'>Carregando posts...</p>
            ) : error ? (
                <p className='error'>{error}</p>
            ) : (
                <div className='posts'>
                    {posts.length === 0 ? (
                        <p className='no-posts'>Nenhum post disponivel</p>
                    ) : (
                        posts.map(post => (
                            <div className='post-card' key={post.id}>
                                <h3 className='post-title'>{post.title}</h3>
                                <p className='post-description'>
                                    {post.description}
                                </p>
                                <div className='post-content'>
                                    {truncateContent(post.content, 360)}{" "}
                                </div>
                                <div className='post-meta'>
                                    <small>
                                        Postado em:{" "}
                                        {new Date(
                                            post.createdAt,
                                        ).toLocaleString()}{" "}
                                        | Última atualização:{" "}
                                        {new Date(
                                            post.updatedAt,
                                        ).toLocaleString()}
                                    </small>
                                </div>
                                {userId === post.userId && (
                                    <button
                                        onClick={() =>
                                            handleDeletePost(post.id)
                                        }
                                    >
                                        Deletar
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

// Function to decode JWT token and extract user information
// const decodeToken = (token: string) => {
//     try {
//         return jwtDecode(token)
//     } catch (error) {
//         console.error("Error decoding token:", error)
//         return null
//     }
// }

export default PostsList
