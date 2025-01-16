import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ScheduleFormData {
    clientName: string;
    clientEmail: string;
    projectName: string;
    description: string;
    meetingLink: string;
    scheduleDate: string;
}

const CreateScheduleDialog = () => {
    const form = useForm<ScheduleFormData>({
        defaultValues: {
            clientName: "",
            clientEmail: "",
            projectName: "",
            description: "",
            meetingLink: "",
            scheduleDate: "",
        },
    });

    const onSubmit = (data: ScheduleFormData) => {
        const dateTime = new Date(data.scheduleDate);

        console.log({
            ...data,
            scheduleDateTime: dateTime
        });
        // Handle form submission
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-sm bg-primary hover:bg-primary/90">Create Schedule</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-gray-100">Schedule Meeting</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="clientName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Client Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter client name"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="clientEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Client Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter client email"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="projectName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Project Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter project name"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="meetingLink"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Meeting Link</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter meeting link"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="scheduleDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Schedule Date & Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    {...field}
                                                    min={new Date().toISOString().slice(0, 16)}
                                                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter meeting description"
                                                    className="resize-none bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-gray-700 bg-gray-800 text-gray-100 hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                            </DialogTrigger>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90"
                            >
                                Schedule
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateScheduleDialog;
