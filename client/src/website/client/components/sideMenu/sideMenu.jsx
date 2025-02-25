import { Link, useLocation } from "react-router-dom";
import Support_icon from "../../../../assets/Support.png";

const SideMenu = ({ sideMenu_show }) => {
    const location = useLocation(); // Get the current URL

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                e.currentTarget.classList.add("hidden");
                sideMenu_show.setSideMenu_state((prev) => (prev = "menu-outline"));
            }}
            className={`
        ${sideMenu_show.sideMenu_state === "close"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[-100%] opacity-0 md:translate-x-0 md:opacity-100"
                } 
        select-none md:block bg-slate-800/90 backdrop-blur-lg shadow-lg absolute z-[2] 
        md:fixed h-[100vh] mt-2 left-0 px-4 py-6 top-12 w-full sm:w-52 md:w-[25%] 
        lg:w-[20%] text-white transition-transform duration-300 ease-in-out
        border-r border-gray-700
      `}
        >
            <h2 className="text-lg font-semibold text-gray-200 mb-5 px-2">
                Member Menu
            </h2>

            <div className="space-y-2">
                <NavItem to="/member/dashboard" icon="bar-chart-outline" label="Dashboard" currentPath={location.pathname} />
                <NavItem to="/member/withdraw" icon="cash-outline" label="Withdraw" currentPath={location.pathname} />
                <NavItem to="/member/refer-and-earn" icon="person-add-outline" label="Refer & Earn" currentPath={location.pathname} />
                <NavItem to="/member/support" imgSrc={Support_icon} label="Support" currentPath={location.pathname} />
                <NavItem to="/member/settings" icon="fa-solid fa-gear" label="Settings" currentPath={location.pathname} />
            </div>
        </div>
    );
};

// ✅ Active Menu Item Highlight Logic ✅
const NavItem = ({ to, icon, imgSrc, label, currentPath }) => {
    const isActive = currentPath === to;

    return (
        <Link
            to={to}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition duration-300 
      ${isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-600/70"}`}
        >
            <span className="text-lg">
                {imgSrc ? (
                    <img className="w-5 h-5" src={imgSrc} alt="icon" />
                ) : icon.includes("fa-") ? (
                    <i className={icon}></i>
                ) : (
                    <ion-icon name={icon}></ion-icon>
                )}
            </span>
            <span className="font-medium">{label}</span>
        </Link>
    );
};

export default SideMenu;
