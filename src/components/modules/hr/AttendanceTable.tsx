import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Employee {
    date: string
    name: string
    avatar: string
    role: string
    employmentType: "Full-Time" | "Part-Time"
    status: "Present" | "Absent" | "Late"
    checkIn: string
    checkOut: string
    overTime: string
}

const employees: Employee[] = [
    {
        date: "13/01",
        name: "Aisha Doe",
        avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EWL_CRM_dashboard-ByeODIAtHVmr5mrW2PjkYrS8sI97eY.png",
        role: "HR Manager",
        employmentType: "Full-Time",
        status: "Present",
        checkIn: "09:00 AM",
        checkOut: "05:00 PM",
        overTime: "0h",
    },
    {
        date: "13/01",
        name: "Chukwuemeka",
        avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EWL_CRM_dashboard-ByeODIAtHVmr5mrW2PjkYrS8sI97eY.png",
        role: "Software Engineer",
        employmentType: "Part-Time",
        status: "Absent",
        checkIn: "-",
        checkOut: "-",
        overTime: "0h",
    },
    {
        date: "13/01",
        name: "Suleiman",
        avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EWL_CRM_dashboard-ByeODIAtHVmr5mrW2PjkYrS8sI97eY.png",
        role: "Marketing Executive",
        employmentType: "Full-Time",
        status: "Late",
        checkIn: "10:15 AM",
        checkOut: "05:00 PM",
        overTime: "0h",
    },
    {
        date: "13/01",
        name: "Amide",
        avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EWL_CRM_dashboard-ByeODIAtHVmr5mrW2PjkYrS8sI97eY.png",
        role: "Financial Analyst",
        employmentType: "Full-Time",
        status: "Present",
        checkIn: "09:00 AM",
        checkOut: "06:00 PM",
        overTime: "1h",
    },
    {
        date: "13/01",
        name: "Side",
        avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EWL_CRM_dashboard-ByeODIAtHVmr5mrW2PjkYrS8sI97eY.png",
        role: "Project Manager",
        employmentType: "Full-Time",
        status: "Present",
        checkIn: "09:00 AM",
        checkOut: "05:00 PM",
        overTime: "0h",
    },
]

export default function AttendanceTable() {
    return (
        <div className="rounded-lg border bg-card text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Employee</TableHead>
                        <TableHead className="text-muted-foreground">Role</TableHead>
                        <TableHead className="text-muted-foreground">Employment Type</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Check In</TableHead>
                        <TableHead className="text-muted-foreground">Check Out</TableHead>
                        <TableHead className="text-muted-foreground">Over Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={`${employee.date}-${employee.name}`} className="border-b border-border hover:bg-muted/50">
                            <TableCell className="font-medium">{employee.date}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={employee.avatar} alt={employee.name} />
                                        <AvatarFallback>{employee.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{employee.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{employee.role}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={
                                        employee.employmentType === "Full-Time"
                                            ? "bg-purple-500/20 text-purple-500 hover:bg-purple-500/20 hover:text-purple-500"
                                            : "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500"
                                    }
                                >
                                    {employee.employmentType}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={
                                        employee.status === "Present"
                                            ? "bg-green-500/20 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                                            : employee.status === "Absent"
                                                ? "bg-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                                                : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500"
                                    }
                                >
                                    {employee.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{employee.checkIn}</TableCell>
                            <TableCell>{employee.checkOut}</TableCell>
                            <TableCell>{employee.overTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

