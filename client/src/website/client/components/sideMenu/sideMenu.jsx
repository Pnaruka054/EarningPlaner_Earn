import { Link } from 'react-router-dom';
import Support_icon from '../../../../assets/Support.png'

const SideMenu = ({ sideMenu_show }) => {
    return (
        <div onClick={(e) => {
            e.stopPropagation()
            e.currentTarget.classList.add('hidden')
            sideMenu_show.setSideMenu_state((prev) => prev = 'menu-outline')
        }} className={`${sideMenu_show.sideMenu_state === 'close' ? 'block' : 'hidden'} select-none md:block bg-slate-800 absolute z-[1] md:fixed bottom-0 left-0 px-2 py-4 top-12 w-full sm:w-52 md:w-[25%] lg:w-[20%] text-white`}>
            <Link to="/member/dashboard" className='space-x-1 block px-3 py-2 rounded-lg hover:bg-slate-950'>
                <span className="align-middle">
                    <ion-icon name="bar-chart-outline"></ion-icon>
                </span>
                <span>Dashboard</span>
            </Link>
            <Link to="/member/deposit" className='space-x-1 block px-3 py-2 rounded-lg hover:bg-slate-950'>
                <span className="align-middle">
                    <ion-icon name="card-outline"></ion-icon>
                </span>
                <span>Deposit</span>
            </Link>
            <Link to="/member/withdraw" className='space-x-1 block px-3 py-2 rounded-lg hover:bg-slate-950'>
                <span className="align-middle">
                    <ion-icon name="cash-outline"></ion-icon>
                </span>
                <span>Withdraw</span>
            </Link>
            <Link to="/member/refer-and-earn" className='space-x-1 block px-3 py-2 rounded-lg hover:bg-slate-950'>
                <span className="align-middle">
                    <ion-icon name="person-add-outline"></ion-icon>
                </span>
                <span>Refer & Earn</span>
            </Link>
            <Link to="/member/invoices" className='space-x-1 block px-3 py-2 rounded-lg hover:bg-slate-950'>
                <span className="align-middle">
                    <ion-icon name="document-text-outline"></ion-icon>
                </span>
                <span>Invoices</span>
            </Link>
            <Link to="/member/support" className='space-x-1 block px-3 py-2 rounded-lg hover:bg-slate-950'>
                <span className="align-middle inline-block w-[16px]">
                    <img className='w-full h-full' src={Support_icon} />
                </span>
                <span>Support</span>
            </Link>
        </div>
    );
}

export default SideMenu;
