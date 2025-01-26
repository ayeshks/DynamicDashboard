import React, { useState } from "react";
import TextWidget from "./component/TextWidget";
import ListWidget from "./component/ListWidget";
import ChartWidget from "./component/ChartWidget";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Rnd } from "react-rnd";
import "primeicons/primeicons.css";
import "tailwindcss/tailwind.css";

const App = () => {
  const [widgets, setWidgets] = useState(() => {
    const storedWidgets = localStorage.getItem("widgets");
    return storedWidgets ? JSON.parse(storedWidgets) : [];
  });
  const [widgetType, setWidgetType] = useState("text");
  const [selectedWidget, setSelectedWidget] = useState(null);

  const saveWidgetsToLocalStorage = (updatedWidgets) => {
    localStorage.setItem("widgets", JSON.stringify(updatedWidgets));
  };

  const handleRemoveWidget = (id) => {
    const updatedWidgets = widgets.filter((widget) => widget.id !== id);
    setWidgets(updatedWidgets);
    saveWidgetsToLocalStorage(updatedWidgets);
  };

  const handleClearWidgets = () => {
    setWidgets([]);
    localStorage.removeItem("widgets");
  };

  const addWidget = () => {
    const newWidget = {
      id: Date.now(),
      type: widgetType,
      position: { x: 0, y: 0 },
      size: { width: 300, height: 200 },
      content:
        widgetType === "chart"
          ? {
              type: "line",
              data: {
                labels: ["January", "February", "March", "April", "May"],
                datasets: [
                  {
                    label: "New Chart",
                    data: [10, 20, 30, 40, 50],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                  },
                ],
              },
              options: {
                responsive: true,
              },
            }
          : widgetType === "list"
          ? ["Task 1", "Task 2", "Task 3"]
          : "Editable Text Widget",
    };
    const updatedWidgets = [...widgets, newWidget];
    setWidgets(updatedWidgets);
    saveWidgetsToLocalStorage(updatedWidgets);
  };

  const handleEditWidget = (widget) => {
    setSelectedWidget(widget);
  };

  const handleSaveWidget = (updatedWidget) => {
    const updatedWidgets = widgets.map((widget) =>
      widget.id === updatedWidget.id ? updatedWidget : widget
    );
    setWidgets(updatedWidgets);
    saveWidgetsToLocalStorage(updatedWidgets);
    setSelectedWidget(null);
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-100">
        <div className="Header sm:px-24 sm:pt-2">
          <div className="flex flex-wrap justify-between items-center mb-6 p-2 sm:px-8 bg-[#141414] sm:rounded-full">
            <h1 className="text-md font-bold text-white pb-1 sm:pb-0">
              Dynamic Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={widgetType}
                onChange={(e) => setWidgetType(e.target.value)}
                className="sm:p-1 px-2 border rounded-lg text-md"
              >
                <option value="chart">Chart</option>
                <option value="text">Text</option>
                <option value="list">List</option>
              </select>
              <button
                onClick={addWidget}
                className="flex p-1 px-2 bg-gradient-to-r from-blue-400 via-pink-500 to-red-500 text-white rounded-lg hover:bg-blue-600 justify items-center"
              >
                <i className="pi pi-plus-circle text-white text-md"></i>
                <span className="text-md ml-2 sm:block hidden">
                  Add Widget
                </span>
              </button>
              <button
                onClick={handleClearWidgets}
                className="flex p-1 px-2 bg-red-500 text-white rounded-lg hover:bg-red-600 justify items-center"
              >
                <i className="pi pi-eraser text-white text-md"></i>
                <span className="text-md ml-2 sm:block hidden">
                  Clear All Widgets
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-full w-full overflow-y-auto flex flex-col space-y-4 py-4">
          {widgets.map((widget) => (
            <DraggableWidget
              key={widget.id}
              widget={widget}
              onRemove={() => handleRemoveWidget(widget.id)}
              onEdit={() => handleEditWidget(widget)}
              onUpdate={(updatedPosition, updatedSize) => {
                const updatedWidgets = widgets.map((w) =>
                  w.id === widget.id
                    ? {
                        ...w,
                        position: updatedPosition,
                        size: updatedSize,
                      }
                    : w
                );
                setWidgets(updatedWidgets);
                saveWidgetsToLocalStorage(updatedWidgets);
              }}
            />
          ))}
        </div>

        {selectedWidget && (
          <PopupEditor
            widget={selectedWidget}
            onSave={handleSaveWidget}
            onCancel={() => setSelectedWidget(null)}
          />
        )}
      </div>
    </DndProvider>
  );
};

const DraggableWidget = ({ widget, onRemove, onEdit, onUpdate }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "WIDGET",
    item: { id: widget.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Rnd
      bounds="parent"
      position={widget.position}
      size={widget.size}
      onDragStop={(e, data) =>
        onUpdate({ x: data.x, y: data.y }, widget.size)
      }
      onResizeStop={(e, direction, ref, delta, position) =>
        onUpdate(position, {
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
        })
      }
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        topLeft: true,
        bottomRight: true,
        bottomLeft: true,
      }}
      className={`bg-white border-black border-2 shadow-md rounded-lg p-4 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div ref={dragPreview} className="w-full h-full">
        <div ref={drag} className="cursor-move relative">
          <button
            onClick={onRemove}
            className="absolute top-1 right-2 text-gray-300 "
          >
            <i class="pi pi-times-circle text-black hover:text-red-500"></i>
          </button>
          <button
            onClick={onEdit}
            className="absolute top-1 left-2 text-gray-300 "
          >
            <i class="pi pi-pen-to-square text-black hover:text-blue-500"></i>
          </button>
        </div>
        {widget.type === "chart" && <ChartWidget content={widget.content} />}
        {widget.type === "text" && <TextWidget content={widget.content} />}
        {widget.type === "list" && <ListWidget content={widget.content} />}
      </div>
    </Rnd>
  );
};

const PopupEditor = ({ widget, onSave, onCancel }) => {
  const [content, setContent] = useState(widget.content);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Edit Widget</h2>
        {widget.type === "text" && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
          />
        )}
        {widget.type === "chart" && (
          <textarea
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => setContent(JSON.parse(e.target.value))}
            className="w-full border rounded-lg p-2 mb-4"
            rows={6}
          />
        )}
        {widget.type === "list" && (
          <textarea
            value={content.join("\n")}
            onChange={(e) =>
              setContent(e.target.value.split("\n").filter((item) => item))
            }
            className="w-full border rounded-lg p-2 mb-4"
            rows={6}
          />
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...widget, content })}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
