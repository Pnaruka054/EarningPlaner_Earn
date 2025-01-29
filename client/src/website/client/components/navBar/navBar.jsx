import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import navBar_logo from '../../../../assets/EarningPlanerLogo.png'

const NavBar = ({ sideMenu_show, show }) => {
    const [toggelMenu_state, setToggelMenu_state] = useState("reorder-three");
    let toggleMenu_icon = useRef(null)
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
    }
    useEffect(() => {
        const menuIcon = toggleMenu_icon.current;

        const handleNavMenuClick = (e) => {
            setToggelMenu_state('reorder-three');
            menuIcon?.classList.add("hidden");
        };

        const handleSideMenuClick = (e) => {
            sideMenu_show.setSideMenu_state('menu-outline');
        };

        window.addEventListener("click", handleNavMenuClick);
        window.addEventListener("click", handleSideMenuClick);

        return () => {
            window.removeEventListener("click", handleNavMenuClick);
            window.removeEventListener("click", handleSideMenuClick);
        };
    }, []);


    if (show) {
        return (
            <>
                <nav className='bg-blue-600 select-none h-12 px-3 flex items-center justify-between shadow relative'>
                    <span className='h-[100%] flex items-center'>
                        <img className='h-[90%]' src={navBar_logo} alt="hello prem" />
                    </span>
                    <ul onClick={(e) => e.stopPropagation()} ref={toggleMenu_icon} className='hidden md:flex items-center md:space-x-4 text-white bg-blue-600 absolute md:relative md:top-0 md:left-0 md:right-0 top-12 left-0 right-0'>
                        <li className='hover:bg-blue-700 px-3 h-10 rounded flex items-center'>
                            <a href="#">Home</a>
                        </li>
                        <li className='hover:bg-blue-700 px-3 h-10 rounded flex items-center'>
                            <a href='#'>FAQ</a>
                        </li>
                        <li className='hover:bg-blue-700 px-3 h-10 rounded flex items-center'>
                            <a href='#'>Contact Us</a>
                        </li>
                        <li className='hover:bg-blue-700 px-3 h-10 rounded flex items-center'>
                            <a href='#'>Income</a>
                        </li>
                        <span className='h-12 px-2 md:px-0 flex items-center'>
                            <Link to="/login" className='bg-transparent border-[1px] hover:bg-white hover:text-black transition rounded px-3 py-1'>Login</Link>
                            <Link to="/signup" className='bg-transparent border-[1px] hover:bg-white hover:text-black transition rounded px-3 py-1'>SignUp</Link>
                        </span>
                    </ul>
                    <p onClick={toggleMenu} className="md:hidden text-4xl text-white cursor-pointer">
                        <ion-icon name={toggelMenu_state}></ion-icon>
                    </p>
                </nav>
            </>
        );
    }

    return (
        <>
            <nav className='bg-blue-600 select-none z-[2] h-12 px-3 flex items-center fixed top-0 left-0 right-0 justify-between shadow'>
                <span className='h-[100%] hidden md:flex items-center'>
                    <img className='h-[90%]' src={navBar_logo} alt="hello prem" />
                </span>
                <span onClick={(e) => {
                    e.stopPropagation()
                    if (e.target.name === 'menu-outline') {
                        sideMenu_show.setSideMenu_state('close')
                    } else {
                        sideMenu_show.setSideMenu_state('menu-outline')
                    }
                }} className='h-[100%] text-4xl text-white cursor-pointer md:hidden flex items-center'>
                    <ion-icon name={sideMenu_show.sideMenu_state}></ion-icon>
                </span>
                <ul className='flex items-center space-x-4 text-white'>
                    <li className='hover:bg-blue-700 px-3 h-12 flex items-center'>
                        <a href="#"><span className='sm:inline-block hidden'>Available Balance:</span> ₹0.0120</a>
                    </li>
                    <li className='hover:bg-blue-700 px-3 h-12 flex items-center'>
                        <Link to='/member/profile'><ion-icon name="person"></ion-icon> Profile</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default NavBar;