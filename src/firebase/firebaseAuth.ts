import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const auth = getAuth();
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
