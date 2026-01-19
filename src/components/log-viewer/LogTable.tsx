import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LogEntry {
  id: string;
  date: string;
  clientId: string;
  repcode: string;
  type: string;
  messageType: "INFO" | "ERROR" | "WARNING" | "DEBUG";
  insertTimestamp: string;
}

interface LogTableProps {
  logs: LogEntry[];
  onViewTimeline: (log: LogEntry) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const messageTypeStyles = {
  INFO: "bg-info/10 text-info border-info/20",
  ERROR: "bg-destructive/10 text-destructive border-destructive/20",
  WARNING: "bg-warning/10 text-warning border-warning/20",
  DEBUG: "bg-muted text-muted-foreground border-muted",
};

export function LogTable({
  logs,
  onViewTimeline,
  currentPage,
  totalPages,
  onPageChange,
}: LogTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">Date</TableHead>
              <TableHead className="font-semibold text-foreground">Client ID</TableHead>
              <TableHead className="font-semibold text-foreground">Repcode</TableHead>
              <TableHead className="font-semibold text-foreground">Type</TableHead>
              <TableHead className="font-semibold text-foreground">Message Type</TableHead>
              <TableHead className="font-semibold text-foreground">Insert Timestamp</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Eye className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No logs found. Adjust your filters and try again.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">{log.date}</TableCell>
                  <TableCell className="font-mono text-sm">{log.clientId}</TableCell>
                  <TableCell className="font-mono text-sm">{log.repcode}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-medium border",
                        messageTypeStyles[log.messageType]
                      )}
                    >
                      {log.messageType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {log.insertTimestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTimeline(log)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Timeline
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
