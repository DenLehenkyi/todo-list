import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/AccountContext";
import TaskList from "./task/TaskList";

export default function Home() {
  const { user, logout, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-col items-center justify-center p-4 bg-gray-100 min-h-screen py-18 px-10">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Task Manager
        </h1>
        <div className="flex-col items-end justify-end absolute top-0 left-0 p-4">
          Welcome, {user.email}
        </div>
        <div className="flex-col items-end justify-end absolute top-0 right-0 p-4">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <TaskList />
    </div>
  );
}
