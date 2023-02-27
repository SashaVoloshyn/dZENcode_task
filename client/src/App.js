import Container from '@mui/material/Container'
import { Routes, Route } from 'react-router-dom'

import { Header } from './components'
import { Home, Login, Registration } from './pages'
import { mainConfig } from "./configs/main.config";

// import Texta2 from './components/Texta2'

function App() {
  console.log(mainConfig.CLOUD_DOMAIN_NAME);
  console.log(mainConfig.SERVER_URL);

    return (
        <>
            <Header />
            {/*<Texta2 hidden/>*/}
            <Container maxWidth="lg">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
              </Routes>
            </Container>


        </>
    )
}

export default App
