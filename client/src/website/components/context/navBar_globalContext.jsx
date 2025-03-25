import { createContext, useState } from "react";

export const NavBar_global_context = createContext();

// ✅ Provider Component
export const NavBar_global_contextProvider = ({ children }) => {
    const [navBar_global_context_state, setNavBar_global_context_state] = useState([]);
    const [navBar_to_faq_and_homePage_section_context_state, setNavBar_to_faq_and_homePage_section_context_state] = useState(null);
    const [navBar_to_privacyPolicy_dmca_termsOfUse_context_state, setNavBar_to_privacyPolicy_dmca_termsOfUse_context_state] = useState('');

    return (
        <NavBar_global_context.Provider value={
            {
                navBar_global_context_state,
                setNavBar_global_context_state,
                navBar_to_privacyPolicy_dmca_termsOfUse_context_state,
                setNavBar_to_privacyPolicy_dmca_termsOfUse_context_state,
                navBar_to_faq_and_homePage_section_context_state,
                setNavBar_to_faq_and_homePage_section_context_state
            }
        }>
            {children}
        </NavBar_global_context.Provider>
    );
};
