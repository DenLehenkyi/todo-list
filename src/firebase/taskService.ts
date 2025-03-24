import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createTaskList = async (
  taskListName: string,
  userEmail: string
) => {
  try {
    const newTaskListRef = await addDoc(collection(db, "taskLists"), {
      name: taskListName,
      owner: userEmail,
      participants: [userEmail],
    });
    return newTaskListRef.id;
  } catch (error) {
    throw new Error(`Error creating task list: ${error.message}`);
  }
};

export const getTaskLists = async (userEmail: string) => {
  try {
    const q = query(
      collection(db, "taskLists"),
      where("owner", "==", userEmail)
    );
    const querySnapshot = await getDocs(q);
    const taskLists = querySnapshot.docs.map((doc) => doc.data());
    return taskLists;
  } catch (error) {
    throw new Error(`Error getting task lists: ${error.message}`);
  }
};

export const updateTaskList = async (taskListId: string, newName: string) => {
  try {
    const taskListRef = doc(db, "taskLists", taskListId);
    await updateDoc(taskListRef, { name: newName });
  } catch (error) {
    throw new Error(`Error updating task list: ${error.message}`);
  }
};

export const updateTaskListParticipants = async (
  taskListId: string,
  participants: []
) => {
  try {
    const taskListRef = doc(db, "taskLists", taskListId);
    await updateDoc(taskListRef, { participants: participants });
  } catch (error) {
    throw new Error(`Error updating task list: ${error.message}`);
  }
};

export const deleteTaskList = async (taskListId: string) => {
  try {
    const taskListRef = doc(db, "taskLists", taskListId);
    await deleteDoc(taskListRef);
  } catch (error) {
    throw new Error(`Error deleting task list: ${error.message}`);
  }
};

export const createTask = async (
  taskListId: string,
  taskName: string,
  taskDescription: string
) => {
  try {
    const newTaskRef = await addDoc(
      collection(db, `taskLists/${taskListId}/tasks`),
      {
        name: taskName,
        description: taskDescription,
        completed: false,
      }
    );
    return newTaskRef.id;
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
};

interface Task {
  taskName: string;
  taskDescription: string;
  completed: boolean;
}
export const getTasks = async (taskListId: string) => {
  try {
    const q = query(collection(db, `taskLists/${taskListId}/tasks`));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => doc.data());
    return tasks;
  } catch (error) {
    throw new Error(`Error getting tasks: ${error.message}`);
  }
};

export const updateTask = async (
  taskListId: string,
  taskId: string,
  newName: string,
  newDescription: string
) => {
  try {
    const taskRef = doc(db, `taskLists/${taskListId}/tasks`, taskId);
    await updateDoc(taskRef, { name: newName, description: newDescription });
  } catch (error) {
    throw new Error(`Error updating task: ${error.message}`);
  }
};

export const deleteTask = async (taskListId: string, taskId: string) => {
  try {
    const taskRef = doc(db, `taskLists/${taskListId}/tasks`, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error(`Error deleting task: ${error.message}`);
  }
};

export const toggleTaskCompletion = async (
  taskListId: string,
  taskId: string,
  completed: boolean
) => {
  try {
    const taskRef = doc(db, `taskLists/${taskListId}/tasks`, taskId);
    await updateDoc(taskRef, { completed: completed });
  } catch (error) {
    throw new Error(`Error toggling task completion: ${error.message}`);
  }
};
