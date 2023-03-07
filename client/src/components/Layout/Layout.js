import React from 'react';
import {Header} from "../Header/Header";
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";

const Layout = () => {
    return (
        <div>
            <Header/>
            <Container maxWidth="lg">

                <Outlet/>
            </Container>

        </div>
    );
};

export default Layout;