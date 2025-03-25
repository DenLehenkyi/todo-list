import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signInWithCustomToken,
} from "firebase/auth";

import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";

interface UserData {
  email: string;
  uid: string;
  role: string;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role,
      name: name,
      uid: user.uid,
    });

    return {
      uid: user.uid,
      token: user.refreshToken,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// export const loginUser = async (email: string, password: string) => {
//   const auth = getAuth();
//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     const userRole = await getUserRole(user.uid);

//     return {
//       uid: user.uid,
//       email: user.email,
//       role: userRole,
//       token: await user.getIdToken(),
//     };
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };
export const loginUser = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const token = await user.getIdToken();

    const userData = await getUserByUid(user.uid);
    if (!userData) {
      throw new Error(
        "User does not exist in the database. Please register first."
      );
    }

    return {
      uid: user.uid,
      email: user.email,
      role: userData.role || "user",
      token,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "Failed to log in. Please check your credentials."
      );
    } else {
      throw new Error("Failed to log in. Please check your credentials.");
    }
  }
};

const getUserRole = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return "Viewer";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "Viewer";
  }
};

export const verifyTokenWithFirebase = async (token: string) => {
  try {
    const auth = getAuth();
    await signInWithCustomToken(auth, token);
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

export const getUserByUid = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error checking user in Firestore: ${error.message}`);
    } else {
      throw new Error("Error checking user in Firestore: unknown error");
    }
  }
};
