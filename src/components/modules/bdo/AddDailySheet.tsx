import { Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useAddCallMutation } from "@/services/callsApi";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DailyWorksheetData {
    target: number;
    totalCalls: number;
    connected: number;
    leads: number;
    comment: string;
}

export default function AddDailySheet() {
    
    const { toast } = useToast()
    const [loading, setloading] = useState(false)
    const [addCall] = useAddCallMutation();


    const form = useForm<DailyWorksheetData>({
        defaultValues: {
            target: 100,
            totalCalls: 0,
            connected: 0,
            leads: 0,
            comment: ''
        }
    });

    const onSubmit = async (data: DailyWorksheetData) => {
        setloading(true)
        console.log(data);

        // setTimeout(() => {
        //     setloading(false)
        // }, 1000 )

        try {
            if( data.totalCalls > 1 && data.connected > 1 && data.leads > 1 && data.comment.length > 1) {
            const response =  await addCall(data).unwrap();
            console.log(response);
            form.reset();
            setloading(false)
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
            setloading(false)
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
            setloading(false)
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
                            <label className="text-sm text-gray-300">Target</label>
                            <Input
                                type="number"
                                disabled={true}
                                {...form.register('target')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Total Call</label>
                            <Input
                                type="number"
                                {...form.register('totalCalls')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Connected Calls</label>
                            <Input
                                type="number"
                                {...form.register('connected')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Leads</label>
                            <Input
                                type="number"
                                {...form.register('leads')}
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
                    { loading ? 'Saving...' : 'Submit' }
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
}