
const Footer = () => {
    return (
        <div className='w-full bg-blue-600 text-white p-4 justify-center'>
            <div className="flex flex-wrap pt-8 justify-center">
                <ul className="flex flex-wrap space-x-9 justify-center gap-2">
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
