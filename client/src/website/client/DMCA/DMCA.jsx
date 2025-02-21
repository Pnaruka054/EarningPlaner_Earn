import { Link } from 'react-router-dom';
import Footer from '../components/footer/footer'

const DMCA = () => {
    return (
        <div className='overflow-auto h-[94vh] flex flex-col justify-between'>
            <div className='container mx-auto p-6 space-y-7'>
                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Introduction to DMCA</h2>
                    <p className="text-gray-700 mt-2">
                        The Digital Millennium Copyright Act (DMCA) is a U.S. copyright law designed to protect copyright holders and
                        prevent unauthorized use or distribution of copyrighted materials on the internet. The DMCA provides a legal framework
                        for content owners to request the removal of infringing content and for online platforms to limit their liability for hosting such content.
                    </p>
                    <p className="text-gray-700 mt-2">
                        EarnWiz is committed to respecting the intellectual property rights of others. As part of our dedication to ensuring a
                        fair and secure platform, we have established a process for handling copyright infringement claims in accordance with the DMCA.
                    </p>
                    <p className="text-gray-700 mt-2">
                        If you are a copyright owner and believe that your work has been infringed upon on our platform, we encourage you to
                        file a copyright infringement notice with us, following the guidelines outlined in the next section.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Copyright Infringement Notification</h2>
                    <p className="text-gray-700 mt-2">
                        If you believe that any content on EarnWiz infringes upon your copyrighted work, please notify us by submitting a formal
                        Digital Millennium Copyright Act (DMCA) notification. To ensure we can address your complaint properly, please provide
                        the following information in your notice:
                    </p>
                    <ul className="list-disc ml-6 text-gray-700 mt-2">
                        <li>The signature of the copyright owner or an authorized representative.</li>
                        <li>Identification of the copyrighted work you claim has been infringed.</li>
                        <li>A description of the material you claim is infringing, including its location on our platform.</li>
                        <li>Your contact information, including an address, telephone number, and email address.</li>
                        <li>A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner.</li>
                        <li>A statement under penalty of perjury that the information provided is accurate and that you are authorized to act on behalf of the copyright owner.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Once we receive your notification, we will take the necessary steps to investigate the claim and may remove the allegedly infringing
                        content in accordance with the DMCA. We will also notify the user who uploaded the content that their content has been flagged for
                        potential copyright infringement.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Please send your DMCA notifications to our designated DMCA agent at <strong><a href="mailto:support@earnwiz.in" className="text-blue-600">support@earnwiz.in</a></strong>.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Designated DMCA Agent</h2>
                    <p className="text-gray-700 mt-2">
                        EarnWiz has designated a DMCA Agent to receive and process all notices of alleged copyright infringement.
                        If you are a copyright owner or an agent authorized to act on behalf of the copyright owner and believe that
                        your copyrighted work has been infringed upon, please submit a notice to our designated DMCA Agent.
                    </p>
                    <p className="text-gray-700 mt-2">
                        The DMCA notice must include the following information:
                    </p>
                    <ul className="text-gray-700 mt-2 list-disc pl-5">
                        <li>The signature of the copyright owner or a person authorized to act on their behalf.</li>
                        <li>A description of the copyrighted work that you claim has been infringed.</li>
                        <li>A description of the location on the website where the infringing material is located (such as the URL).</li>
                        <li>Your contact information, including your name, email address, and phone number.</li>
                        <li>A statement that you have a good faith belief that the use of the copyrighted material is not authorized by the copyright owner.</li>
                        <li>A statement that the information in the notification is accurate, and under penalty of perjury, you are authorized to act on behalf of the copyright owner.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Once a valid DMCA notice is received, we will take the necessary actions, which may include removing or disabling access to the infringing content.
                    </p>
                    <p className="text-gray-700 mt-2">
                        To submit a DMCA notice or for further inquiries, please contact our designated DMCA Agent at:
                    </p>
                    <p className="text-gray-700 mt-2">
                        <strong>Email:</strong> dmca@earnwiz.com
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Counter-Notice Procedure</h2>
                    <p className="text-gray-700 mt-2">
                        If you believe that your content has been removed or disabled due to a mistake or misidentification, you may submit a counter-notice to request the restoration of your content. A counter-notice is a formal way of challenging the takedown and provides the opportunity to resolve the dispute.
                    </p>
                    <p className="text-gray-700 mt-2">
                        To submit a valid counter-notice, you must provide the following information:
                    </p>
                    <ul className="text-gray-700 mt-2">
                        <li>Your full name, address, and contact information (email and phone number).</li>
                        <li>The specific content that was removed or disabled and the location of the content before it was removed (for example, the URL or page address).</li>
                        <li>A statement under penalty of perjury that you believe in good faith that the content was removed due to a mistake or misidentification.</li>
                        <li>Your consent to the jurisdiction of the court for the location where you are located, or if outside the U.S., the jurisdiction where your service provider is located, and your willingness to accept service of process from the party who submitted the original notification of infringement.</li>
                        <li>A signature (physical or electronic) from the person authorized to act on behalf of the owner of the content that was removed or disabled.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Upon receiving a valid counter-notice, we will review the request and may restore the content within 10 to 14 business days, unless we receive further communication from the party who submitted the original infringement notice. Please note that submitting a counter-notice does not guarantee that the content will be restored or that the dispute will be resolved in your favor.
                    </p>
                    <p className="text-gray-700 mt-2">
                        To submit your counter-notice, please contact us through our <a href="/contact" className="text-blue-700">Contact Us</a> page, providing all required details.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Consequences of Copyright Infringement</h2>
                    <p className="text-gray-700 mt-2">
                        At EarnWiz, we take copyright infringement very seriously. We respect the rights of content creators and follow the rules set forth by the Digital Millennium Copyright Act (DMCA). Any user found violating copyright laws or uploading copyrighted material without proper authorization may face severe consequences.
                    </p>
                    <p className="text-gray-700 mt-2">
                        The consequences of copyright infringement may include:
                    </p>
                    <ul className="text-gray-700 mt-2 list-disc pl-6">
                        <li>Immediate removal of the infringing content from our platform.</li>
                        <li>Temporary suspension or permanent termination of the user’s account.</li>
                        <li>Legal action from the copyright owner or other relevant authorities.</li>
                        <li>Loss of any earnings associated with the infringing activity.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        We encourage users to respect the intellectual property rights of others and to use the platform responsibly. Repeated violations may lead to permanent banishment from the website and other legal actions that may be deemed necessary.
                    </p>
                    <p className="text-gray-700 mt-2">
                        If you believe that any content on EarnWiz infringes your copyright, please notify us immediately via the DMCA process, and we will take appropriate action as required.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Rights of the Content Owner</h2>
                    <p className="text-gray-700 mt-2">
                        The Digital Millennium Copyright Act (DMCA) provides significant rights and protections to content owners. As the rightful owner of a copyrighted work, you have the legal right to control how your work is used, distributed, and displayed online. If you believe your copyrighted material has been used on EarnWiz without your permission, you have the right to submit a DMCA takedown notice to have the infringing content removed from our platform.
                    </p>
                    <p className="text-gray-700 mt-2">
                        By submitting a DMCA notice, you are asserting that the content in question is indeed copyrighted by you and that its use on our platform violates your rights. Once we receive your notice, we will act promptly in accordance with the DMCA to investigate and remove any infringing content.
                    </p>
                    <p className="text-gray-700 mt-2">
                        It is important to note that the DMCA also allows for a counter-notice procedure. If a user believes that their content was removed mistakenly, they can submit a counter-notice to have the content reinstated. As the copyright holder, you also have the right to challenge any such counter-notices through legal channels.
                    </p>
                    <p className="text-gray-700 mt-2">
                        If you are unsure whether your content is being used without permission, we recommend consulting with a legal professional to better understand your rights and the DMCA process.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Exemption for Service Providers</h2>
                    <p className="text-gray-700 mt-2">
                        As a service provider, EarnWiz is committed to complying with the Digital Millennium Copyright Act (DMCA) and
                        other applicable copyright laws. Under the DMCA's "Safe Harbor" provisions, we are not held liable for the
                        infringing content uploaded by users, provided we act promptly to remove such content when notified by the
                        copyright owner or their authorized agent.
                    </p>
                    <p className="text-gray-700 mt-2">
                        This exemption is available as long as we follow the proper procedures outlined in the DMCA. We will not
                        be held responsible for content posted by our users, as we are not directly involved in the creation or
                        publication of such content. However, we take copyright violations seriously and will respond quickly to
                        any valid DMCA notice.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Please note that this exemption only applies to content hosted on our platform and is subject to our
                        adherence to the DMCA requirements. If you are a copyright holder and believe your content has been
                        infringed upon, please follow the proper DMCA notification process, and we will take appropriate action.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Modifications to the DMCA Policy</h2>
                    <p className="text-gray-700 mt-2">
                        We reserve the right to modify, update, or amend this DMCA Policy at any time without prior notice. These modifications may be necessary due to legal requirements, changes in our platform's practices, or to ensure better clarity and compliance with applicable laws.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Any changes made to this DMCA Policy will be reflected on this page with an updated "Last Modified" date. We encourage users to periodically review this page to stay informed of any changes that may affect their rights or obligations under the policy.
                    </p>
                    <p className="text-gray-700 mt-2">
                        Continued use of our platform after any such changes indicates your acceptance of the updated DMCA Policy. If you do not agree with the updated terms, you should discontinue using our services.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Contact Information</h2>
                    <p className="text-gray-700 mt-2">
                        If you believe that your copyright-protected content has been uploaded or shared on EarnWiz without permission, or if you need to contact us regarding any DMCA-related matter, please feel free to reach out to us via the following methods:
                    </p>
                    <ul className="text-gray-700 mt-2 list-disc pl-6">
                        <li>Email: <a href="mailto:support@earnwiz.in" className="text-blue-600">support@earnwiz.in</a></li>
                        <li>If you prefer, you can also contact us through our <Link to="/contact-us" className="text-blue-600">Contact Us</Link> page.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Please ensure that your DMCA notice includes all required information as outlined in the DMCA guidelines. We strive to respond to all inquiries as promptly as possible.
                    </p>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
};

export default DMCA;
