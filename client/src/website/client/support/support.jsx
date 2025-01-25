import ContactUs from "../components/contactUs/contactUs";
import Footer from "../components/footer/footer"

const Support = () => {
    return (
        <div className='ml-auto bg-[#ecf0f5] flex flex-col justify-between select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12'>
            <div className="py-5">
                <ContactUs style="d-none" />
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    )
}

export default Support;
