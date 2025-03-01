import Footer from '../components/footer/footer'
import { NavBar_global_context } from "../components/context/navBar_globalContext";
import { useContext } from 'react';
import { Helmet } from 'react-helmet';

const Terms_of_Use = () => {
    const { navBar_to_privacyPolicy_dmca_termsOfUse_context_state } = useContext(NavBar_global_context);

    return (
        <>
            <Helmet>
                <title>EarnWiz Terms of Use</title>
                <meta name="description" content="EarnWiz Terms of Use: Understand our policies and guidelines for secure and responsible platform usage. Read to know your rights." />
            </Helmet>
            <div className='overflow-auto custom-scrollbar h-[92.5dvh] flex flex-col justify-between'>
                <div dangerouslySetInnerHTML={{ __html: navBar_to_privacyPolicy_dmca_termsOfUse_context_state }} className='container mx-auto p-6 space-y-7'>
                </div>
                <div className='mt-3'>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default Terms_of_Use;
