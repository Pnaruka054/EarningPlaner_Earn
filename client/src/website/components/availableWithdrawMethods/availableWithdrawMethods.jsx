import paytm_icon from '../../../assets/Paytm.webp'
import bankTransfer_icon from '../../../assets/BankTransfer.webp'
import upi_icon from '../../../assets/UPI.webp'
import phonePe_icon from '../../../assets/PhonePe.png'
import googlePay_icon from '../../../assets/GooglePay.png'

const AvailableWithdrawMethods = () => {
    
  const paymentMethods = [
    { src: paytm_icon, alt: "Paytm" },
    { src: bankTransfer_icon, alt: "Bank Transfer" },
    { src: upi_icon, alt: "UPI" },
    { src: phonePe_icon, alt: "PhonePe" },
    { src: googlePay_icon, alt: "GooglePay" },
  ];

    return (
        <section className="my-5 mx-2 text-center rounded-md p-4 md:p-8 bg-white shadow-lg border border-gray-300">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 relative inline-block">
                Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Payment Methods</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                We offer a wide range of secure and trusted Indian payment methods, ensuring fast and hassle-free withdrawals.
                Our payment partners provide instant processing, so you get your money when you need it, without delays.
                Choose the best option that suits your needs and enjoy smooth transactions!
            </p>

            {/* Payment Methods Grid */}
            <div className="grid mt-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-center">
                {paymentMethods.map((method, index) => (
                    <div key={index} className="flex flex-col items-center p-5 bg-gray-100 rounded-lg shadow-md transition-all duration-300">
                        <img src={method.src} alt={method.alt} className="h-14 md:h-20 object-contain mb-3" />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AvailableWithdrawMethods;
