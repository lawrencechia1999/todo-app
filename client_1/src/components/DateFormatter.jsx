import React from 'react';

const DateFormatter = ({ dateString }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        const year = date.getFullYear(); // Get full year
        const hours = String(date.getHours()).padStart(2, '0'); // Get hours and pad with leading zero
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes and pad with leading zero
        const seconds = String(date.getSeconds()).padStart(2, '0'); // Get seconds and pad with leading zero

        // Format the date as dd/mm/yyyy hh:mm:ss
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div>
           {formatDate(dateString)}
        </div>
    );
};


export default DateFormatter;