import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import styles from './Login.module.scss'
import { fetchLogin } from '../../redux/slices/auth'
import { joiResolver } from '@hookform/resolvers/joi'
import { LoginValidator } from '../../utils'

export const LoginPage = () => {
    const isAuth = useSelector((state) => state.auth.data)
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            email: 'hello@lo.com',
            password: 'qwertY123654789'
        },
        mode: 'onTouched',
        resolver: joiResolver(LoginValidator)
    })

    const onSubmit = async (values) => {
        const data = await dispatch(fetchLogin(values))

        if (
            'accessToken' in data.payload.data &&
            'clientKey' in data.payload.data
        ) {
            window.localStorage.setItem(
                'accessToken',
                data.payload.data.accessToken
            )
            window.localStorage.setItem(
                'refreshToken',
                data.payload.data.refreshToken
            )
            window.localStorage.setItem(
                'clientKey',
                data.payload.data.clientKey
            )
        }
    }
    if (isAuth) {
        return <Navigate to="/" />
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Вхід
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    type="email"
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={
                        errors.email && <span>{errors.email?.message}</span>
                    }
                    {...register('email', { required: 'Вкажіть E-Mail' })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    type="password"
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={
                        errors.password && (
                            <span>{errors.password?.message}</span>
                        )
                    }
                    {...register('password', { required: 'Вкажіть пароль' })}
                    fullWidth
                />
                <Button
                    disabled={!isValid}
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                >
                    Увійти
                </Button>
            </form>
        </Paper>
    )
}
