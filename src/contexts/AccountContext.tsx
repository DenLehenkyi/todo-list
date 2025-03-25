import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserByUid } from "@/firebase/firebaseAuth";
import { User } from "@/types/types";
import { UserContextType } from "@/types/types";

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (typeof window === "undefined") {
          setLoading(false);
          return;
        }

        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          const savedUser = localStorage.getItem("user");

          let userData: User;
          if (savedUser) {
            userData = JSON.parse(savedUser);
          } else {
            const firestoreUser = await getUserByUid(firebaseUser.uid);
            if (!firestoreUser) {
              throw new Error("User does not exist in the database.");
            }
            userData = {
              email: firebaseUser.email || "",
              uid: firebaseUser.uid,
              role: firestoreUser.role || "user",
            };
          }

          setUser(userData);
          setToken(idToken);
          localStorage.setItem("authToken", idToken);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error initializing user:", error.message);
        } else {
          console.error("Error initializing user:", error);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
  }, [user, token]);

  const logout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    });
  };

  return (
    <UserContext.Provider
      value={{ user, token, setUser, setToken, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
