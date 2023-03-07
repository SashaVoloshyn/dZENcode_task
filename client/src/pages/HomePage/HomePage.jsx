import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { Tab } from '@mui/material'
import styles from './HomePage.module.scss'

export const HomePage = () => {
    return (
        <>
            <div className={styles.nav}>
                <NavLink to="mainComments/">
                    <Tab className="tab" label="Нові" />
                </NavLink>
                <NavLink to="/mainComments/userName">
                    <Tab className="tab" label="Ім'я" />
                </NavLink>
                <NavLink to="/mainComments/email">
                    <Tab className="tab" label="Email" />
                </NavLink>
            </div>

            <Outlet />
        </>
    )
}
