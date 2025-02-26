import { createContext, useState } from "react";

// ✅ Context Create Karo
export const Faq_navBar_context = createContext();

// ✅ Provider Component
export const Faq_navBar_contextProvider = ({ children }) => {
    // WebStatistics ka state
    const [faq_navBar_context_state, setFaq_navBar_context] = useState([]);

    return (
        <Faq_navBar_context.Provider value={{ faq_navBar_context_state, setFaq_navBar_context }}>
            {children}
        </Faq_navBar_context.Provider>
    );
};
