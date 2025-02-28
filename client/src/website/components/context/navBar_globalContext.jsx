import { createContext, useState } from "react";

export const NavBar_global_context = createContext();

// ✅ Provider Component
export const NavBar_global_contextProvider = ({ children }) => {
    // WebStatistics ka state
    const [navBar_global_context_state, setNavBar_global_context_state] = useState([]);

    return (
        <NavBar_global_context.Provider value={{ navBar_global_context_state, setNavBar_global_context_state }}>
            {children}
        </NavBar_global_context.Provider>
    );
};
