import React from "react";
import { FaPlayCircle, FaAd, FaLink, FaUsers, FaMoneyBillWave, FaTrophy } from "react-icons/fa";

const Home = () => {
  return (
    <div className="overflow-auto h-[94vh] bg-[#ecf0f5] custom-scrollbar select-none">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-r from-blue-900 via-purple-800 to-blue-900 text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Turn <span className="text-yellow-400">Your Time</span> into{' '}
          <span className="text-green-400">Real Earnings</span>!
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl">
          Join <span className="font-semibold text-yellow-400">EarnWiz</span> and start earning today by completing
          simple tasks. <strong>No investment, no risk</strong> – just <strong>easy rewards & real cash</strong>!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-500 transition-all duration-300">
            Start Earning Now
          </button>
          <button className="bg-transparent border border-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-900 transition-all duration-300">
            Learn More
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <div className="my-5 mx-2 text-center rounded-md py-5 bg-white shadow-md">
        <h2 className="text-4xl font-bold mb-6 text-blue-900">How EarnWiz Works?</h2>
        <p className="text-lg text-gray-700">It’s easy to start earning! Just follow these simple steps:</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
          {[{
            icon: <FaMoneyBillWave className="text-5xl text-green-500 mb-3" />,
            title: "Register",
            desc: "Sign up for free and get started instantly."
          }, {
            icon: <FaTrophy className="text-5xl text-yellow-500 mb-3" />,
            title: "Complete Tasks",
            desc: "Watch ads, play games, and complete offers."
          }, {
            icon: <FaMoneyBillWave className="text-5xl text-green-500 mb-3" />,
            title: "Withdraw Earnings",
            desc: "Cash out via PayPal, bank transfer, or gift cards."
          }].map((item, index) => (
            <div key={index} className="bg-white text-blue-900 p-6 rounded-lg shadow-xl text-center flex flex-col items-center cursor-default">
              {item.icon}
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Earning Methods Section */}
      <div className="my-5 mx-2 text-center rounded-md py-5 bg-white shadow-md">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">Ways to Earn Money</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[{
            icon: <FaAd className="text-5xl mb-3" />,
            title: "Watch Ads",
            desc: "Earn money by watching ads daily.",
            bgColor: "bg-green-500"
          }, {
            icon: <FaPlayCircle className="text-5xl mb-3" />,
            title: "Play Games",
            desc: "Win rewards by playing fun games.",
            bgColor: "bg-blue-500"
          }, {
            icon: <FaLink className="text-5xl mb-3" />,
            title: "Short Links",
            desc: "Complete link tasks to earn instant cash.",
            bgColor: "bg-yellow-500"
          }, {
            icon: <FaUsers className="text-5xl mb-3" />,
            title: "Refer & Earn",
            desc: "Invite friends & earn commission.",
            bgColor: "bg-indigo-500"
          }].map((method, index) => (
            <div key={index} className={`${method.bgColor} p-6 rounded-lg shadow-lg text-center flex flex-col items-center transition-transform transform hover:scale-105 text-white`}>
              {method.icon}
              <h2 className="text-xl font-semibold">{method.title}</h2>
              <p className="text-sm">{method.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;