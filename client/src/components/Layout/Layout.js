import React from 'react';
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";

import {Header} from "../Header/Header";

const Layout = () => {
    return (
        <div>
            <Header/>
            <Container maxWidth="md">

                <Outlet/>
            </Container>

        </div>
    );
};

export default Layout;