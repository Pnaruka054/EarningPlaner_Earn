import { Link, useLocation } from "react-router-dom";

const SideMenu = ({ sideMenu_show, setLogOut_btnClicked }) => {
    const location = useLocation(); // Get the current URL

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                e.currentTarget.classList.add("hidden");
                sideMenu_show.setSideMenu_state("menu-outline");
            }}
            className={`
        ${sideMenu_show.sideMenu_state === "close"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[-100%] opacity-0 md:translate-x-0 md:opacity-100"
                } 
        select-none md:block bg-slate-800/90 backdrop-blur-lg shadow-lg absolute z-[2] 
        md:fixed h-[93.3dvh] mt-2 left-0 px-4 py-6 top-12 w-full sm:w-52 md:w-[25%] 
        lg:w-[20%] text-white transition-transform duration-300 ease-in-out
        border-r border-gray-700 overflow-auto custom-scrollbar-sidemenu
      `}
        >
            <h2 className="font-semibold text-gray-300 text-[14px] mb-5 px-2">
                Member Menu
            </h2>

            {/* Main Navigation Section */}
            <div className="space-y-2">
                <NavItem to="/" icon="home-outline" label="Home" currentPath={location.pathname} />
                <NavItem to="/member/profile" icon="person-outline" label="Profile" currentPath={location.pathname} />
                <NavItem to="/member/dashboard" icon="bar-chart-outline" label="Dashboard" currentPath={location.pathname} />
                <NavItem to="/member/withdraw" icon="cash-outline" label="Withdraw" currentPath={location.pathname} />
                <NavItem to="/member/refer-and-earn" icon="person-add-outline" label="Refer & Earn" currentPath={location.pathname} />
                <NavItem to="/member/gift-code" icon="gift-outline" label="GiftCode" currentPath={location.pathname} />
                <NavItem to="/member/view-ads" icon="eye-outline" label="View Ads" currentPath={location.pathname} />
                <NavItem to="/member/click-shorten-link" icon="link-outline" label="Click Short Link" currentPath={location.pathname} />
                <NavItem to="/member/offer-wall" icon="clipboard-outline" label="Offer Walls" currentPath={location.pathname} />
            </div>

            {/* Divider and Support/Logout Section */}
            <div className="mt-6">
                <div className="border-t border-gray-600"></div>
                <div className="pt-4 space-y-2">
                    <NavItem to="/member/support" icon="headset-outline" label="Support" currentPath={location.pathname} />
                    <NavItem to="/member/settings" icon="settings-outline" label="Settings" currentPath={location.pathname} />
                    <button
                        onClick={() => setLogOut_btnClicked(true)}
                        className="flex items-center font-semibold space-x-3 px-3 hover:text-red-300 text-red-500 hover:bg-red-500 hover:bg-opacity-35 py-2 rounded-lg transition-colors duration-300 w-full text-left"
                    >
                        <span className="text-2xl font-bold flex items-center">
                            <ion-icon name="log-out-outline"></ion-icon>
                        </span>
                        <span>LogOut</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Active Menu Item Highlight Logic
const NavItem = ({ to, icon, imgSrc, label, currentPath }) => {
    const isActive = to === "/member/offer-wall" ? currentPath.includes(to) : currentPath === to;

    return (
        <Link
            to={to}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition duration-300 
        ${isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-blue-600/70"}`}
        >
            <span className="text-xl font-bold">
                {imgSrc ? (
                    <img className="w-5 h-5" src={imgSrc} alt="icon" />
                ) : icon.includes("fa-") ? (
                    <i className={icon}></i>
                ) : (
                    <ion-icon name={icon}></ion-icon>
                )}
            </span>
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );
};


export default SideMenu;
