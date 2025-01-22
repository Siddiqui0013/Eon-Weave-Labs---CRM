import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { useUpdateMeetingMutation } from "@/services/meetingApi";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Edit } from "lucide-react";

const formSchema = z.object({
	_id: z.string(),
	clientName: z.string().min(1, "Client name is required"),
	clientEmail: z.string().email("Invalid email address"),
	projectName: z.string().min(1, "Project name is required"),
	description: z.string().min(1, "Description is required"),
	status: z.string().min(1, "Status is required"),
	meetingLink: z.string().min(1, "Meeting link is required"),
	scheduleDate: z.string().min(1, "Schedule date is required"),
});

type EditFormData = z.infer<typeof formSchema>;

interface EditScheduleProps {
	meetingData: EditFormData;
}

const EditSchedule = ({ meetingData }: EditScheduleProps) => {
	const { toast } = useToast();
	const [updateMeeting] = useUpdateMeetingMutation();
	// const [meeting, setMeeting] = useState<EditFormData | null>(null);
	const form = useForm<EditFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			_id: meetingData._id,
			clientName: meetingData.clientName,
			clientEmail: meetingData.clientEmail,
			projectName: meetingData.projectName,
			description: meetingData.description,
			status: meetingData.status,
			meetingLink: meetingData.meetingLink,
			scheduleDate: meetingData.scheduleDate,
		},
	});

	useEffect(() => {
		if (meetingData) {
			form.reset(meetingData);
			// setMeeting(meetingData);
		}
	}, [meetingData, form]);

	const onSubmit = async (data: EditFormData) => {
		try {
			const response = await updateMeeting(data).unwrap();
			console.log(response);
			toast({
				variant: "default",
				title: "Success",
				description: "Meeting updated successfully",
				duration: 1500,
			});
		} catch (error) {
			console.error(error);
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to update meeting",
				duration: 1500,
			});
		}
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Edit className="w-4 h-4 cursor-pointer text-green-200" />
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[800px] bg-gray-900 border-gray-800"
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="text-gray-100">
						Edit Schedule Meeting
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="clientName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-200">
												Client Name
											</FormLabel>
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
											<FormLabel className="text-gray-200">
												Client Email
											</FormLabel>
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

                                <div className="b">
                                <FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-200">Status</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
                                </div>
							</div>

							<div className="space-y-4">
								<FormField
									control={form.control}
									name="projectName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-200">
												Project Name
											</FormLabel>
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

								<FormField
									control={form.control}
									name="scheduleDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-gray-200">
												Schedule Date & Time
											</FormLabel>
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
											<FormLabel className="text-gray-200">
												Description
											</FormLabel>
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
							<Button
								type="submit"
								className="bg-primary hover:bg-primary/90"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting
									? "Saving Updates..."
									: "Save Updates"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditSchedule;
