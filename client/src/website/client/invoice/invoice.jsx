import React from 'react';
import Footer from '../components/footer/footer';

const Invoice = () => {
    // Example dynamic data for invoices
    const currentInvoices = [
        { id: 1, status: 'Paid', description: 'Invoice for services rendered', amount: '$100.00', paymentMethod: 'Credit Card', paidDate: '10/1/24', created: '09/15/24' },
        { id: 2, status: 'Pending', description: 'Invoice for consulting services', amount: '$150.00', paymentMethod: 'PayPal', paidDate: null, created: '09/20/24' },
        { id: 3, status: 'Rejected', description: 'Invoice for product purchase', amount: '$200.00', paymentMethod: 'Bank Transfer', paidDate: null, created: '09/25/24' },
        // Add more invoice data as needed
    ];
    return (
        <div className="ml-auto bg-[#ecf0f5] flex flex-col justify-between select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12">
            <div className="px-2 py-2">
                <div className='text-2xl mb-4'>
                    Manage Invoices
                </div>
                <div className="table-responsive">
                    <table className="min-w-full table-auto border-collapse bg-white rounded-lg">
                        <thead>
                            <tr className="bg-white text-left">
                                <th className="px-4 py-2 border-b">ID</th>
                                <th className="px-4 py-2 border-b">Description</th>
                                <th className="px-4 py-2 border-b">Amount</th>
                                <th className="px-4 py-2 border-b">Payment Method</th>
                                <th className="px-4 py-2 border-b">Paid Date</th>
                                <th className="px-4 py-2 border-b">Created</th>
                                <th className="px-4 py-2 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentInvoices.map((invoice, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2">{invoice.id}</td>
                                    <td className="px-4 py-2">{invoice.description}</td>
                                    <td className="px-4 py-2">{invoice.amount}</td>
                                    <td className="px-4 py-2">{invoice.paymentMethod}</td>
                                    <td className="px-4 py-2">{invoice.paidDate}</td>
                                    <td className="px-4 py-2">{invoice.created}</td>
                                    <td className={`px-4 py-2 font-semibold ${invoice.status === "Pending" ? "text-blue-500" :
                                        invoice.status === "Rejected" ? "text-red-500" : "text-green-500"
                                        }`}>
                                        {invoice.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}

export default Invoice;
