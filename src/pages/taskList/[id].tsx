import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getTasksByListId,
  addTaskToList,
  updateTaskInListWithListId,
  deleteTaskFromList,
  toggleTaskCompletion,
} from "@/firebase/taskService";
import {
  updateTaskListParticipants,
  getTaskListById,
  getListNameById,
} from "@/firebase/taskListService";
import { useUser } from "@/contexts/AccountContext";
import { FaCheckCircle, FaEdit, FaTrashAlt, FaUserPlus } from "react-icons/fa";
import { green } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";

import {
  Task,
  Participant,
  TaskList,
  UserContextType,
  RouterQuery,
} from "@/types/types";

const TaskPage = () => {
  const router = useRouter();
  const { id } = router.query as RouterQuery;
  const listId: string = typeof id === "string" ? id : "";
  const { user } = useUser() as UserContextType;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [description, setDescription] = useState<string>("");
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskName, setEditedTaskName] = useState<string>("");
  const [editedTaskDescription, setEditedTaskDescription] =
    useState<string>("");
  const [newParticipantEmail, setNewParticipantEmail] = useState<string>("");
  const [newParticipantRole, setNewParticipantRole] = useState<
    "Viewer" | "Admin"
  >("Viewer");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [userRole, setUserRole] = useState<"Admin" | "Viewer">("Viewer");

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [listName, setListName] = useState<string>("Task Manager");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listId && user && user.email) {
      fetchListName();
      fetchTasks();
      fetchTaskListData();
    } else {
      console.error("User, user.email, or listId is undefined:", {
        user,
        listId,
      });
      setLoading(false);
    }
  }, [listId, user]);

  const fetchListName = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const name: string = await getListNameById(listId);
      setListName(name);
    } catch (error) {
      console.error("Error fetching list name:", error);
      setError("Failed to load list name.");
      setListName("Task Manager");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (): Promise<void> => {
    try {
      const fetchedTasks = (await getTasksByListId(listId)) as Task[];
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks.");
    }
  };

  const fetchTaskListData = async (): Promise<void> => {
    try {
      if (!listId) {
        console.error("listId is undefined");
        return;
      }

      const taskList = (await getTaskListById(listId)) as TaskList;
      const participantsList: Participant[] = taskList.participants || [];
      setParticipants(participantsList);

      const ownerEmail: string = taskList.owner;
      setIsOwner(user?.email === ownerEmail);

      const currentUserParticipant: Participant | undefined =
        participantsList.find((p: Participant) => p.email === user?.email);
      const roleFromParticipants: "Admin" | "Viewer" =
        currentUserParticipant?.role || "Viewer";

      setUserRole(user?.email === ownerEmail ? "Admin" : roleFromParticipants);
    } catch (error) {
      console.error("Error fetching task list data:", error);
      setParticipants([]);
      setUserRole("Viewer");
      setIsOwner(false);
      setError("Failed to load task list data.");
    }
  };

  const handleAddTask = async (): Promise<void> => {
    if (userRole !== "Admin") return;
    if (!newTaskName.trim() || !description.trim()) return;
    try {
      await addTaskToList(listId, { name: newTaskName, description });
      setNewTaskName("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task.");
    }
  };

  const handleUpdateTask = async (taskId: string): Promise<void> => {
    if (userRole !== "Admin") return;
    if (!editedTaskName.trim() || !editedTaskDescription.trim()) return;
    try {
      await updateTaskInListWithListId(listId, taskId, {
        name: editedTaskName,
        description: editedTaskDescription,
      });
      setEditingTaskId(null);
      setEditedTaskName("");
      setEditedTaskDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task.");
    }
  };

  const handleDeleteTask = async (
    listId: string,
    taskId: string
  ): Promise<void> => {
    if (userRole !== "Admin") return;
    try {
      await deleteTaskFromList(listId, taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };

  const handleToggleCompletion = async (
    taskId: string,
    completed: boolean
  ): Promise<void> => {
    try {
      await toggleTaskCompletion(listId, taskId, !completed);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling completion:", error);
      setError("Failed to toggle task completion.");
    }
  };

  const handleAddParticipant = async (): Promise<void> => {
    if (userRole !== "Admin") return;
    if (!newParticipantEmail.trim() || !listId) return;
    if (!/\S+@\S+\.\S+/.test(newParticipantEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    if (
      participants.some((p: Participant) => p.email === newParticipantEmail)
    ) {
      alert("This user is already a participant");
      return;
    }
    try {
      const updatedParticipants: Participant[] = [
        ...participants,
        { email: newParticipantEmail, role: newParticipantRole },
      ];
      await updateTaskListParticipants(listId, updatedParticipants);
      setParticipants(updatedParticipants);
      setNewParticipantEmail("");
      setNewParticipantRole("Viewer");
      fetchTaskListData();
    } catch (error) {
      console.error("Error adding participant:", error);
      alert("Failed to add participant");
      setError("Failed to add participant.");
    }
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl">
      {loading ? (
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Loading...
        </h1>
      ) : (
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          {listName}
        </h1>
      )}

      {error && <div className="text-center text-red-600 mb-4">{error}</div>}

      {userRole === "Admin" && (
        <div className="flex mb-8 gap-4">
          <input
            type="text"
            placeholder="New task name"
            className="flex-grow p-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="flex-grow p-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      )}

      {userRole === "Admin" && (
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="email"
              placeholder="Add participant by email"
              className="flex-grow p-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
              value={newParticipantEmail}
              onChange={(e) => setNewParticipantEmail(e.target.value)}
            />
            <select
              className="p-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
              value={newParticipantRole}
              onChange={(e) =>
                setNewParticipantRole(e.target.value as "Viewer" | "Admin")
              }
            >
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center"
              onClick={handleAddParticipant}
            >
              <FaUserPlus className="mr-2" />
              Add Participant
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Participants:
            </h3>
            {participants.length > 0 ? (
              <ul className="list-disc pl-5">
                {participants.map((participant: Participant, index: number) => (
                  <li key={index} className="text-gray-600">
                    {participant.email} - {participant.role}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No participants yet.</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            {editingTaskId === task.id && userRole === "Admin" ? (
              <div className="flex flex-col w-full space-y-3">
                <input
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                />
                <textarea
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 resize-none h-24"
                  value={editedTaskDescription}
                  onChange={(e) => setEditedTaskDescription(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-semibold text-gray-800">
                    {task.name}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">
                  {task.description}
                </span>
              </div>
            )}

            <div className="flex space-x-3 items-center">
              {editingTaskId === task.id && userRole === "Admin" ? (
                <button
                  className="bg-emerald-500 text-white p-2 rounded-full shadow-md hover:bg-emerald-600 transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleUpdateTask(task.id)}
                >
                  <FaCheckCircle size={20} />
                </button>
              ) : userRole === "Admin" ? (
                <button
                  className="bg-amber-500 text-white p-2 rounded-full shadow-md hover:bg-amber-600 transform hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditedTaskName(task.name);
                    setEditedTaskDescription(task.description);
                  }}
                >
                  <FaEdit size={20} />
                </button>
              ) : null}

              {userRole === "Admin" && (
                <button
                  className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleDeleteTask(listId, task.id)}
                >
                  <FaTrashAlt size={20} />
                </button>
              )}

              <Checkbox
                {...label}
                sx={{
                  color: green[800],
                  "&.Mui-checked": {
                    color: green[600],
                  },
                }}
                onChange={() => handleToggleCompletion(task.id, task.completed)}
                checked={task.completed}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPage;
