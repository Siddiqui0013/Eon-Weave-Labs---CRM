import { useState } from "react";
// import { useRegisterMutation } from "@/services/userApi";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router";
import Button from "./Button";
// import { Loader2 } from "lucide-react";

export const RegisterForm = () => {
  
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [cnic, setCnic] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [login, { isLoading }] = useLoginMutation();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!email || !password) {
//       return toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Please fill all the fields",
//         duration: 1500,
//       });
//     }
//     try {
//       const credentials = { email, password };
//       const response = await login(credentials).unwrap();
//       const data = response.data;

//       localStorage.setItem("accessToken", data.accessToken);
//       localStorage.setItem("refreshToken", data.refreshToken);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       navigate(`/${data.user.role}/dashboard`);

//       toast({
//         variant: "default",
//         title: "Success",
//         description: "Login successful",
//         duration: 1500,
//       });

//     } catch (error: unknown) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description:  "Invalid email or password",
//         duration: 1500,
//       });
//       console.log("Error logging in:", error);
//     }
//   }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="flex w-full items-center justify-center lg:min-h-[90vh] min-h-screen">
        <div className="shadow-md rounded-lg sm:px-8 px-4 pt-4 pb-5 md:pt-0 md:pb-0">
          <h2 className="text-2xl font-bold mb-6 text-center">Register your Account</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Fill in the form below to create an account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:mb-4 mb-2 ">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="**********"
              />
            </div>

            <div className="md:mb-4 mb-2 ">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="password">
               Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="Confirmpassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                placeholder="**********"
              />
            </div>

            <div className="md:mb-4 mb-2 ">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="cnic">
                CNIC
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="cnic"
                onChange={(e) => setCnic(e.target.value)}
                value={cnic}
                type="text"
                placeholder="XXXXX-XXXXXXX-X"
              />
            </div>

            <div className="md:mb-4 mb-2 ">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                type="text"
                placeholder="03XXXXXXXXX"
              />
            </div>

            <div className="md:mb-4 mb-2 ">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                placeholder="Enter your address"
              />
            </div>

            </div>

            <div className="mt-6">
              <Button
                title={"Register"}
                // title={isLoading ? "Signing in..." : "Sign In"}
                // disabled={isLoading}
                // icon={isLoading && <Loader2 className="animate-spin" />}
                type="submit"
                className="w-full justify-center font-semibold text-lg"
              />
            </div>
          </form>
        </div>
      </div>
  );
};
