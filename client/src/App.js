import Container from '@mui/material/Container'
import { Routes, Route } from 'react-router-dom'

import { Header } from './components'
import { Home, Login, Registration } from './pages'

// import Texta2 from './components/Texta2'

function App() {

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
