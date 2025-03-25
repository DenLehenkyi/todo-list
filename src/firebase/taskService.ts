import {
  collection,
  doc,
  getDocs,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getTasksByListId = async (listId: string) => {
  try {
    const q = query(collection(db, `taskLists/${listId}/tasks`));
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tasks;
  } catch (error) {
    throw new Error(`Error getting tasks: ${(error as any).message}`);
  }
};

export const addTaskToList = async (
  listId: string,
  taskData: { name: string; description?: string }
) => {
  try {
    const newTaskRef = await addDoc(
      collection(db, `taskLists/${listId}/tasks`),
      {
        ...taskData,
        completed: false,
      }
    );
    return newTaskRef.id;
  } catch (error) {
    throw new Error(`Error adding task: ${(error as any).message}`);
  }
};

export const updateTaskInListWithListId = async (
  listId: string,
  taskId: string,
  updates: { name?: string; description?: string }
) => {
  try {
    const taskRef = doc(db, `taskLists/${listId}/tasks`, taskId);
    await updateDoc(taskRef, updates);
  } catch (error) {
    throw new Error(`Error updating task: ${(error as any).message}`);
  }
};

export const deleteTaskFromList = async (listId: string, taskId: string) => {
  try {
    const taskRef = doc(db, `taskLists/${listId}/tasks`, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw new Error(`Error deleting task: ${(error as any).message}`);
  }
};

export const toggleTaskCompletion = async (
  taskListId: string,
  taskId: string,
  completed: boolean
) => {
  try {
    const taskRef = doc(db, `taskLists/${taskListId}/tasks`, taskId);
    await updateDoc(taskRef, { completed });
  } catch (error) {
    throw new Error(
      `Error toggling task completion: ${(error as any).message}`
    );
  }
};
