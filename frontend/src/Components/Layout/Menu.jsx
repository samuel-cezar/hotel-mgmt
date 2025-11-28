import React from "react";
import { Link } from "react-router-dom";

function Menu() {
    return (
        <nav className="navbar">
            <div className="container">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/clientes" className="nav-link">Clientes</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/quartos" className="nav-link">Quartos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/reservas" className="nav-link">Reservas</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Menu;
