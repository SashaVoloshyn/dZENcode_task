import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {fetchRegister} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";
import {joiResolver} from "@hookform/resolvers/joi";
import {RegistrationValidator} from "../../utils";

export const RegistrationPage = () => {

    const isUser = useSelector(state => state.auth.userData)

    const dispatch = useDispatch()

    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            userName: "Sashok",
            email: "sassha@sasha.com",
            password: "qwertY123654789"
        },
        mode: "onTouched",
        resolver: joiResolver(RegistrationValidator)
    });


    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar[0]);
        formData.append("userName", data.userName);
        formData.append("email", data.email);
        formData.append("password", data.password);

        const userData = await dispatch(fetchRegister(formData));

        console.log(userData);
        if (userData.error.message) {
            return alert(userData.payload);
        }
    }

    if (isUser) {
        return <Navigate to="/login"/>
    }
    console.log(errors);

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Створити акаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.avatar}>
                    <Avatar
                        type="file"
                        sx={{width: 100, height: 100}}/>

                </div>
                <input {...register("avatar")}
                       className={styles.field}
                       type="file"
                       accept=".jpg,.png,.jpeg"

                />

                <TextField className={styles.field} label="Iм'я"
                           error={Boolean(errors.userName?.message)}
                           helperText={errors.userName && <span>{errors.userName?.message}</span>}
                           {...register("userName", {required: "Вкажіть Ім'я"})}
                          fullWidth/>
                <TextField className={styles.field} label="E-Mail"
                           type="email"
                           error={Boolean(errors.email?.message)}
                           helperText={errors.email && <span>{errors.email?.message}</span>}
                           {...register("email", {required: "Вкажіть E-Mail"})}
                           fullWidth/>
                <TextField className={styles.field} label="Пароль"
                           type="password"
                           error={Boolean(errors.password?.message)}
                           helperText={errors.password && <span>{errors.password?.message}</span>}
                           {...register("password", {required: "Вкажіть пароль"})}
                           fullWidth/>
                <Button type="submit" size="large" variant="contained">
                    Зареєструватися
                </Button>
            </form>
        </Paper>
    );
};
