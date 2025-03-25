import { useEffect, useState } from "react";
import { useUser } from "@/contexts/AccountContext";
import { useRouter } from "next/router";
import { loginUser } from "@/firebase/firebaseAuth";
import Link from "next/link";
import { User } from "@/types/types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser, setToken, user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const {
        uid,
        email: loggedInEmail,
        role,
        token,
      } = await loginUser(email, password);

      const userData: User = {
        email: loggedInEmail,
        uid,
        role,
      };

      setUser(userData);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(token);

      router.push("/home");
    } catch (error) {
      const errorMessage = (error as any).message;
      console.error("Login error:", errorMessage);
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-600 rounded-">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm rounded-2xl"
      >
        <h1 className="text-3xl text-gray-900 font-bold mb-6 text-center">
          Login
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
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
            className="text-gray-500 w-full p-2 border border-gray-300 rounded-2xl"
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
          <p className="mt-4 text-center">Don’t have an account?</p>
          <Link href="/register" className="text-purple-900">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
