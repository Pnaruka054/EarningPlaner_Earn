import Footer from '../components/footer/footer'
import { NavBar_global_context } from "../components/context/navBar_globalContext";
import { useContext } from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
    const { navBar_to_privacyPolicy_dmca_termsOfUse_context_state } = useContext(NavBar_global_context);

    return (
        <>
            <Helmet>
                <title>EarnWiz Privacy Policy</title>
                <meta
                    name="description"
                    content="EarnWiz Privacy Policy: We value your privacy and safeguard your data. Learn how we ensure secure transactions and data protection."
                />
            </Helmet>
            <div className='overflow-auto h-[92.5dvh] custom-scrollbar flex flex-col justify-between'>
                <div dangerouslySetInnerHTML={{ __html: navBar_to_privacyPolicy_dmca_termsOfUse_context_state }} className='container mx-auto p-6 space-y-7'>
                </div>
                <div className='mt-3'>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
