import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const maxVisible = 5;
  let startPage, endPage;

  if (totalPages <= maxVisible) {
    // Agar total pages 5 ya kam hain, toh sabhi pages dikhayein
    startPage = 1;
    endPage = totalPages;
  } else {
    // Agar total pages 5 se zyada hain, toh window shift hogi
    if (currentPage <= 3) {
      // Beginning mein, first 5 pages show karenge
      startPage = 1;
      endPage = maxVisible;
    } else if (currentPage >= totalPages - 2) {
      // End mein, last 5 pages show karenge
      startPage = totalPages - maxVisible + 1;
      endPage = totalPages;
    } else {
      // Beech ke pages ke liye, current page ko window mein adjust karenge
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  // Generate visible page numbers based on startPage and endPage
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex gap-2 justify-center mt-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md ${
          currentPage === 1
            ? "bg-blue-500 text-white cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
      >
        Prev
      </button>

      {/* Page Number Buttons */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md ${
            currentPage === page
              ? "bg-purple-600 text-white font-bold"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-blue-500 text-white cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
