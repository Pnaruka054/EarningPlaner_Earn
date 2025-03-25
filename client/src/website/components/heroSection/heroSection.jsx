import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
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
        <section className="md:min-h-[92.5vh] min-h-[80vh] flex flex-col justify-center items-center text-center px-4 bg-gradient-to-r from-blue-900 via-purple-800 to-blue-900 text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
                Turn <span className="text-yellow-400">Your Time</span> into{' '}
                <span className="text-green-400">Real Earnings</span>!
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl">
                Join <span className="font-semibold text-yellow-400">EarnWiz</span> and start earning today by completing
                simple tasks. <br /> <strong>No investment, no risk</strong> – just <strong>easy rewards & real cash</strong>!
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-500 transition-all duration-300">
                    Start Earning Now
                </Link>
                <a onClick={handleClick} className="bg-transparent cursor-pointer border border-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-900 transition-all duration-300">
                    Learn More
                </a>
            </div>
        </section>
    );
}

export default HeroSection;
