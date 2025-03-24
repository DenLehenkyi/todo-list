import { useState } from "react";
import { useUser } from "@/contexts/AccountContext";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword, getDoc } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useUser();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User:", user);

      const userRole = await getUserRole(user.uid);

      const userData = {
        email: user.email,
        uid: user.uid,
        role: userRole,
      };

      setUser(userData);
      localStorage.setItem("authToken", await user.getIdToken());
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(await user.getIdToken());

      router.push("/home");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const getUserRole = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      // return "Viewer";
    } catch (error) {
      console.error("Error fetching user role:", error);
      // return "Viewer";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-600">
      <h1 className="text-3xl  text-gray-900 font-bold mb-6 ">Login</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className=" text-gray-500 w-full p-2 border border-gray-300 rounded-2xl"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full bg-purple-700 text-white p-2 rounded-4xl hover:bg-purple-800">
          Login
        </button>
        <div className="flex flex-col items-center justify-center mt-4">
          <p className="mt-4 text-center ">Don`t have an account? </p>
          <Link href="register" className="text-purple-900 ">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
