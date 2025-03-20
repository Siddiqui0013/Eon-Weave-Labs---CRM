import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Edit, X, IdCard, Loader2, Camera } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useState, useRef } from "react";
import { useUpdateUserMutation } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";

interface EmployeeProfileProps {
    employee: {
        name: string;
        profileImage: string;
        email: string;
        cnic: string,
        phone: string;
        address: string;
        jobTitle: string;
        joiningDate: string;
    };
    side?: "left" | "right";
}

export default function EmployeeProfilePreview({ employee: initialEmployee, side = "right" }: EmployeeProfileProps) {
    const { theme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [isEditing, setIsEditing] = useState(false);
    const [employee, setEmployee] = useState(initialEmployee);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setEmployee({ ...employee, profileImage: imageUrl });
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            Object.entries(employee).forEach(([key, value]) => {
                formData.append(key, value);
            });
            if (selectedFile) {
                formData.append('profileImage', selectedFile);
            }
            const response = await updateUser(formData).unwrap();
            console.log("response", response);

            toast({
                variant: "default",
                title: "Success",
                description: "User updated successfully",
                duration: 1500,
            });

            // Reset the selected file after successful update
            setSelectedFile(null);
        } catch (error) {
            console.error('Update error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error Updating User",
                duration: 1500
            })
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setEmployee(initialEmployee);
        setIsEditing(false);
    };

    const changeTheme = (theme: string) => {
        if (theme === '0') {
            localStorage.removeItem('theme');
            document.documentElement.setAttribute('data-theme', '');
        } else {
            localStorage.setItem('theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="profileBtn h-12 w-12 rounded-full bg-secondary"></div>
            </SheetTrigger>
            <SheetContent side={side} className="w-full bg-card p-0">
                <ScrollArea className="h-full">
                    <SheetHeader className="border-b border-gray-800 p-6">
                        <div className="flex justify-between mt-8 items-center">
                            <SheetTitle className="text-gray-100">Employee Profile</SheetTitle>
                            <div className="flex gap-2">
                                {isEditing && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={handleUpdate}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <><IdCard className="h-4 w-4 mr-2" />Save</>
                                        )}
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-white"
                                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                                >
                                    {isEditing ? (
                                        <><X className="h-4 w-4 mr-2" />Cancel</>
                                    ) : (
                                        <><Edit className="h-4 w-4 mr-2" />Edit</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="p-6 h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="relative cursor-pointer"
                                onClick={handleImageClick}
                            >
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={employee.profileImage} alt={employee.name} />
                                    <AvatarFallback className="bg-gray-800 text-gray-100">
                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div>
                                <Input
                                    disabled
                                    value={employee.name}
                                    onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 p-4 rounded-lg bg-gray-800 mb-6">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <Input
                                    disabled
                                    value={employee.email}
                                    onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <Input
                                    disabled={!isEditing}
                                    value={employee.phone}
                                    onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <IdCard className="h-5 w-5 text-gray-400" />
                                <Input
                                    disabled={!isEditing}
                                    value={employee.cnic}
                                    onChange={(e) => setEmployee({ ...employee, cnic: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <Input
                                    disabled={!isEditing}
                                    value={employee.address}
                                    onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gray-800">
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Job Title</h3>
                                <Input
                                    disabled
                                    value={employee.jobTitle}
                                    onChange={(e) => setEmployee({ ...employee, jobTitle: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                />
                            </div>
                            <div className="p-4 rounded-lg bg-gray-800">
                                <h3 className="text-sm font-medium text-gray-400 mb-1">Joining Date</h3>
                                <Input
                                    disabled
                                    value={employee.joiningDate.slice(0, 10)}
                                    onChange={(e) => setEmployee({ ...employee, joiningDate: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-gray-100"
                                />
                            </div>
                        </div>
                        {/* Theme */}
                        <div className="w-full mt-6 p-4 rounded-lg bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Theme</h3>
                            <Select
                                value={selectedTheme}
                                onValueChange={(value) => {
                                    setSelectedTheme(value);
                                    changeTheme(value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0" className="relative">
                                        Default
                                        <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
                                            <div className="h-4 w-4 bg-[#E75B10] rounded-full"></div>
                                            <div className="h-4 w-4 bg-[#3F3F3F] rounded-full"></div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="secondary" className="relative">
                                        Secondary
                                        <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
                                            <div className="h-4 w-4 bg-[#6379F4] rounded-full"></div>
                                            <div className="h-4 w-4 bg-[#3F3F3F] rounded-full"></div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cyber" className="relative">
                                        Cyber
                                        <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
                                            <div className="h-4 w-4 bg-[#7b2cbf] rounded-full"></div>
                                            <div className="h-4 w-4 bg-[#10002b] rounded-full"></div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="golden" className="relative">
                                        Golden
                                        <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
                                            <div className="h-4 w-4 bg-[#ffbd00] rounded-full"></div>
                                            <div className="h-4 w-4 bg-[#3F3F3F] rounded-full"></div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="neon" className="relative">
                                        Neon Lime
                                        <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
                                            <div className="h-4 w-4 bg-[#2a9d8f] rounded-full"></div>
                                            <div className="h-4 w-4 bg-[#264653] rounded-full"></div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cyan" className="relative">
                                        Cyan
                                        <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
                                            <div className="h-4 w-4 bg-[#00b4d8] rounded-full"></div>
                                            <div className="h-4 w-4 bg-[#03045e] rounded-full"></div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}





// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { Input } from "@/components/ui/input";
// import { Mail, Phone, MapPin, Edit, X, IdCard, Loader2 } from "lucide-react";
// import useTheme from "@/hooks/useTheme";
// import { useState } from "react";
// import { useUpdateUserMutation } from "@/services/userApi";
// import { useToast } from "@/hooks/use-toast";

// interface EmployeeProfileProps {
//     employee: {
//         name: string;
//         profileImage: string;
//         email: string;
//         cnic: string,
//         phone: string;
//         address: string;
//         jobTitle: string;
//         joiningDate: string;
//     };
//     side?: "left" | "right";
// }

// export default function EmployeeProfilePreview({ employee: initialEmployee, side = "right" }: EmployeeProfileProps) {
//     const { theme } = useTheme();
//     const [selectedTheme, setSelectedTheme] = useState(theme);
//     const [isEditing, setIsEditing] = useState(false);
//     const [employee, setEmployee] = useState(initialEmployee);
//     const [updateUser, { isLoading }] = useUpdateUserMutation();
//     const { toast } = useToast();

//     const handleUpdate = async () => {
//         console.log('Updated employee:', employee);
//         try {
//             const response = await updateUser(employee).unwrap();
//             console.log(response);
//             toast({
//                 variant: "default",
//                 title: "Success",
//                 description: "User updated successfully",
//                 duration: 1500,
//             });
//         } catch {
//             toast({
//                 variant: "destructive",
//                 title: "Error",
//                 description: "Error Updating User",
//                 duration : 1500
//             })
//         }
//         setIsEditing(false);
//     };

//     const handleCancel = () => {
//         setEmployee(initialEmployee);
//         setIsEditing(false);
//     };

//     const changeTheme = (theme: string) => {
//         if (theme === '0') {
//             localStorage.removeItem('theme');
//             document.documentElement.setAttribute('data-theme', '');
//         } else {
//             localStorage.setItem('theme', theme);
//             document.documentElement.setAttribute('data-theme', theme);
//         }
//     }

//     return (
//         <Sheet>
//             <SheetTrigger asChild>
//                 <div className="profileBtn h-12 w-12 rounded-full bg-secondary"></div>
//             </SheetTrigger>
//             <SheetContent side={side} className="w-full bg-card p-0">
//                 <ScrollArea className="h-full">
//                     <SheetHeader className="border-b border-gray-800 p-6">
//                         <div className="flex justify-between mt-8 items-center">
//                             <SheetTitle className="text-gray-100">Employee Profile</SheetTitle>
//                             <div className="flex gap-2">
//                                 {isEditing && (
//                                     <Button
//                                         size="sm"
//                                         className="bg-green-600 hover:bg-green-700 text-white"
//                                         onClick={handleUpdate}
//                                     >
//                                         {isLoading ? (
//                                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                         ) : (
//                                             <><IdCard className="h-4 w-4 mr-2" />Save</>
//                                         )}
//                                     </Button>
//                                 )}
//                                 <Button
//                                     size="sm"
//                                     className="bg-primary hover:bg-primary/90 text-white"
//                                     onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
//                                 >
//                                     {isEditing ? (
//                                         <><X className="h-4 w-4 mr-2" />Cancel</>
//                                     ) : (
//                                         <><Edit className="h-4 w-4 mr-2" />Edit</>
//                                     )}
//                                 </Button>
//                             </div>
//                         </div>
//                     </SheetHeader>

//                     <div className="p-6 h-full">
//                         <div className="flex items-center gap-4 mb-6">
//                             <Avatar className="h-16 w-16">
//                                 <AvatarFallback className="bg-gray-800 text-gray-100">
//                                     {employee.name.split(' ').map(n => n[0]).join('')}
//                                 </AvatarFallback>
//                             </Avatar>
//                             <div>
//                                 <Input
//                                     disabled
//                                     value={employee.name}
//                                     onChange={(e) => setEmployee({...employee, name: e.target.value})}
//                                     className="bg-gray-800 border-gray-700 text-gray-100"
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-4 p-4 rounded-lg bg-gray-800 mb-6">
//                             <div className="flex items-center gap-3">
//                                 <Mail className="h-5 w-5 text-gray-400" />
//                                 <Input
//                                     disabled
//                                     value={employee.email}
//                                     onChange={(e) => setEmployee({...employee, email: e.target.value})}
//                                     className="bg-gray-800 border-gray-700 text-gray-100"
//                                 />
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <Phone className="h-5 w-5 text-gray-400" />
//                                 <Input
//                                     disabled={!isEditing}
//                                     value={employee.phone}
//                                     onChange={(e) => setEmployee({...employee, phone: e.target.value})}
//                                     className="bg-gray-800 border-gray-700 text-gray-100"
//                                 />
//                             </div>

//                             <div className="flex items-center gap-3">
//                                 <IdCard className="h-5 w-5 text-gray-400" />
//                                 <Input
//                                     disabled={!isEditing}
//                                     value={employee.cnic}
//                                     onChange={(e) => setEmployee({...employee, cnic: e.target.value})}
//                                     className="bg-gray-800 border-gray-700 text-gray-100"
//                                 />
//                             </div>

//                             <div className="flex items-center gap-3">
//                                 <MapPin className="h-5 w-5 text-gray-400" />
//                                 <Input
//                                     disabled={!isEditing}
//                                     value={employee.address}
//                                     onChange={(e) => setEmployee({...employee, address: e.target.value})}
//                                     className="bg-gray-800 border-gray-700 text-gray-100"
//                                 />
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <div className="p-4 rounded-lg bg-gray-800">
//                                 <h3 className="text-sm font-medium text-gray-400 mb-1">Job Title</h3>
//                                 <Input
//                                     disabled
//                                     value={employee.jobTitle}
//                                     onChange={(e) => setEmployee({...employee, jobTitle: e.target.value})}
//                                     className="bg-gray-800 border-gray-700 text-gray-100"
//                                 />
//                             </div>
//                             <div className="p-4 rounded-lg bg-gray-800">
//                                 <h3 className="text-sm font-medium text-gray-400 mb-1">Joining Date</h3>
//                                 <Input
//                                     disabled
//                                     value={employee.joiningDate.slice(0, 10)}
//                                     onChange={(e) => setEmployee({...employee, joiningDate: e.target.value})}
//                                     className="bg-gray-800 border-gray-700 text-gray-100"
//                                 />
//                             </div>
//                         </div>

//                         <div className="w-full mt-6 p-4 rounded-lg bg-gray-800">
//                             <h3 className="text-sm font-medium text-gray-400 mb-2">Theme</h3>
//                             <Select
//                                 value={selectedTheme}
//                                 onValueChange={(value) => {
//                                     setSelectedTheme(value);
//                                     changeTheme(value);
//                                 }}
//                             >
//                                 <SelectTrigger className="w-full">
//                                     <SelectValue placeholder="Select Theme" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="0" className="relative">
//                                         Default
//                                         <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
//                                             <div className="h-4 w-4 bg-[#E75B10] rounded-full"></div>
//                                             <div className="h-4 w-4 bg-[#3F3F3F] rounded-full"></div>
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="secondary" className="relative">
//                                         Secondary
//                                         <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
//                                             <div className="h-4 w-4 bg-[#6379F4] rounded-full"></div>
//                                             <div className="h-4 w-4 bg-[#3F3F3F] rounded-full"></div>
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="cyber" className="relative">
//                                         Cyber
//                                         <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
//                                             <div className="h-4 w-4 bg-[#7b2cbf] rounded-full"></div>
//                                             <div className="h-4 w-4 bg-[#10002b] rounded-full"></div>
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="golden" className="relative">
//                                         Golden
//                                         <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
//                                             <div className="h-4 w-4 bg-[#ffbd00] rounded-full"></div>
//                                             <div className="h-4 w-4 bg-[#3F3F3F] rounded-full"></div>
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="neon" className="relative">
//                                         Neon Lime
//                                         <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
//                                             <div className="h-4 w-4 bg-[#2a9d8f] rounded-full"></div>
//                                             <div className="h-4 w-4 bg-[#264653] rounded-full"></div>
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="cyan" className="relative">
//                                         Cyan
//                                         <div className="flex gap-1 absolute top-1/2 -translate-y-1/2 right-1">
//                                             <div className="h-4 w-4 bg-[#00b4d8] rounded-full"></div>
//                                             <div className="h-4 w-4 bg-[#03045e] rounded-full"></div>
//                                         </div>
//                                     </SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//                 </ScrollArea>
//             </SheetContent>
//         </Sheet>
//     );
// }