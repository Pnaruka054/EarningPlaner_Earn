import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SideMenu from '../sideMenu/sideMenu';
import EarnWizLogo from '../../../../assets/EarnWizLogo.png'
import ProcessBgBlack from '../processBgBlack/processBgBlack';
import axios from 'axios';

const NavBar = ({ show, availableBalance_forNavBar_state }) => {
    const [sideMenu_state, setSideMenu_state] = useState('menu-outline');
    const [toggelMenu_state, setToggelMenu_state] = useState("reorder-three");
    const [navBarBalance_state, setNavBarBalance_state] = useState("reorder-three");
    let [data_process_state, setData_process_state] = useState(false);
    let [isUserLogin_state, setIsUserLogin_state] = useState(false);

    let toggleMenu_icon = useRef(null)
    const navigate = useNavigate();
    const location = useLocation();

    let toggleMenu = (e) => {
        e.stopPropagation()
        let menuIcon = toggleMenu_icon.current
        if (e.target.name === 'reorder-three') {
            setToggelMenu_state('close')
            menuIcon.classList.remove("hidden")
        } else if (e.target.name === 'close') {
            setToggelMenu_state('reorder-three')
            menuIcon.classList.add("hidden")
        }

        if (toggleMenu_icon.current) {
            toggleMenu_icon.current.querySelectorAll('a').forEach(anchor => {
                anchor.addEventListener('click', () => {
                    setToggelMenu_state('reorder-three')
                    menuIcon.classList.add("hidden");
                });
            });
        }
    }
    useEffect(() => {
        const menuIcon = toggleMenu_icon.current;

        const handleNavMenuClick = (e) => {
            setToggelMenu_state('reorder-three');
            menuIcon?.classList.add("hidden");
        };

        const handleSideMenuClick = (e) => {
            setSideMenu_state('menu-outline');
        };

        window.addEventListener("click", handleNavMenuClick);
        window.addEventListener("click", handleSideMenuClick);

        return () => {
            window.removeEventListener("click", handleNavMenuClick);
            window.removeEventListener("click", handleSideMenuClick);
        };
    }, [toggleMenu_icon.current]);

    const handleClick = () => {
        if (window.location.pathname !== "/") {
            // If not on the "/" route, navigate to "/"
            navigate("/");
            // After navigating, scroll to the FAQ section
            setTimeout(() => {
                document.getElementById("FAQs")?.scrollIntoView({ behavior: "smooth" });
            }, 300); // Delay to allow time for the route change
        } else {
            // If on "/" route, just scroll to the FAQ section
            document.getElementById("FAQs")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setData_process_state(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/checkLogin_for_navBar`, {
                    withCredentials: true
                });
                setIsUserLogin_state(response.data.success)
            } catch (error) {
                console.error(error);
                if (error.response.data.jwtMiddleware_token_not_found_error || error.response.data.jwtMiddleware_user_not_found_error) {

                }
            } finally {
                setData_process_state(false);
            }
        };

        if (show) {
            fetchData();
        }
    }, [show, location]);

    if (show) {
        return (
            <nav className={`bg-blue-800 select-none h-14 px-4 flex items-center justify-between ${toggelMenu_state === 'close' ? '' : 'shadow-lg'} text-white relative`}>
                <Link to="/" className="h-full flex items-center z-[1] select-none" draggable="false">
                    <div
                        className="h-10 w-40 bg-no-repeat bg-contain"
                        style={{ backgroundImage: `url(${EarnWizLogo})` }}
                        aria-label="EarnWiz Logo"
                    ></div>
                </Link>
                <ul
                    onClick={(e) => e.stopPropagation()}
                    ref={toggleMenu_icon}
                    className={`md:flex md:items-center md:space-x-6 absolute md:relative md:top-0 md:left-0 md:right-0 
                        bg-blue-800 md:bg-transparent py-2 md:py-0 shadow-lg md:shadow-none md:text-white
                        transition-all duration-300 ease-in-out transform ${toggelMenu_state === 'close' ? 'translate-y-0 md:space-y-0 space-y-2 opacity-100 text-white' : 'translate-y-[-100%] opacity-0 md:translate-y-0 md:opacity-100 text-blue-800'
                        } w-full md:w-auto top-14 left-0 right-0`}                >
                    <li>
                        <Link className="hover:text-yellow-400 px-3 py-2 rounded-lg transition" to="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <a className="hover:text-yellow-400 px-3 py-2 rounded-lg transition cursor-pointer" onClick={handleClick}>
                            FAQ
                        </a>
                    </li>
                    <li>
                        <Link className="hover:text-yellow-400 px-3 py-2 rounded-lg transition" to="/contact-us">
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link className="hover:text-yellow-400 px-3 py-2 rounded-lg transition" to="#">
                            Income
                        </Link>
                    </li>
                    <span>
                        {isUserLogin_state ? (
                            <Link
                                to="/member/dashboard"
                                className="border inline-block m-2 md:m-auto border-green-200 text-green-200 px-4 py-1 rounded-lg transition duration-300 hover:bg-green-200 hover:text-blue-900 hover:shadow-md"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex gap-2 p-2 md:p-0">
                                <Link
                                    to="/login"
                                    className="border border-white text-white px-4 py-1 rounded-lg transition duration-300 hover:bg-white hover:text-blue-900 hover:shadow-md"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-yellow-400 text-blue-900 font-semibold px-4 py-1 rounded-lg transition duration-300 hover:bg-yellow-600 hover:text-white hover:shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                    </span>
                </ul >
                <p onClick={toggleMenu} className="md:hidden text-3xl text-white cursor-pointer">
                    <ion-icon name={toggelMenu_state}></ion-icon>
                </p>
                {data_process_state && <ProcessBgBlack />}
            </nav >
        );
    }

    return (
        <nav className="bg-blue-800 select-none z-[2] h-14 px-4 flex items-center fixed top-0 left-0 right-0 justify-between shadow-lg text-white">
            <Link to="/" className="h-full hidden md:flex items-center">
                <img className="h-10" src={EarnWizLogo} alt="EarnWiz Logo" />
            </Link>
            <SideMenu sideMenu_show={{ sideMenu_state, setSideMenu_state }} />
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    setSideMenu_state(sideMenu_state === "menu-outline" ? "close" : "menu-outline");
                }}
                className="h-full text-3xl text-white cursor-pointer md:hidden flex items-center"
            >
                <ion-icon name={sideMenu_state}></ion-icon>
            </span>
            <ul className="flex items-center space-x-4 text-white">
                <li className="hover:text-yellow-400 px-3 py-2 rounded-lg transition">
                    <Link to="/member/withdraw">
                        <span className="sm:inline-block hidden">Available Balance:</span> ₹{availableBalance_forNavBar_state}
                    </Link>
                </li>
                <li className="hover:text-yellow-400 px-3 py-2 rounded-lg transition">
                    <Link to="/member/profile">
                        <ion-icon name="person"></ion-icon> Profile
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;