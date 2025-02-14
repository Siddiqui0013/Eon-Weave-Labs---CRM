import Card from '@/components/common/Card'
import { TriangleAlert, Logs, ClipboardList } from 'lucide-react'
import ReusableTable from '@/components/common/Table'
import { useState } from 'react';

interface TasksProps {
    id: number;
    taskName: string;
    projectName: string;
    dueDate: string;
    priority: string;
    status: string;
    action: string;
}

interface Column<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

const TaskAssigned = () => {
    const dummyTasks = [
        {
            id: 1,
            taskName: "Task 1",
            projectName: "Project 1",
            dueDate: "2023-06-01",
            priority: "High",
            status: "In Progress",
        },
        {
            id: 2,
            taskName: "Task 2",
            projectName: "Project 2",
            dueDate: "2023-06-02",
            priority: "Medium",
            status: "Completed",
        },
        {
            id: 3,
            taskName: "Task 3",
            projectName: "Project 3",
            dueDate: "2023-06-03",
            priority: "Low",
            status: "Pending",
        },
        {
            id: 4,
            taskName: "Task 4",
            projectName: "Project 4",
            dueDate: "2023-06-04",
            priority: "High",
            status: "In Progress",
        },
        {
            id: 5,
            taskName: "Task 5",
            projectName: "Project 5",
            dueDate: "2023-06-05",
            priority: "Medium",
            status: "Completed",
        },
    ]
    const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 5;

    const columns: Column<TasksProps>[] = [
        { label: "Task Name", key: "taskName" },
        { label: "Project Name", key: "projectName" },
        { label: "Due Date", key: "dueDate" },
        { label: "Priority", key: "priority" },
        {
            label: "Status",
            key: "status",
            render: (_: unknown) => {
                return (
                    <select className='w-full p-3'>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                )
            }
        },
    ]
    return (
        <div>
            <div>
                <h4 className='my-3 text-2xl font-semibold'>Tasks Overview</h4>
                <div className="my-4 grid md:grid-cols-3 grid-cols-2 gap-6 grid-flow-row w-[100%]">
                    <Card data={{ icon: <ClipboardList />, title: "Total Tasks", val: "20" }} />
                    <Card data={{ icon: <Logs />, title: "Tasks Due Today", val: "10" }} />
                    <Card data={{ icon: <TriangleAlert />, title: "Tasks Overdue", val: "12" }} />
                </div>
            </div>
            <div>
                <h4 className='text-xl mt-6 mb-2'>Tasks List</h4>
                <div className="w-[370px] md:w-full md:mt-8 mt-20 overflow-auto">
                    <ReusableTable
                        columns={columns}
                        data={dummyTasks}
                        isLoading={false}
                        totalPages={1}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default TaskAssigned