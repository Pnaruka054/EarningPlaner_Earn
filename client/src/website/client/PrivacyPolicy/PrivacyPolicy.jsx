import { Link } from 'react-router-dom';
import Footer from '../components/footer/footer'

const PrivacyPolicy = () => {
    return (
        <div className='overflow-auto h-[92.5dvh] flex flex-col justify-between'>
            <div className='container mx-auto p-6 space-y-7'>
                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Introduction</h2>
                    <p className="text-gray-700 mt-2">
                        Welcome to EarnWiz. Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you agree to the terms outlined in this policy.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Information We Collect</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we collect various types of user data to ensure seamless functionality, enhance user experience, and maintain platform security. The information we collect allows us to offer personalized services, improve system performance, and comply with legal and regulatory requirements. Below is a detailed breakdown of the types of data we collect from users:
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Personal Information</h3>
                    <p className="text-gray-700 mt-2">
                        When users sign up on our platform, they are required to provide basic details such as their <strong>mobile number, email ID, password, and confirmation password</strong>. This information is stored securely in our database and is used for authentication purposes, account security, and communication regarding account-related activities. Users also have the option to update their profile with additional details; however, certain information becomes mandatory when a user requests a withdrawal.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Financial Information</h3>
                    <p className="text-gray-700 mt-2">
                        EarnWiz provides both investment-based and non-investment earning opportunities. If a user chooses to invest, we collect and store relevant transaction details such as <strong>deposit amount, transaction ID, and payment method</strong>. For withdrawals, users must provide complete banking or e-wallet details, including <strong>full name, residential address, area pin code, bank details or wallet ID, state, and city</strong>. This financial information is crucial for processing user payouts securely and ensuring compliance with financial regulations.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Usage and Activity Data</h3>
                    <p className="text-gray-700 mt-2">
                        To improve our services and optimize user engagement, EarnWiz monitors user activities on the platform. We collect information about:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>How users interact with <strong>advertisements</strong>, including the number of ads viewed and clicked.</li>
                        <li>Participation in <strong>ad-based games, quizzes, and reward programs</strong>.</li>
                        <li>Performance in different <strong>earning tasks and competitions</strong>.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        This data is collected to analyze user preferences, detect fraudulent activities, and enhance platform performance.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Communication Data</h3>
                    <p className="text-gray-700 mt-2">
                        If a user reaches out to us via our contact form or support channels, we collect their <strong>email ID and mobile number</strong>. This data may be used for sending updates, important notifications, or marketing purposes. However, EarnWiz ensures that no unnecessary promotional messages are sent unless there is a significant update that requires user attention. Users have the option to opt out of marketing communications at any time.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Automated Data Collection</h3>
                    <p className="text-gray-700 mt-2">
                        In addition to user-provided information, our system may automatically collect certain data through cookies and tracking technologies. This includes <strong>IP addresses, browser type, device information, and login timestamps</strong>. Such data helps us enhance security, prevent unauthorized access, and ensure a smooth browsing experience for users.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">How We Use Your Information</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we utilize the information collected from users to enhance the platform's functionality, provide personalized experiences, and ensure compliance with legal regulations. The data collected serves multiple purposes, ranging from account management to security enhancement and marketing strategies. Below is a detailed breakdown of how we use the collected information.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Account Creation and Authentication</h3>
                    <p className="text-gray-700 mt-2">
                        When users sign up on EarnWiz, the information they provide, such as their <strong>mobile number, email ID, and password</strong>, is used to create and authenticate their accounts. This ensures secure access to the platform and prevents unauthorized logins. Users can reset their passwords using their registered email or mobile number, further enhancing account security.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Processing Transactions and Withdrawals</h3>
                    <p className="text-gray-700 mt-2">
                        For users who invest or withdraw earnings, we utilize their <strong>financial details, including deposit transactions, wallet IDs, and bank account information</strong>, to process payments securely. EarnWiz ensures that all financial transactions are encrypted and handled with the utmost security to prevent fraudulent activities.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Improving User Experience</h3>
                    <p className="text-gray-700 mt-2">
                        The information collected from user activities, such as <strong>ad views, clicks, participation in games, and engagement with different earning programs</strong>, helps us analyze platform trends. By understanding user behavior, we can optimize the platform to provide a more engaging and rewarding experience.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Security and Fraud Prevention</h3>
                    <p className="text-gray-700 mt-2">
                        To ensure a safe and fair earning environment, EarnWiz actively monitors user data for suspicious activities. The system automatically tracks <strong>IP addresses, login patterns, and device information</strong> to detect and prevent fraudulent activities, unauthorized access, and policy violations.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Legal Compliance</h3>
                    <p className="text-gray-700 mt-2">
                        We may use user data to comply with legal obligations, regulatory requirements, and law enforcement requests. This includes <strong>verifying user identities, preventing money laundering, and ensuring tax compliance</strong> where applicable.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">6. Customer Support and Communication</h3>
                    <p className="text-gray-700 mt-2">
                        If a user reaches out to us via our <strong>contact form or customer support</strong>, their provided information is used to address queries, resolve issues, and improve our services. We may also notify users about important platform updates, security alerts, or policy changes through email or SMS.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">7. Marketing and Promotional Activities</h3>
                    <p className="text-gray-700 mt-2">
                        EarnWiz may use user-provided email IDs and phone numbers for occasional <strong>promotional campaigns, newsletters, and special offers</strong>. However, we respect user privacy and do not send excessive marketing messages. Users can opt out of promotional communications at any time.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Data Sharing and Disclosure</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we value your privacy and take data security seriously. We do not sell or trade user information for commercial purposes. However, in certain circumstances, we may share your data with third parties to enhance our services, comply with legal obligations, or protect our platform from fraudulent activities. Below are the specific scenarios where data sharing may occur.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Third-Party Service Providers</h3>
                    <p className="text-gray-700 mt-2">
                        We collaborate with third-party service providers for various functions such as <strong>payment processing, cloud storage, analytics, fraud detection, and customer support</strong>. These partners only receive the necessary data required to perform their services and are contractually bound to protect user privacy.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Legal and Regulatory Requirements</h3>
                    <p className="text-gray-700 mt-2">
                        We may disclose user information when required by law, such as in response to <strong>court orders, subpoenas, or law enforcement requests</strong>. This includes situations where data sharing is necessary to comply with financial regulations, anti-money laundering laws, or government policies.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Fraud Prevention and Security Measures</h3>
                    <p className="text-gray-700 mt-2">
                        To maintain the integrity of our platform, EarnWiz may share relevant user data with <strong>security agencies, fraud prevention networks, and cybersecurity firms</strong>. This helps us identify and prevent unauthorized activities such as account hacking, fraudulent withdrawals, or other policy violations.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Marketing and Advertising Partners</h3>
                    <p className="text-gray-700 mt-2">
                        We may collaborate with marketing partners for <strong>advertising and promotional campaigns</strong>. While user data is never sold, anonymized and aggregated information may be shared with advertisers to improve ad targeting and enhance the overall ad experience on our platform.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Business Transfers and Mergers</h3>
                    <p className="text-gray-700 mt-2">
                        If EarnWiz undergoes a <strong>merger, acquisition, or asset sale</strong>, user information may be transferred to the new entity as part of the business transition. In such cases, we will ensure that the new organization follows the same privacy standards as outlined in this policy.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">6. With User Consent</h3>
                    <p className="text-gray-700 mt-2">
                        In certain cases, we may request <strong>explicit user consent</strong> before sharing their data with third parties. Users will have the option to opt-in or opt-out of such sharing arrangements based on their preferences.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">7. Anonymous Data Sharing</h3>
                    <p className="text-gray-700 mt-2">
                        We may share <strong>de-identified or aggregated data</strong> (which does not personally identify users) for statistical analysis, research, or industry benchmarking purposes. Such data helps us improve our platform and enhance user experiences without compromising personal privacy.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Data Security Measures</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we prioritize the security of your personal information and implement industry-standard measures to protect your data from unauthorized access, alteration, disclosure, or destruction. Our security infrastructure is designed to safeguard user information against cyber threats, fraudulent activities, and data breaches.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Secure Data Encryption</h3>
                    <p className="text-gray-700 mt-2">
                        All sensitive data, including login credentials and financial details, are encrypted using <strong>Advanced Encryption Standard (AES-256)</strong>. This ensures that user information remains unreadable to unauthorized parties even in case of a data breach.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Secure Socket Layer (SSL) Technology</h3>
                    <p className="text-gray-700 mt-2">
                        We use <strong>SSL (Secure Socket Layer) and HTTPS encryption</strong> to establish a secure connection between users and our servers. This prevents data interception by hackers and ensures the confidentiality of all interactions on our platform.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Firewalls and Intrusion Detection Systems</h3>
                    <p className="text-gray-700 mt-2">
                        Our servers are protected by <strong>advanced firewalls and Intrusion Detection Systems (IDS)</strong>, which monitor network traffic and detect potential security threats in real time. Any suspicious activity is automatically flagged and mitigated to prevent unauthorized access.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Two-Factor Authentication (2FA)</h3>
                    <p className="text-gray-700 mt-2">
                        To enhance account security, EarnWiz offers <strong>Two-Factor Authentication (2FA)</strong>, requiring users to verify their identity using a secondary authentication method, such as OTP (One-Time Password) via email or SMS.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Access Control and User Authentication</h3>
                    <p className="text-gray-700 mt-2">
                        Our system enforces <strong>strict access control policies</strong>, ensuring that only authorized personnel have access to user data. Employees handling sensitive information undergo security training and adhere to confidentiality agreements.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">6. Regular Security Audits and Penetration Testing</h3>
                    <p className="text-gray-700 mt-2">
                        We conduct <strong>regular security audits and penetration testing</strong> to identify vulnerabilities and enhance our defenses against cyber threats. Our security team continuously monitors potential risks and applies updates to mitigate them.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">7. Data Retention and Secure Deletion</h3>
                    <p className="text-gray-700 mt-2">
                        User data is stored only for as long as necessary to fulfill legal, regulatory, or business obligations. Upon request, personal data can be permanently deleted from our system using <strong>secure data wiping techniques</strong> to prevent any recovery.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">8. Fraud Prevention and Account Monitoring</h3>
                    <p className="text-gray-700 mt-2">
                        We utilize AI-driven <strong>fraud detection algorithms</strong> and account monitoring tools to detect suspicious behavior, such as unauthorized withdrawals, account takeovers, or unusual login attempts. If any irregular activity is detected, immediate action is taken to secure the affected account.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">9. User Responsibility and Best Practices</h3>
                    <p className="text-gray-700 mt-2">
                        While we take robust security measures, users are also encouraged to follow best practices such as <strong>using strong passwords, enabling 2FA, avoiding phishing scams, and keeping their devices secure</strong>. EarnWiz will never ask for sensitive information via email or messages.
                    </p>

                    <p className="text-gray-700 mt-4">
                        By implementing these security measures, we ensure that your personal and financial information remains protected at all times. If you have any security concerns or suspect unauthorized access to your account, please contact our support team immediately.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">User Rights and Data Control</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we believe in transparency and give users full control over their personal data. As a user, you have certain rights regarding the collection, usage, and management of your information. Below, we outline the key rights you have concerning your personal data and how you can exercise them.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Right to Access</h3>
                    <p className="text-gray-700 mt-2">
                        You have the right to request access to your personal data stored by EarnWiz. Upon verification, we will provide a detailed summary of the information we hold about you, including account details, transaction history, and any associated activities.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Right to Update and Correct Information</h3>
                    <p className="text-gray-700 mt-2">
                        If any of your personal details (such as name, address, or withdrawal information) are incorrect or outdated, you have the right to update or correct them through your profile settings. In cases where automated updates are not possible, you may request modifications by contacting our support team.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Right to Data Portability</h3>
                    <p className="text-gray-700 mt-2">
                        You can request a copy of your personal data in a structured, commonly used, and machine-readable format. If you wish to transfer your data to another platform or service, we will provide the necessary export files upon request.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Right to Delete Your Data (Right to be Forgotten)</h3>
                    <p className="text-gray-700 mt-2">
                        If you no longer wish to use EarnWiz, you have the right to request the deletion of your personal data from our systems. Once the deletion request is approved, all associated data, including profile information, earnings history, and withdrawal details, will be permanently removed. However, we may retain certain records for legal and compliance purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Right to Restrict Processing</h3>
                    <p className="text-gray-700 mt-2">
                        If you believe that your data is being used in an unauthorized manner or for a purpose you did not consent to, you can request to restrict the processing of your personal information. In such cases, we will pause data usage until the matter is resolved.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">6. Right to Object to Marketing and Promotions</h3>
                    <p className="text-gray-700 mt-2">
                        You can opt-out of receiving marketing emails, promotional messages, or advertisements at any time. This can be done through your account settings or by clicking the "unsubscribe" link provided in promotional emails. Note that even if you opt out, we may still send you essential service notifications and updates.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">7. Right to Withdraw Consent</h3>
                    <p className="text-gray-700 mt-2">
                        If you previously provided consent for data collection and usage but wish to withdraw it, you may do so at any time. This may affect certain functionalities of the platform, including the ability to earn and withdraw funds.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">8. Right to File a Complaint</h3>
                    <p className="text-gray-700 mt-2">
                        If you feel that your data rights are being violated, you have the right to file a complaint with the relevant data protection authority. We encourage users to reach out to our support team first so we can address any concerns directly.
                    </p>

                    <p className="text-gray-700 mt-4">
                        At EarnWiz, we respect and uphold all user rights related to personal data. If you wish to exercise any of these rights or have questions regarding your data, please contact our privacy team at <a href="mailto:support@earnwiz.com" className="text-blue-500">support@earnwiz.com</a>.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Data Storage & Security</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we prioritize the security and confidentiality of user data. We implement industry-standard security measures to ensure that all personal and financial information provided by users remains protected against unauthorized access, misuse, or breaches. Below is a detailed overview of how we store and safeguard user data.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Secure Data Storage</h3>
                    <p className="text-gray-700 mt-2">
                        All user data, including personal details, financial information, and activity logs, is stored on secure servers with multiple layers of encryption. Our databases are designed with advanced security configurations to prevent unauthorized access. We utilize:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li><strong>Encrypted Databases:</strong> User data is stored using strong encryption algorithms, ensuring that sensitive details remain protected at all times.</li>
                        <li><strong>Firewalls & Intrusion Detection:</strong> Our systems are safeguarded with firewalls and real-time intrusion detection mechanisms to monitor and prevent potential threats.</li>
                        <li><strong>Restricted Access:</strong> Only authorized personnel with valid security credentials have access to user information, reducing the risk of data leaks.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Data Encryption & Transmission Security</h3>
                    <p className="text-gray-700 mt-2">
                        EarnWiz ensures that all sensitive information transmitted between users and our servers is encrypted using Secure Socket Layer (SSL) technology. This protects data from interception by unauthorized entities and provides a secure browsing experience for users.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li><strong>SSL Encryption:</strong> All communications, including login credentials, withdrawal requests, and payment transactions, are secured using 256-bit SSL encryption.</li>
                        <li><strong>Data Masking:</strong> Sensitive details such as passwords and financial information are stored in a masked format to prevent unauthorized visibility.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Data Retention Policy</h3>
                    <p className="text-gray-700 mt-2">
                        We retain user data for as long as necessary to fulfill legal obligations, facilitate withdrawals, resolve disputes, and enforce our policies. The duration of data storage depends on several factors, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li><strong>Account Activity:</strong> Active user accounts have their data securely stored to ensure uninterrupted access to our services.</li>
                        <li><strong>Inactive Accounts:</strong> If a user does not engage with the platform for an extended period, certain non-essential data may be anonymized or deleted.</li>
                        <li><strong>Legal & Compliance Requirements:</strong> Some financial and personal data may be retained to comply with taxation, anti-fraud, and regulatory policies.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Protection Against Data Breaches</h3>
                    <p className="text-gray-700 mt-2">
                        We take proactive steps to prevent data breaches and unauthorized access to user information. Our security measures include:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li><strong>Regular Security Audits:</strong> We conduct periodic security checks and vulnerability assessments to identify and fix potential risks.</li>
                        <li><strong>Two-Factor Authentication (2FA):</strong> Users may be required to verify their identity using an additional authentication method during login or withdrawals.</li>
                        <li><strong>Automated Threat Detection:</strong> Our system monitors for suspicious activities and immediately blocks any unauthorized access attempts.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Third-Party Data Handling</h3>
                    <p className="text-gray-700 mt-2">
                        While EarnWiz does not directly sell user data, we use third-party services for certain platform functionalities such as payment processing and advertisement tracking. These third-party providers adhere to strict data protection policies and are legally bound to maintain the confidentiality of user information.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">6. User Responsibility & Security Best Practices</h3>
                    <p className="text-gray-700 mt-2">
                        While we take every measure to protect user data, we also encourage users to follow security best practices, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li><strong>Using Strong Passwords:</strong> Choose a complex password and avoid sharing it with anyone.</li>
                        <li><strong>Avoiding Phishing Attempts:</strong> Be cautious of emails or messages asking for login credentials or financial details.</li>
                        <li><strong>Regularly Updating Account Information:</strong> Keep contact details and security preferences up to date to prevent unauthorized access.</li>
                    </ul>

                    <p className="text-gray-700 mt-2">
                        If you suspect any unauthorized access to your account, please contact our support team immediately so that we can take necessary actions to protect your data.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Marketing & Promotional Use</h2>

                    <p className="text-gray-700 mt-2">
                        EarnWiz values user privacy while also striving to provide the best possible experience through targeted marketing and promotional activities. As part of our engagement strategy, we may use certain user-provided data to inform users about new features, promotional offers, and exclusive earning opportunities. However, we ensure that all marketing communications remain relevant, non-intrusive, and in compliance with data protection regulations.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Use of Personal Information for Marketing</h3>
                    <p className="text-gray-700 mt-2">
                        We may utilize user information, including <strong>email address, mobile number, and account activity</strong>, to send promotional content such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Special bonus offers and limited-time earning campaigns.</li>
                        <li>Announcements about new investment opportunities or non-investment earning methods.</li>
                        <li>Personalized recommendations based on user interests and activity.</li>
                        <li>Exclusive partner promotions and third-party deals relevant to our users.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Our promotional messages will be designed to enhance user experience rather than disrupt it. Users always have the option to manage their marketing preferences.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Contact Form and Newsletter Subscriptions</h3>
                    <p className="text-gray-700 mt-2">
                        If a user reaches out via our <strong>contact form</strong>, their email and mobile number may be stored for future communication, including important updates and promotional newsletters. Users who subscribe to our newsletters will receive periodic updates regarding:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Changes in platform policies or new earning features.</li>
                        <li>Updates about withdrawal processes, rewards, and security enhancements.</li>
                        <li>Industry insights, money-making tips, and investment strategies.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Users can opt out of newsletters at any time by clicking the "unsubscribe" link provided in emails or adjusting notification settings in their account.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Third-Party Marketing & Advertising</h3>
                    <p className="text-gray-700 mt-2">
                        EarnWiz may collaborate with third-party advertisers and affiliate partners to present relevant offers to users. While we do not directly sell user data, we may share <strong>non-personally identifiable information</strong> with advertising partners for campaign optimization. This could include:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Ad engagement metrics and anonymous behavioral trends.</li>
                        <li>General demographic information such as location (city/state level).</li>
                        <li>Preferred earning methods to tailor promotional content.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Users will always have control over their participation in such marketing activities and can modify their ad preferences through account settings.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Protection Against Unwanted Marketing</h3>
                    <p className="text-gray-700 mt-2">
                        EarnWiz strictly avoids spam and excessive promotional messaging. We follow industry best practices to ensure that users receive only essential or beneficial communications. Furthermore:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>We do not send promotional messages without user consent.</li>
                        <li>Users can manage or disable marketing preferences at any time.</li>
                        <li>No user financial information is ever shared with advertisers.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Our goal is to maintain transparency and allow users to have complete control over how their information is used for marketing purposes.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Third-Party Sharing</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we prioritize user data security and ensure that personal information is handled with the highest level of confidentiality. However, in certain circumstances, we may share user data with third-party entities to enhance platform functionality, improve services, and comply with legal obligations. Below are the different ways in which user data may be shared with third parties:
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Payment and Financial Partners</h3>
                    <p className="text-gray-700 mt-2">
                        Since EarnWiz provides earning and withdrawal functionalities, we may share relevant financial information with third-party payment gateways and banking institutions to process transactions securely. This includes details such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Deposit and withdrawal requests made by users.</li>
                        <li>Transaction IDs, payment methods, and account details for verification.</li>
                        <li>Fraud detection and security checks.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        These financial partners are obligated to comply with data security regulations to protect user information.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Advertising and Marketing Partners</h3>
                    <p className="text-gray-700 mt-2">
                        EarnWiz operates on an ad-based revenue model, which means we work with third-party advertisers and marketing networks. In some cases, we may share non-personal data such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Ad interaction data (e.g., number of clicks and views).</li>
                        <li>Device and browsing data collected via cookies and tracking technologies.</li>
                        <li>General demographic insights for personalized ad targeting.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        We do not share personal identification details (such as email or phone numbers) with advertisers unless explicitly required and agreed upon by the user.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Legal and Compliance Requirements</h3>
                    <p className="text-gray-700 mt-2">
                        If required by law, regulatory authorities, or law enforcement agencies, EarnWiz may disclose user information to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Comply with legal obligations, court orders, or governmental requests.</li>
                        <li>Investigate fraud, prevent illegal activities, or enforce platform policies.</li>
                        <li>Protect the safety, rights, or security of EarnWiz, its users, or the general public.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        We ensure that any such disclosure is done strictly as per legal requirements and with due diligence.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Data Analytics and Service Providers</h3>
                    <p className="text-gray-700 mt-2">
                        To enhance user experience and improve platform performance, EarnWiz may work with data analytics firms, cloud service providers, and technology partners. These third parties may process data such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>User engagement and behavioral insights for platform optimization.</li>
                        <li>Bug tracking and system diagnostics for performance enhancement.</li>
                        <li>Security monitoring to detect unauthorized access or potential threats.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        These partners are contractually bound to maintain the confidentiality and security of user data and cannot use it for any unauthorized purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Business Transfers or Mergers</h3>
                    <p className="text-gray-700 mt-2">
                        In the event that EarnWiz undergoes a merger, acquisition, or business restructuring, user data may be transferred as part of the transaction. If such a scenario occurs, we will ensure that all affected users are notified in advance, and their information is handled in accordance with this Privacy Policy.
                    </p>

                    <p className="text-gray-700 mt-4">
                        <strong>Important Note:</strong> While we take all necessary precautions to protect user data, once information is shared with third-party partners, their data handling practices are subject to their own privacy policies. We encourage users to review the privacy policies of relevant third-party services when interacting with them.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Cookies & Tracking Technologies</h2>
                    <p className="text-gray-700 mt-2">
                        EarnWiz uses cookies and various tracking technologies to enhance user experience, improve platform performance, and ensure security. These technologies allow us to recognize users, analyze site traffic, and optimize features for better usability. Below is a breakdown of how we use cookies and tracking mechanisms:
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. What Are Cookies?</h3>
                    <p className="text-gray-700 mt-2">
                        Cookies are small text files stored on a user’s device when they visit a website. These files contain information that helps websites remember user preferences, login details, and browsing activities. Cookies do not contain personal information like passwords or bank details, but they assist in providing a seamless experience by personalizing content based on user interactions.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Types of Cookies We Use</h3>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li><strong>Essential Cookies:</strong> These cookies are necessary for core website functionality, such as logging in, accessing secure areas, and navigating pages smoothly.</li>
                        <li><strong>Performance Cookies:</strong> These cookies collect information about user interactions, including page visits, time spent on different sections, and loading speeds. We use this data to optimize the platform.</li>
                        <li><strong>Advertising Cookies:</strong> Used to deliver targeted ads based on user activity, these cookies track ad engagement and prevent users from seeing repetitive advertisements.</li>
                        <li><strong>Analytical Cookies:</strong> These help us measure traffic, understand how users engage with different features, and identify areas for improvement.</li>
                        <li><strong>Security Cookies:</strong> These protect user accounts by detecting unauthorized access, preventing fraudulent activities, and ensuring data integrity.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Tracking Technologies</h3>
                    <p className="text-gray-700 mt-2">
                        Apart from cookies, EarnWiz uses additional tracking technologies such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li><strong>Web Beacons:</strong> Small pixel-based tracking tools embedded in emails and web pages to monitor engagement and effectiveness of campaigns.</li>
                        <li><strong>Session Storage & Local Storage:</strong> These store temporary data in a user's browser to enhance performance and save user preferences.</li>
                        <li><strong>IP Tracking:</strong> Used to monitor suspicious activities and prevent unauthorized access.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. User Control & Cookie Management</h3>
                    <p className="text-gray-700 mt-2">
                        Users have full control over their cookie settings. They can manage, block, or delete cookies through browser settings. However, disabling cookies may impact certain features of EarnWiz, such as automatic login and personalized content.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Most browsers allow users to modify cookie preferences under the settings section. Users can also opt out of interest-based advertising by adjusting their preferences through ad networks.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Third-Party Cookies</h3>
                    <p className="text-gray-700 mt-2">
                        Some third-party services, including analytics and ad networks, may place cookies on our platform. These cookies help track performance metrics and ad effectiveness. EarnWiz does not have direct control over third-party cookies, but users can manage them via browser settings or third-party privacy policies.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">User Rights & Control</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we believe in empowering users by giving them full control over their personal data. We are committed to ensuring transparency regarding how user information is collected, used, and stored. Below are the key rights that users have concerning their data:
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Right to Access</h3>
                    <p className="text-gray-700 mt-2">
                        Users have the right to access their personal data stored on our platform. They can review their account details, transaction history, and profile information at any time. If users need a copy of their stored data, they may request it through our support team.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Right to Update or Modify Information</h3>
                    <p className="text-gray-700 mt-2">
                        Users can update or modify their personal details, such as name, email ID, mobile number, and withdrawal details, through the profile section of their account. However, certain updates, such as withdrawal account details, may require additional verification for security purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Right to Delete Account</h3>
                    <p className="text-gray-700 mt-2">
                        Users have the right to request account deletion at any time. Upon request, we will permanently remove all personal data associated with the account, including stored financial information and activity logs. However, transactional records related to withdrawals and earnings may be retained for legal and compliance reasons.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Right to Restrict Processing</h3>
                    <p className="text-gray-700 mt-2">
                        Users can request restrictions on how their data is processed. For example, they may choose to disable marketing communications or limit the use of their data for promotional activities. Users can adjust these preferences in their account settings or contact our support team for assistance.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Right to Withdraw Consent</h3>
                    <p className="text-gray-700 mt-2">
                        If users have previously provided consent for data collection or marketing communication, they can withdraw this consent at any time. Once withdrawn, we will cease processing their data for the specified purpose, except where legally required.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">6. Right to Object</h3>
                    <p className="text-gray-700 mt-2">
                        Users have the right to object to the processing of their personal data for certain purposes, such as targeted advertising or automated decision-making. If an objection is raised, we will review the request and take appropriate actions in compliance with data protection regulations.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">7. Right to Data Portability</h3>
                    <p className="text-gray-700 mt-2">
                        Users can request a structured, machine-readable copy of their personal data to be transferred to another service provider, if technically feasible. This right ensures that users retain control over their information, even if they choose to switch platforms.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">8. How to Exercise These Rights</h3>
                    <p className="text-gray-700 mt-2">
                        To exercise any of the above rights, users can contact EarnWiz’s support team through the <strong>contact us</strong> page or email. We will respond to all requests in a timely manner and ensure that user rights are upheld in accordance with applicable privacy laws.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Data Retention</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we are committed to securely storing and managing user data while ensuring compliance with legal, regulatory, and operational requirements. The retention of user data is crucial for maintaining account security, processing transactions, preventing fraud, and providing users with a seamless platform experience. Below is a comprehensive overview of how long we retain different types of data and the conditions under which they may be deleted or archived.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Personal Account Information</h3>
                    <p className="text-gray-700 mt-2">
                        User account details, including <strong>email ID, mobile number, and profile information</strong>, are retained as long as the account remains active. If a user chooses to delete their account, we remove personal details within a reasonable timeframe, subject to legal and financial obligations. However, certain minimal data, such as transaction logs, may be retained for audit purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Financial and Transactional Data</h3>
                    <p className="text-gray-700 mt-2">
                        As an earning platform, EarnWiz maintains user <strong>deposit records, earnings history, withdrawal requests, and payment details</strong> for a minimum period of <strong>5 years</strong>, in compliance with financial regulations and anti-fraud measures. This retention helps us resolve disputes, comply with tax regulations, and prevent fraudulent activities.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. Advertising and Activity Data</h3>
                    <p className="text-gray-700 mt-2">
                        Data related to ad views, clicks, and engagement in <strong>ad-based games, quizzes, and other earning tasks</strong> is typically stored for analytics and performance optimization. This data may be retained for a period of <strong>12-24 months</strong> before being anonymized or deleted.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">4. Communication and Support Queries</h3>
                    <p className="text-gray-700 mt-2">
                        Any communication made via our <strong>contact form, email, or customer support</strong> is stored for a duration of <strong>6-12 months</strong>. This helps us track support requests, resolve issues effectively, and enhance customer experience. If necessary, certain messages may be archived for compliance or legal reasons.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">5. Automated Log Data</h3>
                    <p className="text-gray-700 mt-2">
                        System-generated data such as <strong>IP addresses, device information, and login timestamps</strong> is retained for security monitoring and fraud prevention purposes. These logs are usually kept for a duration of <strong>90 days to 1 year</strong>, after which they may be automatically deleted or anonymized.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">6. Account Deletion and Data Removal Requests</h3>
                    <p className="text-gray-700 mt-2">
                        Users have the right to request account deletion at any time. Upon receiving such a request, we initiate a data removal process, ensuring that personal details are erased within a <strong>30 to 60-day period</strong>. However, financial and transactional records may be retained for compliance and audit purposes. Users can contact our support team to request data deletion or learn more about our retention policies.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">7. Exceptions and Legal Compliance</h3>
                    <p className="text-gray-700 mt-2">
                        In certain cases, we may be required to retain user data for an extended period due to <strong>legal obligations, regulatory requirements, fraud investigations, or security audits</strong>. Such retention is strictly for compliance and is not used for any promotional or marketing purposes.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Policy Updates</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we continuously strive to improve our services, enhance security, and ensure compliance with evolving legal and regulatory requirements. As a result, we may update or modify our Privacy Policy from time to time. These updates are essential to reflect changes in our business operations, new technological advancements, and shifts in industry standards.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">1. Frequency of Updates</h3>
                    <p className="text-gray-700 mt-2">
                        Our Privacy Policy is reviewed periodically to ensure it remains up to date and transparent. While there is no fixed schedule for updates, we may revise our policies whenever:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>We introduce <strong>new features or services</strong> that impact user data collection or processing.</li>
                        <li>There are <strong>changes in legal or regulatory requirements</strong> that we must comply with.</li>
                        <li>We enhance our <strong>security measures and data protection practices</strong>.</li>
                        <li>Any <strong>other business or operational changes</strong> require updates to our policy.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">2. Notification of Changes</h3>
                    <p className="text-gray-700 mt-2">
                        Whenever we make significant changes to our Privacy Policy, we ensure that our users are informed in a timely and transparent manner. We may notify users through:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>An <strong>email notification</strong> sent to registered users.</li>
                        <li>A <strong>prominent notice</strong> displayed on our website.</li>
                        <li>Updates posted on our <strong>official social media channels</strong>.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Users are encouraged to review the updated Privacy Policy to stay informed about how their personal data is managed. By continuing to use our platform after updates are published, users agree to the revised terms.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">3. User Responsibilities</h3>
                    <p className="text-gray-700 mt-2">
                        We recommend that users periodically check this page for the latest updates to our Privacy Policy. If a user does not agree with any changes, they have the right to discontinue using our services. However, continued use of EarnWiz after policy changes will be considered as acceptance of the updated terms.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Contact Information</h2>
                    <p className="text-gray-700 mt-2">
                        If you have any questions, concerns, or need further clarification regarding our Privacy Policy,
                        you can contact us through the official support options provided below.
                        At EarnWiz, we value your privacy and are committed to addressing your inquiries promptly.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">How to Reach Us</h3>
                    <p className="text-gray-700 mt-2">
                        We provide two ways for you to reach us regarding any inquiries related to your account, transactions, privacy concerns, or general assistance:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>
                            <strong>Email Support:</strong> You can reach us at
                            <a href="mailto:support@earnwiz.in" className="text-blue-600 font-medium underline"> support@earnwiz.in</a>.
                            We aim to respond within <strong>24 to 48 business hours</strong>.
                        </li>
                        <li>
                            <strong>Contact Us Form:</strong> You can also contact us through our <Link to="/contact-us" className="text-blue-600">Contact Us</Link> page on the website.
                        </li>
                    </ul>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">Response Time & User Support</h3>
                    <p className="text-gray-700 mt-2">
                        We strive to respond to all queries as soon as possible. While most inquiries receive a response within
                        <strong>24 to 48 hours</strong>, some cases may take longer depending on their complexity.
                        Users are encouraged to check our Help Center for common questions before reaching out.
                    </p>

                    <h3 className="text-xl font-semibold text-blue-600 mt-4">Important Considerations</h3>
                    <p className="text-gray-700 mt-2">
                        When reaching out to us, please include all necessary details, such as your registered email
                        and a clear description of your issue. This helps us resolve your request efficiently.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Please note that EarnWiz will never ask for your password, financial details, or sensitive information via
                        email. Be cautious of phishing attempts and report any suspicious emails to us immediately.
                    </p>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
};

export default PrivacyPolicy;
