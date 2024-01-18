import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './Components/ProtectedRoute';  // Assuming ProtectedRoute is a default export
import { Login } from './Components/LoginPage/Login';
import { HomePage } from './Components/HomePage';




function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/homepage*/' element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
          <Route path='/' element={<Login />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
