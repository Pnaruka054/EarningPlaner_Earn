
const Footer = () => {
    return (
        <div className='w-full bg-blue-600 text-white'>
            <div className="flex justify-center pt-8">
                <ul className="flex space-x-9">
                    <li>
                        <a className="underline hover:text-yellow-300" href="">Privacy Policy</a>
                    </li>
                    <li>
                        <a className="underline hover:text-yellow-300" href="">Terms of Use</a>
                    </li>
                    <li>
                        <a className="underline hover:text-yellow-300" href="">DMCA</a>
                    </li>
                    <li>
                        <a className="underline hover:text-yellow-300" href="">Contact Us</a>
                    </li>
                    <li>
                        <a className="underline hover:text-yellow-300" href="">FAQ</a>
                    </li>
                </ul>
            </div>
            <div className="text-center mt-3 pb-3 select-none">Copyright ©<a className="hover:underline" href="/">EarningPlaner</a> 2025</div>
        </div>
    );
}

export default Footer;
