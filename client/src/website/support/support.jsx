import ContactUs from "../components/contactUs/contactUs";
import Footer from "../components/footer/footer"
import { Helmet } from 'react-helmet';

const Support = () => {
    return (
        <>
            <Helmet>
                <title>EarnWiz Support</title>
                <meta name="description" content="Need help? EarnWiz Support offers assistance, FAQs, and troubleshooting guides to ensure you have a smooth experience on our platform." />
            </Helmet>
            <div className="py-5">
                <ContactUs />
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </>
    )
}

export default Support;
