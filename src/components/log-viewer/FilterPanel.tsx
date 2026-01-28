import { useState, useEffect, useCallback } from "react";
import { Search, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, subDays } from "date-fns";
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
import { supabase } from "@/integrations/supabase/client";

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

export function FilterPanel({ onSearch }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterValues>({
    clientId: "",
    repcode: "",
    type: "",
    moduleType: "",
    date: new Date(),
  });
  const [moduleOptions, setModuleOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);

  // Fetch modules when client ID changes (with debounce)
  useEffect(() => {
    const fetchModules = async () => {
      if (!filters.clientId.trim()) {
        setModuleOptions([]);
        setFilters(prev => ({ ...prev, moduleType: "" }));
        return;
      }

      setIsLoadingModules(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-modules', {
          body: { client_id: filters.clientId },
        });

        if (error) {
          console.error('Error fetching modules:', error);
          setModuleOptions([]);
          return;
        }

        if (data.status === "0" && Array.isArray(data.modules)) {
          const options = data.modules.map((modulePath: string) => {
            // Extract the last part of the module path
            const parts = modulePath.split("/");
            const lastPart = parts[parts.length - 1];
            return {
              value: modulePath,
              label: lastPart,
            };
          });
          setModuleOptions(options);
        } else {
          setModuleOptions([]);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        setModuleOptions([]);
      } finally {
        setIsLoadingModules(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchModules, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.clientId]);

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Client ID */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="clientId" className="text-xs sm:text-sm font-medium text-foreground">
            Client ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientId"
            placeholder="Enter Client ID"
            value={filters.clientId}
            onChange={(e) => setFilters({ ...filters, clientId: e.target.value.toUpperCase() })}
            className="h-9 sm:h-10 text-sm uppercase"
          />
        </div>

        {/* Repcode */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="repcode" className="text-xs sm:text-sm font-medium text-foreground">
            Repcode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="repcode"
            placeholder="Enter Repcode"
            value={filters.repcode}
            onChange={(e) => setFilters({ ...filters, repcode: e.target.value })}
            className="h-9 sm:h-10 text-sm"
          />
        </div>

        {/* Type */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-foreground">
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger className="h-9 sm:h-10 text-sm">
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
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-foreground">
            Date <span className="text-destructive">*</span> <span className="text-muted-foreground text-xs">(← →)</span>
          </Label>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => filters.date && setFilters({ ...filters, date: subDays(filters.date, 1) })}
              className="h-9 sm:h-10 w-9 sm:w-10 flex-shrink-0"
              title="Previous day (Left arrow)"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 h-9 sm:h-10 justify-start text-left font-normal text-sm",
                    !filters.date && "text-muted-foreground"
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" && filters.date) {
                      e.preventDefault();
                      setFilters({ ...filters, date: subDays(filters.date, 1) });
                    } else if (e.key === "ArrowRight" && filters.date) {
                      e.preventDefault();
                      setFilters({ ...filters, date: addDays(filters.date, 1) });
                    }
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {filters.date ? format(filters.date, "dd-MM-yyyy") : "Select date"}
                  </span>
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => filters.date && setFilters({ ...filters, date: addDays(filters.date, 1) })}
              className="h-9 sm:h-10 w-9 sm:w-10 flex-shrink-0"
              title="Next day (Right arrow)"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Module Type */}
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-foreground">Module Type</Label>
          <Select
            value={filters.moduleType}
            onValueChange={(value) => setFilters({ ...filters, moduleType: value })}
            disabled={isLoadingModules || moduleOptions.length === 0}
          >
            <SelectTrigger className="h-9 sm:h-10 text-sm">
              {isLoadingModules ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder={filters.clientId ? "Select module" : "Enter Client ID first"} />
              )}
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
      <div className="mt-4 sm:mt-6 flex justify-start">
        <Button
          onClick={handleSearch}
          className="w-full sm:w-auto px-6 sm:px-8 h-9 sm:h-10 font-medium text-sm"
        >
          <Search className="w-4 h-4 mr-2" />
          Show Results
        </Button>
      </div>
    </motion.div>
  );
}
