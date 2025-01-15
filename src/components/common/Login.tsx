import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRole } from "../../redux/slices/userSlice";


const LoginForm = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const [name, setName] = useState("")
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const userRole = name
  dispatch(setRole(userRole));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    console.log("Name:", name);
   
    // const userRole = name
    // dispatch(setRole(userRole));
  
    
    // console.log("Email:", email);
    // console.log("Password:", password);
  }

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen">
      <div className="max-w-md">
        <div className="shadow-md rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to Account</h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Please enter your email and password to continue
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
              />
            </div>

            {/* <div className="mb-4">
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
            </div> */}

            {/* <div className="mb-6">
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
            </div> */}

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
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
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