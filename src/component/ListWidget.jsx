import React from "react";

const ListWidget = ({ content, onToggleTask }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold">Tasks List</h2>
          <p className="text-sm text-gray-500">Hello, here are your latest tasks</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-1 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600">
            Urgent
          </button>
          <button className="px-4 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">
            Latest
          </button>
        </div>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {content.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-5 h-5 text-purple-600 border-gray-300  focus:ring-purple-500 rounded-lg"
            />
            <span className="text-md text-gray-800">{item}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center mt-4">
        Last updated {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default ListWidget;
