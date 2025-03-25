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

interface Participant {
  email: string;
  role: "Admin" | "Viewer";
}

export const createTaskList = async (
  taskListName: string,
  userId: string,
  userEmail: string
) => {
  try {
    const ownerParticipant: Participant = {
      email: userEmail,
      role: "Admin",
    };

    const newTaskListRef = await addDoc(collection(db, "taskLists"), {
      name: taskListName,
      userId: userId,
      owner: userEmail,
      participants: [ownerParticipant],
    });

    return newTaskListRef.id;
  } catch (error) {
    throw new Error(`Error creating task list: ${error.message}`);
  }
};

export const getUserTaskLists = async (userEmail: string) => {
  try {
    const ownerQuery = query(
      collection(db, "taskLists"),
      where("owner", "==", userEmail)
    );
    const ownerSnapshot = await getDocs(ownerQuery);

    const participantQuery = query(
      collection(db, "taskLists"),
      where("participants", "array-contains-any", [
        { email: userEmail, role: "Admin" },
        { email: userEmail, role: "Viewer" },
      ])
    );
    const participantSnapshot = await getDocs(participantQuery);

    const ownerLists = ownerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const participantLists = participantSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const combinedLists = [...ownerLists, ...participantLists];
    const uniqueLists = Array.from(
      new Map(combinedLists.map((list) => [list.id, list])).values()
    );

    return uniqueLists;
  } catch (error) {
    throw new Error(`Error retrieving task lists: ${error.message}`);
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
  participants: Participant[]
) => {
  try {
    const taskListRef = doc(db, "taskLists", taskListId);
    await updateDoc(taskListRef, { participants });
  } catch (error) {
    throw new Error(`Error updating participants: ${error.message}`);
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

export const getParticipantsByListId = async (
  listId: string
): Promise<Participant[]> => {
  try {
    const listRef = doc(db, "taskLists", listId);
    const listSnap = await getDoc(listRef);

    if (listSnap.exists()) {
      const data = listSnap.data();
      return data.participants || [];
    } else {
      throw new Error("Task list not found");
    }
  } catch (error) {
    throw new Error(`Error getting participants: ${error.message}`);
  }
};

export const getTaskListById = async (listId: string) => {
  try {
    const listRef = doc(db, "taskLists", listId);
    const listSnap = await getDoc(listRef);

    if (listSnap.exists()) {
      return { id: listSnap.id, ...listSnap.data() };
    } else {
      throw new Error("Task list not found");
    }
  } catch (error) {
    throw new Error(`Error getting task list: ${error.message}`);
  }
};

export const getListNameById = async (listId: string): Promise<string> => {
  try {
    const taskList = await getTaskListById(listId);
    return taskList.name || "Unnamed List";
  } catch (error) {
    throw new Error(`Error getting list name: ${error.message}`);
  }
};
