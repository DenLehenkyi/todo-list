import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/AccountContext";
import {
  createTaskList,
  getUserTaskLists,
  deleteTaskList,
  updateTaskList,
} from "@/firebase/taskListService";
import TaskListItem from "./TaskListItem";
import { useRouter } from "next/router";

const TaskList = () => {
  const [taskLists, setTaskLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.email) {
      fetchTaskLists();
    }
  }, [user]);

  const fetchTaskLists = async () => {
    if (!user || !user.email) return;
    try {
      setLoading(true);
      setError(null);
      const lists = await getUserTaskLists(user.email);
      setTaskLists(lists);
      console.log("Fetched task lists:", lists);
    } catch (error) {
      console.error("Error fetching task lists:", error);
      setError("Failed to load task lists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!user || !user.email || !newListName.trim()) return;
    try {
      setError(null);
      await createTaskList(newListName, user.uid, user.email);
      setNewListName("");
      fetchTaskLists();
    } catch (error) {
      console.error("Error creating task list:", error);
      setError("Failed to create task list.");
    }
  };

  const getUserRoleForList = (list) => {
    if (list.owner === user.email) {
      return "Admin";
    }
    const participant = list.participants.find((p) => p.email === user.email);
    return participant ? participant.role : "Viewer";
  };

  const isSharedList = (list) => {
    return (
      list.owner !== user.email &&
      list.participants.some((p) => p.email === user.email)
    );
  };

  const handleDeleteList = async (id: string, list) => {
    const userRole = getUserRoleForList(list);
    if (userRole !== "Admin") {
      alert("Only Admin or the owner can delete lists!");
      return;
    }
    if (!confirm(`Are you sure you want to delete "${list.name}"?`)) {
      return;
    }
    try {
      setError(null);
      console.log("Deleting task list with id:", id);
      await deleteTaskList(id);
      fetchTaskLists();
    } catch (error) {
      console.error("Error deleting task list:", error);
      setError("Failed to delete task list.");
    }
  };

  const handleUpdateList = async (id: string, newName: string, list) => {
    const userRole = getUserRoleForList(list);
    if (userRole !== "Admin") {
      alert("Only Admin or the owner can update lists!");
      return;
    }
    try {
      setError(null);
      await updateTaskList(id, newName);
      fetchTaskLists();
    } catch (error) {
      console.error("Error updating task list:", error);
      setError("Failed to update task list.");
    }
  };

  const handleClickOnList = (listId) => {
    router.push(`/taskList/${listId}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between w-full mb-8 gap-4">
        <input
          type="text"
          placeholder="New Task List"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="flex-grow p-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
        />
        <button
          onClick={handleCreateList}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
        >
          Create
        </button>
      </div>

      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      <div className="space-y-6 w-full">
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : taskLists.length === 0 ? (
          <div className="text-center text-gray-600">No task lists found.</div>
        ) : (
          taskLists.map((list) => (
            <div
              key={list.id}
              className="cursor-pointer hover:bg-gray-200 transition-colors duration-200 rounded-lg"
            >
              <TaskListItem
                list={list}
                userRole={getUserRoleForList(list)}
                isShared={isSharedList(list)}
                onDelete={() => handleDeleteList(list.id, list)}
                onUpdate={(newName) => handleUpdateList(list.id, newName, list)}
                onClickList={() => handleClickOnList(list.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
