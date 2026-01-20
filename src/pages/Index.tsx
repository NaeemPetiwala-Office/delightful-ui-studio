import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { FilterPanel, FilterValues } from "@/components/log-viewer/FilterPanel";
import { LogTable, LogEntry } from "@/components/log-viewer/LogTable";
import { TimelineModal } from "@/components/log-viewer/TimelineModal";

// Sample data for demonstration
const sampleLogs: LogEntry[] = [
  {
    id: "1",
    date: "2026-01-19",
    clientId: "SUNEM2",
    repcode: "N0144",
    type: "web",
    messageType: "INFO",
    insertTimestamp: "19 Jan 2026, 05:45:22 am",
  },
  {
    id: "2",
    date: "2026-01-19",
    clientId: "SUNEM2",
    repcode: "N0144",
    type: "mobile",
    messageType: "ERROR",
    insertTimestamp: "19 Jan 2026, 05:42:18 am",
  },
  {
    id: "3",
    date: "2026-01-19",
    clientId: "SUNEM2",
    repcode: "N0145",
    type: "web",
    messageType: "WARNING",
    insertTimestamp: "19 Jan 2026, 05:40:55 am",
  },
  {
    id: "4",
    date: "2026-01-18",
    clientId: "CLNT01",
    repcode: "N0200",
    type: "mobile_cp2",
    messageType: "DEBUG",
    insertTimestamp: "18 Jan 2026, 11:30:00 pm",
  },
];

const sampleTimelineEntries = [
  {
    id: "t1",
    timestamp: "19 Jan 2026, 05:45:17:60 am",
    apiEndpoint: "Reporting/CirriusReportingApi4.1/AckProcessData",
    requestData: {
      CLIENTID: "SUNEM2",
      REPCODE: "N0144",
      BATCHNO: "20260118176874803797967",
      dataObj: null,
      Key: null,
    },
    responseData: {
      CLIENTID: "SUNEM2",
      REPCODE: "N0144",
      BATCHNO: "20260118176874803797967",
      OUT: "0",
      dataObj: null,
      Key: null,
    },
  },
  {
    id: "t2",
    timestamp: "19 Jan 2026, 05:45:17:47 am",
    apiEndpoint: "Notification/CirriusCommonApi4.1/api/broadcast/GetReferencedData",
    requestData: {
      ClientID: "SUNEM2",
      Repcode: "N0144",
      EntryNo: "4667008",
      Notif_EntryNo: "4666807,4666909,4667008",
      FromUser: null,
    },
    responseData: {
      StatusCode: 1,
      StatusDescription: "Success",
      ResultSet: {
        Input: "processed",
      },
    },
  },
];

const Index = () => {
  const [logs, setLogs] = useState<LogEntry[]>(sampleLogs);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSearch = (filters: FilterValues) => {
    console.log("Searching with filters:", filters);
    // In a real app, you would fetch data based on filters
    setLogs(sampleLogs);
  };

  const handleViewTimeline = (log: LogEntry) => {
    setSelectedLog(log);
    setIsTimelineOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title="Native Log" 
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-auto scrollbar-thin">
          {/* Filter Panel */}
          <FilterPanel onSearch={handleSearch} />

          {/* Log Table */}
          <LogTable
            logs={logs}
            onViewTimeline={handleViewTimeline}
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      {/* Timeline Modal */}
      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        logId={selectedLog?.id || ""}
        entries={sampleTimelineEntries}
      />
    </div>
  );
};

export default Index;
