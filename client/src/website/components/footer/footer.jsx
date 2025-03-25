import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaTelegram } from "react-icons/fa";
import EarnWiz from '../../../assets/EarnWizLogo.png';
import { Link, useNavigate } from "react-router-dom";
import TrustpilotWidget from '../TrustpilotWidget/TrustpilotWidget';

const Footer = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (window.location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                document.getElementById("FAQs")?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        } else {
            document.getElementById("FAQs")?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    {/* Left Section - Logo and Description */}
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
                        <div
                            className="w-40 h-16 bg-no-repeat bg-contain bg-center"
                            style={{ backgroundImage: `url(${EarnWiz})` }}
                        ></div>
                        <p className="mt-2 text-gray-300 text-sm">
                            Your best platform to earn money online. Join us &amp; start your journey today!
                        </p>
                    </div>
                    {/* Center Section - Trustpilot Widget & Navigation Links */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <TrustpilotWidget />
                        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                            <li>
                                <Link to="/privacy-policy" className="hover:text-yellow-300 transition duration-300">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-of-use" className="hover:text-yellow-300 transition duration-300">
                                    Terms of Use
                                </Link>
                            </li>
                            <li>
                                <Link to="/dmca" className="hover:text-yellow-300 transition duration-300">
                                    DMCA
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="hover:text-yellow-300 transition duration-300">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <a onClick={handleClick} className="hover:text-yellow-300 transition duration-300 cursor-pointer">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Right Section - Social Media Icons */}
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                        <div className="flex gap-x-4">
                            <a href="https://www.facebook.com/share/g/1H3QEHCQTq/" className="hover:text-yellow-300 transition duration-300">
                                <FaFacebookF size={20} />
                            </a>
                            <a href="https://x.com/earning_planer" className="hover:text-yellow-300 transition duration-300">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://www.instagram.com/earnwiz_official?igsh=azYzcjk3eDByZHFw" className="hover:text-yellow-300 transition duration-300">
                                <FaInstagram size={20} />
                            </a>
                            <a href="http://linkedin.com/company/earnwiz" className="hover:text-yellow-300 transition duration-300">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="https://t.me/EarnWiz_official" className="hover:text-yellow-300 transition duration-300">
                                <FaTelegram size={20} />
                            </a>
                            <a href="https://www.youtube.com/@EarningPlaner" className="hover:text-yellow-300 transition duration-300">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                {/* Bottom Section - Copyright */}
                <div className="mt-6 border-t border-gray-500 pt-4 text-center text-gray-300 text-sm">
                    © 2025 <a className="text-yellow-300 hover:underline" href="/">EarnWiz</a>. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
