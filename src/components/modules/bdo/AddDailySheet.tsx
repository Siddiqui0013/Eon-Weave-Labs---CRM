import { Check } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface DailyWorksheetData {
    target: number;
    overallCall: number;
    connectCalls: number;
    leads: number;
    comment: string;
}

export default function AddDailySheet() {
    const form = useForm<DailyWorksheetData>({
        defaultValues: {
            target: 100,
            overallCall: 70,
            connectCalls: 20,
            leads: 2,
            comment: ''
        }
    });

    const onSubmit = (data: DailyWorksheetData) => {
        console.log(data);
        // Handle form submission
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 px-4 py-6 flex gap-2 items-center rounded-lg">
                    Daily Worksheet
                    <Check className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-900 border border-gray-800">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Target & Overall Call */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Target</label>
                            <Input
                                type="number"
                                {...form.register('target')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Overall Call</label>
                            <Input
                                type="number"
                                {...form.register('overallCall')}
                                className="bg-gray-800 border-gray-700 text-gray-100"
                            />
                        </div>

                        {/* Connect Calls & Leads */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Connect Calls</label>
                            <Input
                                type="number"
                                {...form.register('connectCalls')}
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

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Comment</label>
                        <Textarea
                            {...form.register('comment')}
                            className="bg-gray-800 border-gray-700 text-gray-100 min-h-[100px] resize-none"
                            placeholder="Add your comment here..."
                        />
                    </div>

                    {/* Save Button */}
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        Save
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
}