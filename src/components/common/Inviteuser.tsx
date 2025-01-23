import { useState } from "react";
import { useInviteMutation } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";
import Button from "./Button";
import { Loader2 } from "lucide-react";

export const Invite = () => {

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ role, setRole ] = useState("Employee");
    const [ jobTitle, setJobTitle ] = useState("");
    const [ salary, setSalary ] = useState("");
    const [ type, setType ] = useState("full-time");

const { toast } = useToast();
const [invite, { isLoading }] = useInviteMutation();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    try {
        const data = { name, email, role, jobTitle, salary, type };
        console.log("Data:", data);    
        const response = await invite(data).unwrap();
        console.log("Response:", response);
    
        toast({
        variant: "default",
        title: "Success",
        description: "User invited successfully",
        duration: 1500,
        });
    } catch (error: unknown) {
        toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred",
        duration: 1500,
        });
        console.log("Error:", error);
    }
}
  return (
    <div className="flex w-full items-center justify-center lg:min-h-[90vh] min-h-screen">
        <div className="shadow-lg mx-2 mt-6 bg-card px-4 py-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Invite a User to Eon Weave Labs</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Fill in the form below to invite
          </p>

          <form onSubmit={handleSubmit}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                type="text"
                placeholder="Enter Employee name"
              />
            </div>

            <div className="md:mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Enter Employee email"
              />
            </div>

            <div className="md:mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="role">
                Role
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="role"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <option value="employee">Employee (Designer/Developer) </option>
                <option value="hr">HR</option>
                <option value="bdo">BDO</option>
              </select>
            </div>

            <div className="md:mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="jobTitle">
                Job Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="jobTitle"
                onChange={(e) => setJobTitle(e.target.value)}
                value={jobTitle}
                type="text"
                required
                placeholder="Enter job title"
              />
            </div>

            <div className="md:mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="salary">
                Salary
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="salary"
                onChange={(e) => setSalary(e.target.value)}
                value={salary}
                type="number"
                required
                placeholder="Enter salary"
              />
            </div>

            <div className="md:mb-4">
              <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="type">
                Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="type"
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                <option value="full time">Full Time</option>
                <option value="part time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="probation">Probation</option>
              </select>
            </div>

            </div>
            <div className="mt-8">
              <Button
                title={isLoading ? "Inviting..." : "Invite"}
                disabled={isLoading}
                icon={isLoading && <Loader2 className="animate-spin" />}
                type="submit"
                className="w-full justify-center font-semibold text-lg"
              />
            </div>

          </form>
        </div>
      </div>
  );
};
