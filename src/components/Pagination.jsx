import React from 'react';
import { Icon } from '@iconify/react'; 

const Pagination = ({ currentPage, totalPages, prevPage, nextPage }) => {
    return (
        <div className="mt-4 flex justify-center items-center gap-4">
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`bg-gray-900 border border-gray-700 text-white p-2 rounded-full transition-all duration-300 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none ${currentPage === 1 ? 'disabled' : ''}`}
            >
                <Icon icon="mdi:arrow-left" className="text-xl" />
            </button>
            <span className="text-lg text-gray-400 mx-3 Inter">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`bg-gray-900 border border-gray-700 text-white p-2 rounded-full transition-all duration-300 hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none ${currentPage === totalPages ? 'disabled' : ''}`}
            >
                <Icon icon="mdi:arrow-right" className="text-xl" />
            </button>
        </div>
    );
};

export default Pagination;
