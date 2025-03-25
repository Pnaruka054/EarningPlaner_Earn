import React, { useContext } from "react";
import Footer from "../components/footer/footer";
import HeroSection from "../components/heroSection/heroSection";
import WebStatistics from "../components/webStatistics/webStatistics";
import SubscribeOurChannel from "../components/subscribeOurChannel/subscribeOurChannel";
import ContactUs from "../components/contactUs/contactUs";
import FAQs from "../components/FAQs/FAQs";
import { Helmet } from 'react-helmet';
import { NavBar_global_context } from "../components/context/navBar_globalContext";

const Home = () => {
  const { navBar_to_faq_and_homePage_section_context_state } = useContext(NavBar_global_context);
  return (
    <>
      <Helmet>
        <title>EarnWiz Home</title>
        <meta name="description" content="EarnWiz is a modern platform that lets you earn money fast by clicking ads, watching videos, playing games, and taking quizzes. Join now! Get started!" />
      </Helmet>
      <div className="overflow-auto h-[92.5dvh] bg-[#ecf0f5] custom-scrollbar select-none">
        <header>
          <HeroSection />
        </header>
        <main className='md:p-2'>
          <WebStatistics />
          {
            navBar_to_faq_and_homePage_section_context_state?.homepage_section?.map((value, index) => (
              <section key={index} className="my-5 mx-2 text-center rounded-md p-4 md:p-8 bg-white shadow-md">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 relative inline-block" dangerouslySetInnerHTML={{ __html: value?.homepageSection_title }} />
                <div dangerouslySetInnerHTML={{ __html: value?.homepageSection_message }} />
              </section>
            ))
          }
          <SubscribeOurChannel />
          <ContactUs forMember="not_it_is_only_for_home" />
          <FAQs />
        </main>
        <div className='mt-3'>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;