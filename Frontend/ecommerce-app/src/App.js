import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import UserProfile from './components/UserProfile/UserProfile';
import LogoutButton from './components/Logout/Logout';

function App() {
  const token = localStorage.getItem('access_token');

  return (
    <BrowserRouter>
      <div className="App">
        <nav style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
            {token ? (
              <>
                <li>
                  <Link to="/products">Productos</Link>
                </li>
                <li>
                  <Link to="/cart">Carrito</Link>
                </li>
                <li>
                  <Link to="/profile">Perfil</Link>
                </li>
                <li>
                  <LogoutButton />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Iniciar Sesión</Link>
                </li>
                <li>
                  <Link to="/register">Registro</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          {token ? (
            <>
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<UserProfile />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Login />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
