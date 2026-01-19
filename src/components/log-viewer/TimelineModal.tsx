import { X, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  id: string;
  timestamp: string;
  apiEndpoint: string;
  requestData: object;
  responseData: object;
}

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  logId: string;
  entries: TimelineEntry[];
}

function JsonBlock({ data, label }: { data: object; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = (obj: object): string => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-sm font-medium",
          label === "Request Data" ? "text-primary" : "text-success"
        )}>
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-3 h-3 text-success" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <div className={cn(
        "rounded-lg p-3 font-mono text-xs overflow-x-auto scrollbar-thin",
        "border max-h-40",
        label === "Request Data" 
          ? "bg-primary/5 border-primary/20" 
          : "bg-success/5 border-success/20"
      )}>
        <pre className="whitespace-pre-wrap break-all text-foreground/80">
          {formatJson(data)}
        </pre>
      </div>
    </div>
  );
}

export function TimelineModal({ isOpen, onClose, logId, entries }: TimelineModalProps) {
  const handleDownload = () => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timeline-${logId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-card rounded-2xl shadow-xl border border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Request Timeline</h2>
                <Badge variant="secondary" className="font-mono text-xs">
                  {entries.length} logs
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline line */}
                    {index < entries.length - 1 && (
                      <div className="absolute left-[7px] top-8 bottom-0 w-0.5 bg-border -mb-6" />
                    )}

                    {/* Entry */}
                    <div className="flex gap-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary mt-1.5 ring-4 ring-background" />

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-medium text-foreground">
                            {entry.timestamp}
                          </span>
                          <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                            Api
                          </Badge>
                          <span className="text-sm text-muted-foreground font-mono truncate">
                            {entry.apiEndpoint}
                          </span>
                        </div>

                        {/* Request & Response */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <JsonBlock data={entry.requestData} label="Request Data" />
                          <JsonBlock data={entry.responseData} label="Response" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
