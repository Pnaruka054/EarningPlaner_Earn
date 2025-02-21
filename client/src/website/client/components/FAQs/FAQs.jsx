import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQs = () => {
    const faqsData = [
        {
            question: "What is linksfire.co?",
            answer: `LINKSFIRE© is one of the best URL shortener websites in the world 
            from which you can earn a lot of money very easily. LINKSFIRE© website was created in 2021 
            by SWD Family team, It is a very popular or trusted team trusted by many users (Best, Trusted & Verified).`
        },
        {
            question: "How to Work and Use LINKSFIRE©?",
            answer: `So let's see how it works and how to use it,
            It's just three steps to Start:
            1️⃣ Create Your free Account  
            2️⃣ Shorten Your Links  
            3️⃣ Share it With Your Audience`,
        },
        {
            question: "How much eCPM Provide?",
            answer: `LINKSFIRE© provides the highest eCPM Rate for Worldwide users. 
            If you can bring 5k clicks every day, then $15 Fixed eCPM will be given.`,
        },
        {
            question: "Payment frequency?",
            answer: `You only need to complete $2 to Get your Withdrawal. 
            We usually pay Daily, and if there is any technical problem then we pay twice a month.`,
        },
        {
            question: "How much click count per IP?",
            answer: `We count one click per IP every 24 hours. This is to prevent self-clicking and bot traffic.`,
        },
        {
            question: "Why many users choose us?",
            answer: `We provide features that other websites don't, like:
            - Highest eCPM
            - No Captcha
            - Easy Payout (only $2)
            - 24x7 Live Support`
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (
        <section id="FAQs" className="mt-5 mx-2 p-8">
            {/* Section Title */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-700">Frequently Asked Questions</h2>
                <p className="text-gray-500 text-lg">Your most common questions answered!</p>
            </div>

            {/* FAQs Box */}
            <div className="mx-auto">
                {faqsData.map((faq, index) => (
                    <div key={index} className="mb-4">
                        {/* Question Box */}
                        <button
                            className="flex justify-between items-center w-full px-5 py-4 text-lg font-semibold text-left bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={() => toggleFAQ(index)}
                        >
                            {faq.question}
                            <FaChevronDown
                                className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </button>

                        {/* Answer Box with Smooth Animation */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
                                }`}
                        >
                            <div className="p-5 bg-white border-l-4 border-blue-600 rounded-md shadow-md">
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FAQs;
