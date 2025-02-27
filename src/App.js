import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import WeatherApp from "./components/WeatherApp";
import Wishlist from "./components/Wishlist";
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route element={<ProtectedRoute/>}>
              <Route path="/weather" element={<WeatherApp />} />
              <Route path="/favourites" element={<Wishlist />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
