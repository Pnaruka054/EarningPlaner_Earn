import React, { useEffect, useRef, useState } from "react";
import { FaMoneyBillWave, FaTrophy } from "react-icons/fa";
import Footer from "../components/footer/footer";
import HeroSection from "../components/heroSection/heroSection";
import WebStatistics from "../components/webStatistics/webStatistics";
import AvailableWithdrawMethods from "../components/availableWithdrawMethods/availableWithdrawMethods";
import SubscribeOurChannel from "../components/subscribeOurChannel/subscribeOurChannel";
import ContactUs from "../components/contactUs/contactUs";
import FAQs from "../components/FAQs/FAQs";

const Home = () => {
  return (
    <div className="overflow-auto h-[92.5dvh] bg-[#ecf0f5] custom-scrollbar select-none">
      <header>
        <HeroSection />
      </header>
      <main className='md:p-2'>
        <WebStatistics />
        <section className="my-5 mx-2 text-center rounded-md py-5 bg-white shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 relative inline-block">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">EarnWiz</span> Works?
          </h2>
          <p className="text-lg text-gray-700">It’s easy to start earning! Just follow these simple steps:</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 md:px-6 max-w-6xl mx-auto">
            {[
              {
                icon: <FaMoneyBillWave className="text-5xl text-green-500 mb-3" />,
                title: "Register",
                desc: "Sign up for free and get started instantly."
              },
              {
                icon: <FaTrophy className="text-5xl text-yellow-500 mb-3" />,
                title: "Complete Tasks",
                desc: "Watch ads, play games, and complete offers."
              },
              {
                icon: <FaMoneyBillWave className="text-5xl text-green-500 mb-3" />,
                title: "Withdraw Earnings",
                desc: "Cash out via PayPal, bank transfer, or gift cards."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white text-blue-900 p-6 rounded-xl shadow-lg text-center flex flex-col items-center cursor-default border border-transparent 
                 transition-all duration-300 hover:border-blue-500"
                style={{ borderImage: "linear-gradient(to right, #3b82f6, #10b981) 1" }}
              >
                {item.icon}
                <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                <p className="text-base text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto my-6 px-4">
            <ul className="text-lg text-gray-800 text-left space-y-4 inline-block px-6">

              <li className="flex items-center space-x-3">
                <span className="text-blue-600 text-xl"><i className="fas fa-user-plus"></i></span>
                <span><strong>Sign Up for Free:</strong> Create your EarnWiz account in just a few seconds. No complicated forms—just enter your details and start earning instantly.</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-green-600 text-xl"><i className="fas fa-rocket"></i></span>
                <span><strong>Start Earning from Day One:</strong> As soon as you register, you can start earning immediately by completing simple tasks. No waiting, no delays—start today!</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-purple-600 text-xl"><i className="fas fa-tasks"></i></span>
                <span><strong>Explore Earning Opportunities:</strong> Earn money by completing various simple tasks such as watching ads, playing games, taking surveys, click shorten links, direct links and etc.</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-yellow-600 text-xl"><i className="fas fa-calendar-check"></i></span>
                <span><strong>Daily New Tasks:</strong> Get access to fresh earning opportunities every day. The more tasks you complete, the more you earn!</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-red-500 text-xl"><i className="fas fa-users"></i></span>
                <span><strong>Refer & Earn:</strong> Invite your friends to EarnWiz and get a lifetime <strong>5% commission</strong> on their earnings. The more people you refer, the higher your passive income.</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-indigo-500 text-xl"><i className="fas fa-chart-line"></i></span>
                <span><strong>Track Your Progress:</strong> Use our easy-to-navigate dashboard to monitor your earnings, completed tasks, and referral bonuses in real-time.</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-green-500 text-xl"><i className="fas fa-wallet"></i></span>
                <span><strong>Low Payout Threshold:</strong> Unlike other platforms, EarnWiz allows you to withdraw your earnings easily, with different minimum amounts based on your preferred payout method.</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-blue-500 text-xl"><i className="fas fa-lock"></i></span>
                <span><strong>Secure & Reliable Payments:</strong> All transactions are secure, and we ensure timely payouts so you can withdraw your earnings without any hassle.</span>
              </li>

              <li className="flex items-center space-x-3">
                <span className="text-orange-500 text-xl"><i className="fas fa-headset"></i></span>
                <span><strong>24/7 Support:</strong> Have questions or need help? Our dedicated support team is available round the clock to assist you.</span>
              </li>
            </ul>
          </div>
        </section>
        <AvailableWithdrawMethods />
        <SubscribeOurChannel />
        <ContactUs forMember="not_it_is_only_for_home" />
        <FAQs />
      </main>
      <div className='mt-3'>
        <Footer />
      </div>
    </div>
  );
};

export default Home;