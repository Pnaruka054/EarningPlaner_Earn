import React, { useRef, useState } from "react";

const TextEditor = () => {
  const editorRef = useRef(null);
  const [color, setColor] = useState("#000000");  // Default color black

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
    applyStyle("foreColor", e.target.value);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="border p-2 rounded shadow-md bg-gray-100 mb-2 flex flex-wrap gap-2">
        <button onClick={() => applyStyle("bold")} className="p-1 px-2 bg-gray-200 rounded">B</button>
        <button onClick={() => applyStyle("italic")} className="p-1 px-2 bg-gray-200 rounded">I</button>
        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="p-1 bg-gray-200 rounded cursor-pointer"
        />
        <button onClick={() => applyStyle("hiliteColor", "yellow")} className="p-1 px-2 bg-yellow-300 rounded">Highlight</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="border p-3 min-h-[200px] rounded shadow-md bg-white outline-none"
      ></div>
    </div>
  );
};

export default TextEditor;
