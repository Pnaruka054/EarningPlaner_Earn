import React, { useContext } from "react";
import { NavBar_global_context } from "../components/context/navBar_globalContext";
import Pagination from "../components/pagination/pagination";

const PaymentProof = () => {
    const { navBar_global_context_state } = useContext(NavBar_global_context);
    const [currentPage_state, setCurrentPage_state] = React.useState(1);

    const itemsPerPage = 10;
    const indexOfLastRecord = currentPage_state * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    const currentRecords = navBar_global_context_state?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
    const totalPages = Math.ceil((navBar_global_context_state?.length || 0) / itemsPerPage);

    return (
        <div className="overflow-auto custom-scrollbar h-[92.5dvh] bg-gradient-to-r from-green-100 to-blue-100 flex flex-col items-center py-10">
            <div className="w-full px-4">
                <h2 className="text-4xl font-bold text-center text-green-800 mb-8">
                    Payment Proof
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg">
                        <thead className="bg-green-700 text-sm sm:text-lg">
                            <tr>
                                <th className="px-2 md:px-4 py-3 hidden md:block text-left text-lg font-semibold text-white">
                                    #
                                </th>
                                <th className="px-2 md:px-4 py-3 text-left font-semibold text-white">
                                    Time
                                </th>
                                <th className="px-2 md:px-4 py-3 text-left font-semibold text-white">
                                    User Name
                                </th>
                                <th className="px-2 md:px-4 py-3 text-left font-semibold text-white">
                                    Withdrawal Method
                                </th>
                                <th className="px-2 md:px-4 py-3 text-left font-semibold text-white">
                                    Balance
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm sm:text-lg">
                            {currentRecords.length > 0 ? (
                                currentRecords.map((payment, index) => (
                                    <tr key={index} className="text-gray-700">
                                        <td className="px-2 sm:px-4 py-2 md:py-4 hidden md:block whitespace-nowrap">
                                            {indexOfFirstRecord + index + 1}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 md:py-4 whitespace-nowrap">
                                            {payment.time}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 md:py-4 whitespace-nowrap">
                                            {payment.userName}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 md:py-4 whitespace-nowrap">
                                            {payment.withdrawal_method}
                                        </td>
                                        <td className="px-2 sm:px-4 py-2 md:py-4 whitespace-nowrap font-semibold text-green-600">
                                            ₹{parseFloat(payment.balance).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-lg text-gray-500">
                                        No payment records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage_state}
                        onPageChange={setCurrentPage_state}
                    />
                )}
            </div>
        </div>
    );
};

export default PaymentProof;
