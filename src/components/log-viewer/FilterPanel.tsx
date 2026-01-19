import { useState } from "react";
import { Search, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FilterPanelProps {
  onSearch: (filters: FilterValues) => void;
}

export interface FilterValues {
  clientId: string;
  repcode: string;
  type: string;
  moduleType: string;
  date: Date | undefined;
}

const typeOptions = [
  { value: "web", label: "Web" },
  { value: "mobile_cp2", label: "Mobile CP2" },
  { value: "mobile", label: "Mobile" },
  { value: "web_cp3", label: "Web CP3" },
];

const moduleOptions = [
  { value: "all", label: "All Modules" },
  { value: "reporting", label: "Reporting" },
  { value: "notification", label: "Notification" },
  { value: "auth", label: "Authentication" },
];

export function FilterPanel({ onSearch }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterValues>({
    clientId: "",
    repcode: "",
    type: "",
    moduleType: "",
    date: undefined,
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Client ID */}
        <div className="space-y-2">
          <Label htmlFor="clientId" className="text-sm font-medium text-foreground">
            Client ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientId"
            placeholder="Enter Client ID"
            value={filters.clientId}
            onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
            className="h-10"
          />
        </div>

        {/* Repcode */}
        <div className="space-y-2">
          <Label htmlFor="repcode" className="text-sm font-medium text-foreground">
            Repcode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="repcode"
            placeholder="Enter Repcode"
            value={filters.repcode}
            onChange={(e) => setFilters({ ...filters, repcode: e.target.value })}
            className="h-10"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Date <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 justify-start text-left font-normal",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "dd-MM-yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={filters.date}
                onSelect={(date) => setFilters({ ...filters, date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Module Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Module Type</Label>
          <Select
            value={filters.moduleType}
            onValueChange={(value) => setFilters({ ...filters, moduleType: value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {moduleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-start">
        <Button
          onClick={handleSearch}
          className="px-8 h-10 font-medium"
        >
          <Search className="w-4 h-4 mr-2" />
          Show Results
        </Button>
      </div>
    </motion.div>
  );
}
