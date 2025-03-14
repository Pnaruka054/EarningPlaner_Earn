import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import EarnWiz from '../../../assets/EarnWizLogo.png'
import { Link, useNavigate } from "react-router-dom";


const Footer = () => {
    const navigate = useNavigate();

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
    
    return (
        <footer className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8">
            {/* Footer Links */}
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-wrap justify-between items-center text-center md:text-left">
                    {/* Logo and About */}
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        {/* Logo as Background Image */}
                        <div
                            className="w-40 h-16 bg-no-repeat bg-contain bg-center mx-auto md:mx-0"
                            style={{ backgroundImage: `url(${EarnWiz})` }}
                        ></div>

                        {/* Description */}
                        <p className="text-sm mt-2 text-gray-300">
                            Your best platform to earn money online. Join us and start your journey today!
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <ul className="flex flex-wrap justify-center space-x-6">
                            <li>
                                <Link to="/privacy-policy" className="hover:text-yellow-300 transition duration-300">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms-of-use" className="hover:text-yellow-300 transition duration-300">Terms of Use</Link>
                            </li>
                            <li>
                                <Link to="/dmca" className="hover:text-yellow-300 transition duration-300">DMCA</Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="hover:text-yellow-300 transition duration-300">Contact Us</Link>
                            </li>
                            <li>
                                <a className="hover:text-yellow-300 transition duration-300 cursor-pointer" onClick={handleClick}>FAQ</a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Icons */}
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end space-x-4">
                        <a href="/" className="text-white hover:text-yellow-300 transition duration-300">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="/" className="text-white hover:text-yellow-300 transition duration-300">
                            <FaTwitter size={20} />
                        </a>
                        <a href="/" className="text-white hover:text-yellow-300 transition duration-300">
                            <FaInstagram size={20} />
                        </a>
                        <a href="/" className="text-white hover:text-yellow-300 transition duration-300">
                            <FaYoutube size={20} />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-300 mt-6 border-t border-gray-500 pt-4 text-sm">
                    © 2025 <a className="text-yellow-300 hover:underline" href="/">EarnWiz</a>. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
