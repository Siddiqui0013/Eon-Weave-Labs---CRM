import { useState } from "react";
import { useLoginMutation } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import Button from "./Button";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all the fields",
        duration: 1500,
      });
    }
    try {
      const credentials = { email, password };
      const response = await login(credentials).unwrap();
      const data = response.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(`/${data.user.role}/dashboard`);

      toast({
        variant: "default",
        title: "Success",
        description: "Login successful",
        duration: 1500,
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.data?.message || "Invalid email or password",
        duration: 1500,
      });
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-center lg:min-h-[90vh] min-h-screen">
      <div className="max-w-md">
        <div className="shadow-md rounded-lg sm:px-8 px-4 pt-4 pb-5 md:pt-0 md:pb-0">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Account</h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Please enter your email and password to continue
          </p>

          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="**********"
              />
              <a className="inline-block align-baseline font-bold text-sm" href="#">
                Forgot Password?
              </a>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-gray-700 text-sm">Remember me</span>
              </label>
            </div>

            <div className="mt-8">
              <Button
                title={isLoading ? "Signing in..." : "Sign In"}
                disabled={isLoading}
                icon={isLoading && <Loader2 className="animate-spin" />}
                type="submit"
                className="w-full justify-center font-semibold text-lg"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;





// import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase";
// import { useNavigate } from "react-router";
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setRole } from "../../redux/slices/userSlice";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userDoc = doc(db, "userData", user.uid);
//           const userData = await getDoc(userDoc);
//           if (userData.exists()) {
//             const userRole = userData.data().role;
//             dispatch(setRole(userRole));
//             navigate(`/${userRole}/dashboard`);
//           } else {
//             console.error("User role not found");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [dispatch, navigate]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       const userDoc = doc(db, "userData", user.uid);
//       const userData = await getDoc(userDoc);

//       if (userData.exists()) {
//         const userRole = userData.data().role;
//         dispatch(setRole(userRole));
//         navigate(`/${userRole}/dashboard`);
//       } else {
//         setError("User role not found.");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       setError("Invalid email or password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full items-center justify-center min-h-screen">
//       <div className="max-w-md">
//         <div className="shadow-md rounded-lg px-8 pt-6 pb-8">
//           <h2 className="text-2xl font-bold mb-6 text-center">Login to Account</h2>
//           <p className="text-gray-600 text-sm text-center mb-6">
//             Please enter your email and password to continue
//           </p>

//           {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                 Email
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="email"
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//                 type="email"
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                 Password
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                 id="password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//                 type="password"
//                 placeholder="**********"
//                 required
//               />
//               <a className="inline-block align-baseline font-bold text-sm" href="#">
//                 Forgot Password?
//               </a>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-4 w-4 transition duration-150 ease-in-out"
//                 />
//                 <span className="ml-2 text-gray-700 text-sm">Remember me</span>
//               </label>
//             </div>

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 className="w-full bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                 disabled={loading}
//               >
//                 {loading ? "Signing In..." : "Sign In"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;