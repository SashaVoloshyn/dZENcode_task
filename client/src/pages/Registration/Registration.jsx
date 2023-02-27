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
  const [avatarBuffer, setAvatarBuffer] = React.useState(null);
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      avatar: "",
      userName:"testName",
      email: "asdsad221@tesdt.email",
      password: "sashsapasswORRD1"
    },
    mode: "onChange",
  });

  const onSubmit=async (values)=>{
    const data =  await dispatch(fetchRegister(values));
    console.log(data);

    console.log(avatarBuffer);

    if (!data.payload) {
      return alert('подивитисб за сет еррор');
    }

    return <Navigate to="/"/>

  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      setAvatarBuffer(reader.result);
    };
  };

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
               onChange={handleFileChange}
               fullWidth />

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
