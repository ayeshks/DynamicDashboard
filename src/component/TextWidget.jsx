// TextWidget.js
import React from "react";

const TextWidget = ({ content }) => {
  return <textarea value={content} className="w-full border rounded-lg p-2 h-40 pt-6" readOnly />;
};

export default TextWidget;
