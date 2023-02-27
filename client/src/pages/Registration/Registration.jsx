import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from "react-redux";
import {  fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

export const Registration = () => {

  const dispatch = useDispatch()
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    defaultValues: {
      avatar: "",
      userName:"testName",
      email: "asdsad221@tesdt.email",
      password: "sashsapasswORRD1"
    },
    mode: "onChange",
  });

  const onSubmit=async (data)=>{
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]); // append the avatar file to the form data
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("password", data.password);


    const userData =  await dispatch(fetchRegister(formData));
    console.log(userData);


    if (!userData.payload) {
      return alert('подивитисб за сет еррор');
    }
  }


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Створити акаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <Avatar
            type="file"
            sx={{ width: 100, height: 100 }} />

        </div>
        <input {...register("avatar" )}
               className={styles.field}
               type="file"
               accept=".jpg,.png,.jpeg,.gif"
                />

        <TextField className={styles.field} label="Iм'я"
                   error={Boolean(errors.userName?.message)}
                   helperText={errors.userName?.message}
                   {...register("userName", { required: "Вкажіть Ім'я" })}
                   fullWidth />
        <TextField className={styles.field} label="E-Mail"
                   error={Boolean(errors.email?.message)}
                   helperText={errors.email?.message}
                   {...register("email", { required: "Вкажіть E-Mail" })}
                   fullWidth />
        <TextField className={styles.field} label="Пароль"
                   type="password"
                   error={Boolean(errors.password?.message)}
                   helperText={errors.password?.message}
                   {...register("password", { required: "Вкажіть пароль" })}
                   fullWidth />
        <Button  type="submit" size="large" variant="contained" fullWidth>
          Зареєструватися
        </Button>
      </form>
    </Paper>
  );
};
