import auth from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router";
import { useState } from "react";

const LoginForm = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen ">
      <div className=" max-w-md">
        <div className="shadow-md rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Account</h2>
          <p className="text-gray-600 text-sm text-center mb-6">Please enter your email and password to continue</p>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="**********"
            />
            <a className="inline-block align-baseline font-bold text-sm" href="#">
              Forgot Password?
            </a>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 transition duration-150 ease-in-out" />
              <span className="ml-2 text-gray-700 text-sm">Remember me</span>
            </label>
          </div>

          <div className="mt-8">
            <button
              className="w-full bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In  
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;