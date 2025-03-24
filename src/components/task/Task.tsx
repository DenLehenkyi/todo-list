import React, { useState } from "react";

const Task = ({ task, taskListIndex, taskIndex }) => {
  const [taskDetails, setTaskDetails] = useState(task);

  const handleTaskNameChange = (e) => {
    setTaskDetails({ ...taskDetails, taskName: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setTaskDetails({ ...taskDetails, taskDescription: e.target.value });
  };

  const toggleCompleted = () => {
    setTaskDetails({ ...taskDetails, completed: !taskDetails.completed });
  };

  return (
    <div className="flex items-center mb-4 p-4 bg-white rounded-lg shadow-md">
      <input
        type="text"
        className="border border-gray-300 p-3 rounded-lg mr-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={taskDetails.taskName}
        onChange={handleTaskNameChange}
        placeholder="Task Name"
      />
      <input
        type="text"
        className="border border-gray-300 p-3 rounded-lg mr-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={taskDetails.taskDescription}
        onChange={handleDescriptionChange}
        placeholder="Task Description"
      />
      <button
        onClick={toggleCompleted}
        className={`p-2 rounded-lg text-white ${
          taskDetails.completed ? "bg-green-500" : "bg-gray-500"
        }`}
      >
        {taskDetails.completed ? "Completed" : "Incomplete"}
      </button>
    </div>
  );
};

export default Task;
