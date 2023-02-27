import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";
import { fetchLogin, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: "asdsad221@tesdt.email",
      password: "sashsapasswORRD123"
    },
    mode: "onChange",
  });

  const onSubmit=async (values)=>{
    const data =  await dispatch(fetchLogin(values));
    console.log(data);

    if (!data.payload) {
      return alert('Не вдалось авторизуватись')
    }
    if ("accessToken" in data.payload.data && "clientKey" in data.payload.data) {
      window.localStorage.setItem("accessToken", data.payload.data.accessToken);
      window.localStorage.setItem("refreshToken", data.payload.data.refreshToken);
      window.localStorage.setItem("clientKey", data.payload.data.clientKey);
    }
  }

  if (isAuth) {
    return <Navigate to="/"/>
  }


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вхід
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Вкажіть E-Mail" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          type="password"
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Вкажіть пароль" })}
          fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Увійти
        </Button>
      </form>
    </Paper>
  );
};


