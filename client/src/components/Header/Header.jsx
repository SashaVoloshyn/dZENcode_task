import React from 'react'
import Button from '@mui/material/Button'

import styles from './Header.module.scss'
import Container from '@mui/material/Container'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout,selectIsAuth } from '../../redux/slices/auth'

export const Header = () => {
    const isAuth = useSelector(selectIsAuth);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onClickLogout = () => {
        if (window.confirm('Ви справді хочете вийти ? ? ?')) {
            dispatch(logout())
            navigate('/')
        }
    }
    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                <div className={styles.inner}>
                    <Link className={styles.logo} to="/">
                        <div>DZENCode</div>
                    </Link>
                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                <Link to="/mainComment-create">
                                    <Button variant="contained">
                                        Створити
                                    </Button>
                                </Link>
                                <Button
                                    onClick={onClickLogout}
                                    variant="contained"
                                    color="error"
                                >
                                    Вийти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outlined">Увійти</Button>
                                </Link>
                                <Link to="/registration">
                                    <Button variant="contained">
                                        Створити акаунт
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}
