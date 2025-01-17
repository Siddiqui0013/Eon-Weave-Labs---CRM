import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Edit } from "lucide-react";
import { RootState } from "@/redux/Store"
import { useSelector } from "react-redux";
import { useEffect } from "react";


interface EmployeeProfileProps {
    employee: {
        name: string;
        status: string;
        email: string;
        phone: string;
        location: string;
        jobTitle: string;
        department: string;
        employmentType: string;
        joiningDate: string;
        avatarUrl?: string;
    };
    side?: "left" | "right";
}

export default function EmployeeProfilePreview({ employee, side = "right" }: EmployeeProfileProps) {

    const { user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        console.log("User:", user);
    }, [user]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="profileBtn h-12 w-12 rounded-full bg-secondary"></div>
            </SheetTrigger>
            <SheetContent
                side={side}
                className="max-w-xl bg-gray-900 border-gray-800 p-0"
            >
                <SheetHeader className="border-b border-gray-800 p-6">
                    <div className="flex justify-between mt-8 items-center">
                        <SheetTitle className="text-gray-100">Employee Profile</SheetTitle>
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={() => console.log('Edit clicked')}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </SheetHeader>

                <div className="p-6 overflow-y-auto h-full">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={employee.avatarUrl} />
                            <AvatarFallback className="bg-gray-800 text-gray-100">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-100">{ user.name}</h2>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 p-4 rounded-lg bg-gray-800 mb-6">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span>{user.address}</span>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Job Title</h3>
                            <p className="text-gray-100">{user.jobTitle}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Employment Type</h3>
                            <p className="text-gray-100">{employee.employmentType}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Department</h3>
                            <p className="text-gray-100">{employee.department}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Joining Date</h3>
                            <p className="text-gray-100">{user.createdAt}</p>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

