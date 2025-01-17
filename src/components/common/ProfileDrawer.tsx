import { Sheet, SheetContent ,SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Edit } from "lucide-react";

interface EmployeeProfileProps {
    employee: {
        name: string;
        profileImage: string;
        email: string;
        phone: string;
        address: string;
        jobTitle: string;
        joiningDate: string;
    };
    side?: "left" | "right";
}

export default function EmployeeProfilePreview({ employee, side = "right" }: EmployeeProfileProps) {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="profileBtn h-12 w-12 rounded-full bg-secondary"></div>
            </SheetTrigger>
            <SheetContent
                side={side}
                className="w-full bg-card p-0"
            >
            <ScrollArea className="h-full">
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
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-gray-800 text-gray-100">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-100">{ (employee.name).toUpperCase() }</h2>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-lg bg-gray-800 mb-6">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span>{employee.address}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Job Title</h3>
                            <p className="text-gray-100">{employee.jobTitle}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Joining Date</h3>
                            <p className="text-gray-100">{ (employee.joiningDate).slice(0, 10) }</p>
                        </div>
                    </div>
                </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

