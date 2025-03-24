import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/AccountContext";
import {
  createTaskList,
  getTaskLists,
  deleteTaskList,
  updateTaskList,
} from "@/firebase/taskService";
import TaskListItem from "./TaskListItem";

const TaskList = () => {
  const [taskLists, setTaskLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchTaskLists();
    }
  }, [user]);

  const fetchTaskLists = async () => {
    if (!user) return;
    try {
      const lists = await getTaskLists(user.email);
      setTaskLists(lists);
    } catch (error) {
      console.error("Error fetching task lists:", error);
    }
  };

  const handleCreateList = async () => {
    if (!user || !newListName) return;
    try {
      await createTaskList(newListName, user.email);
      setNewListName("");
      fetchTaskLists();
    } catch (error) {
      console.error("Error creating task list:", error);
    }
  };

  const handleDeleteList = async (id: string) => {
    if (user?.role !== "Admin") {
      alert("Only Admin can delete lists!");
      return;
    }
    try {
      await deleteTaskList(id);
      fetchTaskLists();
    } catch (error) {
      console.error("Error deleting task list:", error);
    }
  };

  const handleUpdateList = async (id: string, newName: string) => {
    if (user?.role !== "Admin") {
      alert("Only Admin can update lists!");
      return;
    }
    try {
      await updateTaskList(id, newName);
      fetchTaskLists();
    } catch (error) {
      console.error("Error updating task list:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-lg w-full">
      <div className="flex items-center justify-between w-full mb-8">
        <input
          type="text"
          placeholder="New Task List"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-2/3 mr-4"
        />
        <button
          onClick={handleCreateList}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700"
        >
          Create
        </button>
      </div>

      <div className="space-y-4 w-full">
        {taskLists.map((list) => (
          <TaskListItem
            key={list.id}
            list={list}
            userRole={user.role}
            onDelete={() => handleDeleteList(list.id)}
            onUpdate={(newName) => handleUpdateList(list.id, newName)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
