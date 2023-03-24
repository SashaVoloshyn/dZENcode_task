import { Routes, Route } from 'react-router-dom'
import {
    AddMainCommentPage,
    HomePage,
    LoginPage,
    RegistrationPage
} from './pages'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAuthMe} from './redux/slices/auth'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout/Layout'
import MainCommentsPage from './pages/MainCommentsPage/MainCommentsPage'
import MainCommentsPageEmail from './pages/MainCommentsPageEmail/MainCommentsPageEmail'
import MainCommentsPageUserName from './pages/MainCommentsPageUserName/MainCommentsPageUserName'

function App() {
    const { error } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAuthMe())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])



    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="/registration"
                        element={<RegistrationPage />}
                    />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/" element={<HomePage />}>
                        <Route
                            index
                            element={<Navigate to={'/mainComments/'} />}
                        />
                        <Route
                            path="/mainComments/"
                            element={<MainCommentsPage />}
                        />
                        <Route
                            path="/mainComments/email"
                            element={<MainCommentsPageEmail />}
                        />
                        <Route
                            path="/mainComments/userName"
                            element={<MainCommentsPageUserName />}
                        />
                    </Route>

                    <Route
                        path="/mainComment-create"
                        element={<AddMainCommentPage />}
                    />
                </Route>
            </Routes>
        </>
    )
}

export default App
