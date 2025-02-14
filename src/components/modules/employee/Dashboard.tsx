import TopButtons from "@/components/common/TopButtons"
import useAuth from "@/hooks/useAuth"
import { FolderKanban, ClipboardList, BookCheck, LaptopMinimalCheck } from "lucide-react"
import Card from "@/components/common/Card";

const Dashboard = () => {
    const { user } = useAuth();
    const name = user?.name || "";
    return (
        <div>
            <div className="top flex w-[100%] md:mt-4 mt-20 my-4 p-0 justify-between">
                <h1 className="text-4xl">Hi , {name} </h1>
                <div className="flex gap-2">
                    <div className="hidden md:block">
                        <TopButtons />
                    </div>
                </div>
            </div>
            <div className=" my-4 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 grid-flow-row w-[100%]">
                <Card
                    data={{
                        icon: <FolderKanban />,
                        title: "Projects",
                        val: "20",
                    }}
                />
                <Card
                    data={{
                        icon: <ClipboardList />,
                        title: "Tasks",
                        val: "20",
                    }}
                />
                <Card
                    data={{
                        icon: <BookCheck />,
                        title: "Completed Tasks",
                        val: "20",
                    }}
                />
                <Card
                    data={{
                        icon: <LaptopMinimalCheck />,
                        title: "Completed Projects",
                        val: "20",
                    }}
                />
            </div>
        </div>
    )
}

export default Dashboard