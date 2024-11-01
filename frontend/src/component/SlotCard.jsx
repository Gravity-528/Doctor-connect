import React from "react";

const SlotCard = ({ time }) => {
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-md bg-white border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">{time}</span>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
          Book
        </button>
      </div>
    </div>
  );
};

export default SlotCard;
