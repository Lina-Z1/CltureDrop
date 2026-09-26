import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Destinations from './pages/Destinations';
import Destination from './pages/Destination';
import FoodDetail from './pages/FoodDetail';

function Layout() {
  const location = useLocation();
  const hideFooter = location.pathname === '/';

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<Destination />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App