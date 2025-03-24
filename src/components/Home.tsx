import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/AccountContext";

import TaskList from "./task/TaskList";

export default function Home() {
  const { user, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("user", user);
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  console.log("user", user);

  if (!user) return null;

  return (
    <div className="flex-col items-center justify-center  p-4 bg-gray-100 min-h-screen py-18 px-10 ">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold ">Welcome, {user.email}</h1>
        <div className="flex-col items-end justify-end absolute top-0 right-0 p-4">
          <span className="mr-6">Role: {user.role}</span>
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
