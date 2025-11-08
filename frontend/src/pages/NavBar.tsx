import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../components/LogOutButton";
import "./NavBar.css"; 

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();

  // Check if user has admin role
  const isAdmin = user?.roles?.some(role => 
    role.name.toLowerCase() === 'admin'
  ) ?? false;

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div>
          <NavLink to={isLoggedIn ? "/assets" : "/"} className="navbar-logo">
            LOGO
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <NavLink
                to="/assets"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Assets
              </NavLink>
              <NavLink
                to="/trades"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Trades
              </NavLink>
              <NavLink
                to="/holdings"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Holdings
              </NavLink>
              <NavLink
                to="/macro"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Macro
              </NavLink>
              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Watchlist
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink
                    to="/actionmanager"
                    className={({ isActive }) =>
                      `navbar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    Action Manager
                  </NavLink>
                  <NavLink
                    to="/rolemanager"
                    className={({ isActive }) =>
                      `navbar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    Role Manager
                  </NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                About us
              </NavLink>
              {/* <span className="navbar-link">Portfolio</span>
              <span className="navbar-link">Services</span> */}
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth-buttons">
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <>
              <NavLink to="/signin" className="btn-secondary">
                Sign In
              </NavLink>
              <NavLink to="/signup" className="btn-primary">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;