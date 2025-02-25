import { Link } from 'react-router-dom';
import Footer from '../components/footer/footer'

const Terms_of_Use = () => {
    return (
        <div className='overflow-auto h-[92.5dvh] flex flex-col justify-between'>
            <div className='container mx-auto p-6 space-y-7'>
                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Introduction</h2>
                    <p className="text-gray-700 mt-2">
                        Welcome to EarnWiz. These Terms of Use govern your access to and use of our website, services, and features.
                        By accessing or using EarnWiz, you agree to comply with these terms. If you do not agree with any part of
                        these terms, you must discontinue using our platform immediately.
                    </p>
                    <p className="text-gray-700 mt-2">
                        EarnWiz provides users with opportunities to earn money through various methods, including investment-based
                        earning options and non-investment earning opportunities. Our goal is to offer a secure and transparent
                        platform that ensures a smooth and rewarding experience for all users.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Please read these Terms of Use carefully before using EarnWiz. We reserve the right to modify or update
                        these terms at any time without prior notice. Your continued use of the platform after changes are made
                        constitutes your acceptance of the updated terms.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Eligibility</h2>
                    <p className="text-gray-700 mt-2">
                        To use EarnWiz, you must be at least 18 years old or the legal age of majority in your country. By registering
                        on our platform, you confirm that you meet this requirement. If you are under the required age, you are not
                        permitted to use our services.
                    </p>
                    <p className="text-gray-700 mt-2">
                        By creating an account, you also confirm that you have the legal capacity to enter into a binding contract
                        under applicable laws. If you are using EarnWiz on behalf of a business or other entity, you represent that
                        you have the authority to accept these terms on their behalf.
                    </p>
                    <p className="text-gray-700 mt-2">
                        We reserve the right to suspend or terminate accounts that are found to be in violation of our eligibility
                        requirements. If we discover that an account has been created by an ineligible user, we may remove the account
                        and any associated earnings without prior notice.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Account Registration & Security</h2>
                    <p className="text-gray-700 mt-2">
                        To access and use certain features of EarnWiz, users must create an account by providing accurate and complete
                        information, including a valid mobile number, email ID, and password. You are responsible for maintaining the
                        confidentiality of your account credentials and agree not to share them with others. Any activity occurring
                        under your account will be considered your responsibility.
                    </p>
                    <p className="text-gray-700 mt-2">
                        EarnWiz reserves the right to suspend or terminate accounts that provide false information, engage in fraudulent
                        activities, or violate our terms and conditions. Users must also update their information when necessary to
                        ensure accuracy and security. If you suspect unauthorized access to your account, you must notify us
                        immediately to take corrective action.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Earnings & Withdrawals</h2>
                    <p className="text-gray-700 mt-2">
                        EarnWiz provides users multiple ways to earn money, including both investment-based and non-investment methods.
                        Users can participate in activities such as ads viewing, completing short link processes, playing ad-based games,
                        quizzes, and more. Those who choose investment-based earnings can deposit funds to participate in pools,
                        trading, and other earning opportunities provided on the platform.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Withdrawals are processed only after users meet the minimum withdrawal threshold set by EarnWiz.
                        To initiate a withdrawal, users must provide complete and accurate account details, including name,
                        address, area pin code, withdrawal account information, state, and city.
                        All withdrawals are subject to verification, and EarnWiz reserves the right to decline any withdrawal
                        request if suspicious activity is detected.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Processing times for withdrawals may vary based on the selected payment method.
                        While EarnWiz strives to process payments promptly, delays may occur due to banking or third-party payment provider policies.
                        Users are responsible for ensuring that the details provided for withdrawal are correct; EarnWiz is not liable for losses
                        due to incorrect information submitted by the user.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Investment & Risk Disclosure</h2>
                    <p className="text-gray-700 mt-2">
                        EarnWiz provides users with opportunities to earn through both investment-based and non-investment-based methods.
                        However, all investment activities come with inherent risks. Users who choose to invest in pools, trading, or games
                        should carefully evaluate their financial situation before making any deposits.
                    </p>
                    <p className="text-gray-700 mt-2">
                        The platform does not guarantee fixed returns on any investment, as earnings may vary due to market fluctuations,
                        demand, and other external factors. Users acknowledge that any funds deposited into their EarnWiz account for investment
                        purposes are at their own risk. The company shall not be held responsible for any financial losses incurred.
                    </p>
                    <p className="text-gray-700 mt-2">
                        By participating in investment-based activities on EarnWiz, users confirm that they fully understand the risks involved
                        and agree that EarnWiz is not liable for any potential losses or changes in earnings.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">User Responsibilities</h2>
                    <p className="text-gray-700 mt-2">
                        As a registered user of EarnWiz, you are responsible for maintaining the security and confidentiality of your account credentials.
                        You agree not to share your account details with others and to notify us immediately in case of any unauthorized access or security breach.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Users must provide accurate and complete information when registering and updating their account details. Any attempt to provide false
                        or misleading information may result in the suspension or termination of your account.
                    </p>
                    <p className="text-gray-700 mt-2">
                        You are solely responsible for all activities performed under your account, including transactions, interactions, and any misuse of
                        services. EarnWiz will not be liable for any losses incurred due to negligence or failure to secure your account.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Users must comply with all applicable laws and regulations while using EarnWiz. Engaging in fraudulent activities, spamming, hacking,
                        or any other malicious behavior is strictly prohibited and may lead to legal action.
                    </p>
                    <p className="text-gray-700 mt-2">
                        EarnWiz reserves the right to monitor user activities to ensure compliance with our Terms of Use. If any suspicious or unauthorized
                        activity is detected, we may take necessary action, including limiting, suspending, or permanently disabling your account.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Prohibited Activities</h2>
                    <p className="text-gray-700 mt-2">
                        While using EarnWiz, users must adhere to ethical and legal standards. The following activities are strictly prohibited on our platform:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Engaging in fraudulent activities, including fake referrals, bot traffic, or automated clicks.</li>
                        <li>Creating multiple accounts to manipulate the system for unfair advantages.</li>
                        <li>Using VPNs, proxies, or other anonymizing techniques to bypass security measures.</li>
                        <li>Attempting to hack, modify, or interfere with the website’s functionality.</li>
                        <li>Distributing or promoting harmful, offensive, or illegal content through the platform.</li>
                        <li>Misusing referral programs or any other earning methods in a deceptive manner.</li>
                        <li>Attempting chargebacks or unauthorized withdrawals after earning or depositing funds.</li>
                        <li>Any activity that violates local, national, or international laws.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Violating these policies may result in temporary suspension, permanent account termination, or legal actions. EarnWiz reserves the right to investigate any suspicious activity and take appropriate measures to ensure a fair and secure environment for all users.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Data Collection & Privacy</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we take user data privacy seriously. When you register on our platform, we collect essential details such as your mobile number, email ID, and password. Additionally, if you choose to complete your profile, we may collect your name, address, area pin code, withdrawal account information, state, and city. These details are securely stored in our database and are used only for account management, transaction processing, and withdrawal verification.
                    </p>
                    <p className="text-gray-700 mt-2">
                        While we do not sell user data, our database provider may have its own policies regarding data handling. However, we ensure that user data is not misused for instant promotions, spam, or unnecessary newsletters. We may use your contact information for critical updates related to security, policy changes, or account-related notifications. Additionally, if you contact us via our support form, your email ID and mobile number may be stored for future communication and marketing purposes.
                    </p>
                    <p className="text-gray-700 mt-2">
                        By using EarnWiz, you agree to our data collection practices. If you have any concerns about your data privacy, you may contact us to request information about the data we hold and how it is used.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Termination & Suspension</h2>
                    <p className="text-gray-700 mt-2">
                        EarnWiz reserves the right to suspend or terminate your account at any time, with or without notice, if you violate our terms, engage in fraudulent activities, or misuse our platform in any manner.
                    </p>
                    <p className="text-gray-700 mt-2">
                        If your account is suspended, you may not be able to access your earnings, referral bonuses, or any other benefits associated with your account. In cases of severe violations, we may also take legal action or report the matter to relevant authorities.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Limitation of Liability</h2>
                    <p className="text-gray-700 mt-2">
                        EarnWiz, its affiliates, partners, and employees shall not be liable for any direct, indirect, incidental, consequential, or exemplary damages that may arise from the use or inability to use our services. This includes, but is not limited to, financial losses, data breaches, service interruptions, or any other unforeseen circumstances.
                    </p>
                    <p className="text-gray-700 mt-2">
                        While we strive to ensure that our platform is secure and reliable, we do not guarantee uninterrupted access or error-free functionality. Users acknowledge that they are solely responsible for any risks associated with using EarnWiz and that we shall not be held accountable for any losses resulting from investment decisions, advertisements, or third-party interactions on the platform.
                    </p>
                    <p className="text-gray-700 mt-2">
                        In jurisdictions where the exclusion of liability is not permitted, our liability shall be limited to the maximum extent allowed by law. By using EarnWiz, you agree to these limitations and acknowledge that our platform is provided "as is" without any warranties of any kind.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Modification of Terms</h2>
                    <p className="text-gray-700 mt-2">
                        EarnWiz reserves the right to modify, update, or revise these Terms of Use at any time without prior notice.
                        Any changes made will be effective immediately upon posting on our website. It is the responsibility of users
                        to regularly review the Terms to stay informed about any updates. Continued use of EarnWiz after modifications
                        signifies your acceptance of the revised terms.
                    </p>
                    <p className="text-gray-700 mt-2">
                        If any significant changes are made that may impact your rights or obligations, we may notify you through
                        email or a prominent notice on our platform. However, it remains the user's duty to ensure they are aware of
                        the latest terms governing their use of EarnWiz.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Contact Information</h2>
                    <p className="text-gray-700 mt-2">
                        If you have any questions or concerns regarding our Terms of Use or any aspect of EarnWiz, you can contact us through the following method:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Email: <a href="mailto:support@earnwiz.in" className="text-blue-600 hover:underline">support@earnwiz.in</a></li>
                        <li>
                            Alternatively, you can reach out to us by filling out the <Link to="/contact-us" className="text-blue-600 hover:underline">Contact Us form</Link> available on our website. We aim to respond to all inquiries within 24-48 business hours.
                        </li>
                    </ul>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
};

export default Terms_of_Use;
