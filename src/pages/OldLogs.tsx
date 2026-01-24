import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";

const clients = [
  { id: "danone", name: "DANONE" },
  { id: "hul", name: "HUL" },
  { id: "hulcp3", name: "HULCP3" },
  { id: "sun", name: "SUN PHARMA" },
  { id: "glenmark", name: "GLENMARK" },
  { id: "usv", name: "USV" },
  { id: "sunem2", name: "SUN EMERGING" },
  { id: "cipla", name: "CIPLA" },
  { id: "cadila", name: "CADILA" },
  { id: "apl", name: "AUROBINDO" },
  { id: "drl", name: "DR. REDDY" },
  { id: "alcp2", name: "ALEMBIC" },
  { id: "jbcpl", name: "JBCPL" },
  { id: "chc", name: "SUN CHC" },
  { id: "gmem", name: "GLEM" },
  { id: "biotics", name: "BIOTICS" },
  { id: "inzpera", name: "INZPERA HEALTH" },
  { id: "ajanta", name: "AJANTA PHARMA" },
  { id: "pghl", name: "PNG" },
  { id: "arcp2", name: "ARISTO PHARMA" },
  { id: "aurogen", name: "AURO INDONESIA" },
  { id: "metr", name: "METROPOLIS" },
  { id: "sdpl", name: "SOFTDEAL PRIVATE" },
  { id: "cipi", name: "CIPLA INTERNATIONAL" },
  { id: "bayer", name: "BAYER" },
  { id: "higen", name: "HIGEN" },
  { id: "thyrocare", name: "THYROCARE" },
  { id: "cadvet", name: "VETNOVA" },
  { id: "mega", name: "MEGACARE" },
  { id: "sunem1", name: "SUNRD" },
  { id: "sunem3", name: "SUN RUSSIA OTC" },
  { id: "cpc", name: "CPC DIAGNOSTIC" },
  { id: "enbcl", name: "EMERCHEMIE" },
  { id: "zintl", name: "ZINTL" },
  { id: "zydi", name: "ZYDUS" },
  { id: "vapt", name: "VAPT" },
  { id: "hem", name: "HEMAS" },
  { id: "eisai", name: "EISAI" },
  { id: "cp3dev", name: "CP3DEV" },
];

const environments = [
  { id: "pre", name: "PRE ENV" },
  { id: "local5", name: "LOCAL 5.0" },
  { id: "storage", name: "STORAGE GP / QC ENV" },
];

interface QuickAction {
  label: string;
  variant: "primary" | "secondary";
}

const OldLogs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [customClientId, setCustomClientId] = useState<string>("");
  const [isCustomClientMode, setIsCustomClientMode] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [repCode, setRepCode] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [environment, setEnvironment] = useState<string>("pre");

  const liveActions: QuickAction[] = [
    { label: "IOS CP3 LOGS", variant: "primary" },
    { label: "IOS CP2 LOGS", variant: "primary" },
    { label: "ANDROID CP2 LOGS", variant: "primary" },
    { label: "API LOGS", variant: "primary" },
    { label: "ALL LIVE LOGS", variant: "primary" },
    { label: "UPW LOGS", variant: "primary" },
    { label: "SUBMITDATA OBJECT", variant: "primary" },
    { label: "IMPORTANT LINKS", variant: "primary" },
    { label: "Custom Client ID", variant: "secondary" },
  ];

  const localActions: QuickAction[] = [
    { label: "IOS CP3 LOCAL LOGS", variant: "primary" },
    { label: "IOS LOCAL LOGS", variant: "primary" },
    { label: "ANDROID LOCAL LOGS", variant: "primary" },
    { label: "API LOGS LOCAL", variant: "primary" },
    { label: "UPW LOCAL", variant: "primary" },
    { label: "IMPORTANT LINKS", variant: "primary" },
    { label: "Custom Client ID", variant: "primary" },
  ];

  const quickActions = isLive ? liveActions : localActions;

  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));

  const handlePrevClient = () => {
    const currentIndex = clients.findIndex(c => c.id === clientId);
    if (currentIndex > 0) {
      setClientId(clients[currentIndex - 1].id);
    } else if (currentIndex === -1 && clients.length > 0) {
      setClientId(clients[clients.length - 1].id);
    } else {
      setClientId(clients[clients.length - 1].id);
    }
  };

  const handleNextClient = () => {
    const currentIndex = clients.findIndex(c => c.id === clientId);
    if (currentIndex < clients.length - 1) {
      setClientId(clients[currentIndex + 1].id);
    } else {
      setClientId(clients[0].id);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "Custom Client ID") {
      setIsCustomClientMode(!isCustomClientMode);
      return;
    }
    console.log(`Action clicked: ${action}`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Old Logs" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 flex flex-col items-center px-4 py-8 md:px-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-wide mb-8">
            USER LOGS
          </h1>

          {/* Main Card */}
          <div className="w-full max-w-4xl bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
            {/* Row 1: Client ID + Sort Buttons + Date + Date Nav */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
              {/* Client ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Client ID {isCustomClientMode && "(Custom)"}
                </label>
                {isCustomClientMode ? (
                  <Input
                    value={customClientId}
                    onChange={(e) => setCustomClientId(e.target.value)}
                    placeholder="Enter Custom Client ID"
                    className="h-11 bg-card border-primary/30 focus:border-primary placeholder:text-primary/50"
                  />
                ) : (
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger className="w-full h-11 bg-card border-primary/30 focus:border-primary">
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 bg-popover border-border">
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} ({client.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Sort Buttons */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevClient}
                  className="h-11 w-11 border-primary/30"
                  title="Previous Client"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextClient}
                  className="h-11 w-11 border-primary/30"
                  title="Next Client"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 justify-start text-left font-normal border-primary/30 bg-card"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, "dd/MM/yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date Navigation */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevDay}
                  className="h-11 w-11 border-primary/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextDay}
                  className="h-11 w-11 border-primary/30"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Row 2: Rep Code + Live Toggle + Environment */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-end">
              {/* Rep Code / File Path */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Rep Code / File Path
                </label>
                <Input
                  value={repCode}
                  onChange={(e) => setRepCode(e.target.value)}
                  placeholder="Enter Rep Code / File Path"
                  className="h-11 bg-card border-primary/30 focus:border-primary placeholder:text-primary/50"
                />
              </div>

              {/* Live Toggle */}
              <div className="flex items-center gap-2 h-11">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  LIVE
                </label>
                <Checkbox
                  checked={isLive}
                  onCheckedChange={(checked) => setIsLive(checked as boolean)}
                  className="h-5 w-5 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </div>

              {/* Environment Dropdown - Only visible when not Live */}
              {!isLive && (
                <div className="w-48">
                  <Select value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger className="w-full h-11 bg-card border-primary/30 focus:border-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {environments.map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => handleActionClick(action.label)}
                    className={cn(
                      "h-12 font-medium text-sm transition-all duration-200",
                      action.variant === "primary"
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40"
                    )}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="bg-primary/20 text-primary text-sm font-medium px-4 py-2 rounded-lg border border-primary/30">
            Version 3.0
          </div>
          <div className="bg-primary/20 text-primary text-sm font-medium px-4 py-2 rounded-lg border border-primary/30">
            Made by Naeem
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldLogs;
