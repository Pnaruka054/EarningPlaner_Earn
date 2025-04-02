import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SideMenu from '../sideMenu/sideMenu';
import EarnWizLogo from '../../../assets/EarnWizLogo.png'
import ProcessBgBlack from '../processBgBlack/processBgBlack';
import axios from 'axios';
import showNotificationWith_timer from '../showNotificationWith_timer';
import { NavBar_global_context } from "../context/navBar_globalContext";
import { FaBars, FaTimes } from 'react-icons/fa';
import { IoPerson } from "react-icons/io5";

const NavBar = ({ show, availableBalance_forNavBar_state, setLogOut_btnClicked }) => {
    const [sideMenu_state, setSideMenu_state] = useState('menu-outline');
    const [toggelMenu_state, setToggelMenu_state] = useState("reorder-three");
    let [data_process_state, setData_process_state] = useState(false);
    let [isUserLogin_state, setIsUserLogin_state] = useState(false);
    const { setNavBar_global_context_state, setNavBar_to_privacyPolicy_dmca_termsOfUse_context_state, setNavBar_to_faq_and_homePage_section_context_state } = useContext(NavBar_global_context);

    let toggleMenu_icon = useRef(null)
    const navigation = useNavigate();
    const location = useLocation();

    let toggleMenu = (e) => {
        e.stopPropagation()
        let menuIcon = toggleMenu_icon.current
        if (e.currentTarget.firstChild.getAttribute('name') === 'reorder-three') {
            setToggelMenu_state('close')
            menuIcon.classList.remove("hidden")
        } else if (e.currentTarget.firstChild.getAttribute('name') === 'close') {
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

        const handleNavMenuClick = () => {
            setToggelMenu_state('reorder-three');
            menuIcon?.classList.add("hidden");
        };

        const handleSideMenuClick = () => {
            setSideMenu_state('menu-outline');
        };

        window.removeEventListener("click", handleNavMenuClick);
        window.removeEventListener("click", handleSideMenuClick);

        // Check karo agar menu hidden nahi hai to events add karo
        if (!menuIcon?.classList.contains("hidden")) {
            window.addEventListener("wheel", handleNavMenuClick, { once: true });
            window.addEventListener("touchmove", handleNavMenuClick, { once: true });
        }

        window.addEventListener("click", handleNavMenuClick);
        window.addEventListener("click", handleSideMenuClick);

        return () => {
            window.removeEventListener("click", handleNavMenuClick);
            window.removeEventListener("click", handleSideMenuClick);
        };
    }, [toggleMenu_icon.current]);


    const handleClick = () => {
        if (window.location.pathname !== "/") {
            // If not on the "/" route, navigation to "/"
            navigation("/");
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
                let queryParams = '';

                if (location.pathname === "/") {
                    queryParams = "?faq=true";
                } else if (location.pathname === "/payment-proof") {
                    queryParams = "?paymentProof=true";
                } else if (location.pathname === "/privacy-policy") {
                    queryParams = "?privacy_policy=true";
                } else if (location.pathname === "/dmca") {
                    queryParams = "?dmca=true";
                } else if (location.pathname === "/terms-of-use") {
                    queryParams = "?terms_of_use=true";
                }

                const url = `${import.meta.env.VITE_SERVER_URL}/checkLogin_for_navBar${queryParams}`

                const response = await axios.get(url, { withCredentials: true });

                if (location.pathname === "/") {
                    setNavBar_to_faq_and_homePage_section_context_state({
                        faq: response?.data?.msg?.other_data_faqArray,
                        homepage_section: response?.data?.msg?.other_data_homepage_Array
                    });
                } else if (location.pathname === "/payment-proof") {
                    setNavBar_global_context_state(response.data.msg.paymentProof_data);
                } else if (location.pathname === "/privacy-policy") {
                    setNavBar_to_privacyPolicy_dmca_termsOfUse_context_state(response.data.msg.privacy_policy_data);
                } else if (location.pathname === "/dmca") {
                    setNavBar_to_privacyPolicy_dmca_termsOfUse_context_state(response.data.msg.dmca_data);
                } else if (location.pathname === "/terms-of-use") {
                    setNavBar_to_privacyPolicy_dmca_termsOfUse_context_state(response.data.msg.terms_of_use_data);
                }

                setIsUserLogin_state(response.data.msg.isLogin);

                if (
                    ["/login", "/signup"].includes(location.pathname) ||
                    location.pathname.startsWith("/signup/ref")
                ) {
                    if (response.data.msg.isLogin) {
                        showNotificationWith_timer(true, "You Already Logged In", "/member/dashboard", navigation);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setData_process_state(false);
            }
        };

        if (show) {
            fetchData();
            const handle_userOnline = () => {
                fetchData();
            };

            window.addEventListener('online', handle_userOnline);

            return () => {
                window.removeEventListener('online', handle_userOnline);
            };
        }
    }, [show, location]);

    if (show) {
        return (
            <nav className={`bg-blue-800 z-[1] select-none h-[7.5dvh] px-4 flex items-center justify-between ${toggelMenu_state === 'close' ? '' : 'shadow-lg'} text-white relative`}>
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
                    className={`md:flex md:items-center md:space-x-3 absolute md:relative md:top-0 md:left-0 md:right-0 
                        bg-blue-800 md:bg-transparent py-2 md:py-0 shadow-lg md:shadow-none md:text-white
                        transition-all duration-300 ease-in-out transform 
                        ${toggelMenu_state === 'close'
                            ? 'translate-y-0 opacity-100 pointer-events-auto text-white'
                            : 'translate-y-[-100%] md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto text-blue-800'
                        } w-full md:w-auto top-14 left-0 right-0`}               >
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
                        <Link className="hover:text-yellow-400 px-3 py-2 rounded-lg transition" to="/payment-proof">
                            Payments Proof
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
                    {toggelMenu_state !== 'close' ? <FaBars size="25px" name='reorder-three' /> : <FaTimes name='close' />}
                </p>
                {data_process_state && <ProcessBgBlack />}
            </nav >
        );
    }

    return (
        <nav className="bg-blue-800 select-none z-[2] h-[6.7dvh] min-h-12 px-4 flex items-center fixed top-0 left-0 right-0 justify-between shadow-lg text-white">
            <Link to="/" className="h-full hidden md:flex items-center">
                <img className="h-10" src={EarnWizLogo} alt="EarnWiz Logo" />
            </Link>
            <SideMenu sideMenu_show={{ sideMenu_state, setSideMenu_state }} setLogOut_btnClicked={setLogOut_btnClicked} />
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    setSideMenu_state(sideMenu_state === "menu-outline" ? "close" : "menu-outline");
                }}
                className="h-full text-3xl text-white cursor-pointer md:hidden flex items-center"
            >
                {sideMenu_state !== 'close' ? <FaBars size="25px" name='menu-outline' /> : <FaTimes name='close' />}
            </span>
            <ul className="flex items-center space-x-4 text-white">
                <li className="hover:text-yellow-400 px-3 py-2 rounded-lg transition">
                    <Link to="/member/withdraw">
                        <span className="sm:inline-block hidden">Available Balance:</span> ₹{availableBalance_forNavBar_state}
                    </Link>
                </li>
                <li className="hover:text-yellow-400 px-3 py-2 rounded-lg transition">
                    <Link to="/member/profile" className='flex items-center gap-1'>
                        <IoPerson /> Profile
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;