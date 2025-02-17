import { Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAddEmployeeWorksheetMutation } from "@/services/EmployeeWorksheetApi";

interface DailyWorksheetData {
    projectNo: string;
    totalKpi: number;
    completedKpi: number;
    pendingKpi: number;
    comment: string;
}

export default function AddDailySheet() {
    
    const { toast } = useToast()
    const [addCall, { isLoading } ] = useAddEmployeeWorksheetMutation();

    const form = useForm<DailyWorksheetData>({
        defaultValues: {
            projectNo: "",
            totalKpi: 0,
            completedKpi: 0,
            pendingKpi: 0,
            comment: "",
        }
    });

    const onSubmit = async (data: DailyWorksheetData) => {
        console.log(data);
        try {
            if( data.projectNo && data.totalKpi && data.completedKpi && data.pendingKpi && data.comment.length > 1) {
            const response =  await addCall(data).unwrap();
            console.log(response);
            form.reset();
            toast({
                variant : 'default',
                title: 'Success',
                description: 'Daily Worksheet added successfully',
                duration: 1500
            })
        }
        else {
            toast({
                variant : 'destructive',
                title: 'Error',
                description: 'Please fill all the fields',
                duration: 1500
            })
        }
        }
        catch (error) {
            console.log(error);
            toast({
                variant : 'destructive',
                title: 'Error',
                description: 'Something went wrong',
                duration: 1500
            })
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-primary text-md hover:bg-primary/90 px-4 py-6 flex gap-2 items-center rounded-lg">
                    Daily Worksheet
                    <Check className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-900 border border-gray-800">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Project Number</label>
                            <Input
                                type="text"
                                {...form.register('projectNo')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">KPIs</label>
                            <Input
                                type="number"
                                {...form.register('totalKpi')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Completed KPIs</label>
                            <Input
                                type="number"
                                {...form.register('completedKpi')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Pending KPIs</label>
                            <Input
                                type="number"
                                {...form.register('pendingKpi')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Comment</label>
                        <Textarea
                            {...form.register('comment')}
                            className="bg-gray-800 border-gray-700 text-gray-100 min-h-[100px] resize-none"
                            placeholder="Add your comment here..."
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                    { isLoading ? 'Saving...' : 'Submit' }
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
}