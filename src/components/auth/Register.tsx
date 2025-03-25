import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { registerUser } from "@/firebase/firebaseAuth";
import { useUser } from "@/contexts/AccountContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const role = "Admin";
      const token = await registerUser(name, email, password, role);

      const newUser = {
        email,
        uid: token.uid,
        role,
        name,
      };

      setUser(newUser);
      localStorage.setItem("authToken", token.token);
      localStorage.setItem("user", JSON.stringify(newUser));

      router.push("/home");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration error:", error.message);
      } else {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-600 ">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm rounded-2xl"
      >
        {" "}
        <h1 className="text-3xl text-center text-gray-900 font-bold mb-6">
          Register
        </h1>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          Register
        </button>
        <div className="flex flex-col items-center justify-center mt-4">
          <p className="mt-4 text-center">Already have an account?</p>
          <Link href="/login" className="text-purple-900">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
