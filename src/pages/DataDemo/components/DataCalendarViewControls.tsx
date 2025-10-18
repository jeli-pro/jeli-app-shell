import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppViewManager } from "@/hooks/useAppViewManager.hook";
import type { CalendarDateProp, CalendarDisplayProp } from "../types";

export function CalendarViewControls() {
    const { 
        calendarDateProp, setCalendarDateProp,
        calendarDisplayProps, setCalendarDisplayProps,
        calendarItemLimit, setCalendarItemLimit
    } = useAppViewManager();

    const handleDisplayPropChange = (prop: CalendarDisplayProp, checked: boolean) => {
        const newProps = checked 
            ? [...calendarDisplayProps, prop] 
            : calendarDisplayProps.filter(p => p !== prop);
        setCalendarDisplayProps(newProps);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Calendar Settings</h4>
                        <p className="text-sm text-muted-foreground">
                            Customize the calendar view.
                        </p>
                    </div>
                    <Separator />
                    <div className="grid gap-2">
                        <Label>Date Field</Label>
                        <RadioGroup defaultValue={calendarDateProp} onValueChange={(v) => setCalendarDateProp(v as CalendarDateProp)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dueDate" id="dueDate" />
                                <Label htmlFor="dueDate">Due Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="createdAt" id="createdAt" />
                                <Label htmlFor="createdAt">Created Date</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="updatedAt" id="updatedAt" />
                                <Label htmlFor="updatedAt">Updated Date</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="grid gap-2">
                        <Label>Card Details</Label>
                        {(['priority', 'assignee', 'tags'] as CalendarDisplayProp[]).map(prop => (
                            <div key={prop} className="flex items-center space-x-2">
                                <Checkbox id={prop} checked={calendarDisplayProps.includes(prop)} onCheckedChange={(c) => handleDisplayPropChange(prop, !!c)} />
                                <Label htmlFor={prop} className="capitalize">{prop}</Label>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="show-all">Show all items per day</Label>
                        <Switch id="show-all" checked={calendarItemLimit === 'all'} onCheckedChange={(c) => setCalendarItemLimit(c ? 'all' : 3)} />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}