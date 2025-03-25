import { useState, useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
import { NavBar_global_context } from "../context/navBar_globalContext";

const FAQs = () => {
    const { navBar_to_faq_and_homePage_section_context_state } = useContext(NavBar_global_context);

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    
    return (
        <section id="FAQs" className="mt-5 mx-2 md:p-8">
            {/* Section Title */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-700">Frequently Asked Questions</h2>
                <p className="text-gray-500 text-lg">Your most common questions answered!</p>
            </div>

            {/* FAQs Box */}
            <div className="mx-auto">
                {navBar_to_faq_and_homePage_section_context_state && Array.from(navBar_to_faq_and_homePage_section_context_state?.faq).map((faq, index) => (
                    <div key={index} className="mb-4">
                        {/* Question Box */}
                        <button
                            className="flex justify-between items-center w-full px-5 py-4 text-lg font-semibold text-left bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={() => toggleFAQ(index)}
                        >
                            {faq.faqQuestioin}
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
                                <p className="text-gray-700">{faq.faqAnswer}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FAQs;
