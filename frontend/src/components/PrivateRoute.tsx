import { Navigate, Route, RouteProps } from "react-router-dom"

interface PrivateRouteProps extends RouteProps {
    element: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
    const accessToken = localStorage.getItem("accessToken")

    if (!accessToken) {
        return <Navigate to='/login' />
    }

    return <Route {...rest} element={element} />
}

export default PrivateRoute
