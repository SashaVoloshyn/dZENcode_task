import React from 'react'
import {NavLink, Outlet, useSearchParams} from 'react-router-dom'

import {Tab, Box, InputLabel, MenuItem, FormControl, Select} from '@mui/material'

import styles from './HomePage.module.scss'
import {useDispatch} from "react-redux";
import {getSort} from "../../redux/slices/mainComments";


export const HomePage = () => {

    const [sort, setSort] = React.useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const dispatch = useDispatch()
    const handleChange = (event) => {

        const params = { page: 1, sort: `${event.target.value}` };
        setSearchParams(params);
        setSort(event.target.value);
        dispatch(getSort(searchParams.get('sort')));
    };

    return (
        <>
            <div className={styles.wrap}>
                <div className={styles.nav}>
                    <NavLink to="mainComments/">
                        <Tab className="tab" label="Комментарі"/>
                    </NavLink>
                    <NavLink to="/mainComments/userName">
                        <Tab className="tab" label="Ім'я"/>
                    </NavLink>
                    <NavLink to="/mainComments/email">
                        <Tab className="tab" label="Email"/>
                    </NavLink>
                </div>
                <Box sx={{minWidth: 140}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Сортувати</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sort}
                            label="Сортувати"
                            onChange={handleChange}
                        >
                            <MenuItem value={'ASC'}>За зростанням</MenuItem>
                            <MenuItem value={'DESC'}>За спаданням</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>

            <Outlet/>
        </>
    )
}
