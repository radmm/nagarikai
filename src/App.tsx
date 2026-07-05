import { useState, useEffect } from "react";
import { CivicReport, Coordinates, NotificationAlert, ReportStatus, IssueCategory, UrgencyLevel } from "./types";
import { INITIAL_REPORTS, INITIAL_NOTIFICATIONS, GOVERN_DEPARTMENTS } from "./data";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import NewReport from "./components/NewReport";
import CaseDetails from "./components/CaseDetails";
import CaseList from "./components/CaseList";
import Authorities from "./components/Authorities";
import Heatmap from "./components/Heatmap";
import NotificationsScreen from "./components/NotificationsScreen";
import { Radio } from "@phosphor-icons/react";
import { TRANSLATIONS } from "./translations";

export default function App() {
  // Persistence state
  const [reports, setReports] = useState<CivicReport[]>(() => {
    const saved = localStorage.getItem("nagarikai_reports");
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [alerts, setAlerts] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem("nagarikai_alerts");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [tab, setTab] = useState<string>("dashboard");
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [language, setLanguage] = useState<"en" | "kn" | "hi">("en");

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("nagarikai_reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("nagarikai_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const handleSelectReport = (report: CivicReport) => {
    setSelectedReport(report);
    setTab("case-detail");
  };

  const handleUpdateReport = (updated: CivicReport) => {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (selectedReport?.id === updated.id) {
      setSelectedReport(updated);
    }
  };

  // Submit and call our backend Express/Gemini API
  const handleNewReportSubmit = async (data: {
    description: string;
    location: Coordinates;
    mediaUrl?: string;
  }): Promise<CivicReport | null> => {
    try {
      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: data.description,
          userLocation: data.location
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process complaint with backend.");
      }

      const analyzed = await response.json();

      const newId = `rep-00${reports.length + 1}`;
      const referenceId = `Ref: #${Math.floor(1000 + Math.random() * 9000)}`;

      const newReport: CivicReport = {
        id: newId,
        referenceId,
        title: analyzed.title || "Reported Civic Hazard",
        description: data.description,
        category: analyzed.category as IssueCategory,
        urgency: analyzed.urgency as UrgencyLevel,
        status: ReportStatus.SUBMITTED,
        location: {
          latitude: analyzed.latitude,
          longitude: analyzed.longitude,
          display_name: analyzed.display_name,
          zone: analyzed.zone
        },
        department: analyzed.departmentId || "bbmp",
        formalLetter: analyzed.formalLetter,
        createdAt: new Date().toISOString(),
        daysActive: 1,
        communityScore: Math.floor(100 + Math.random() * 200), // initial signatures
        needsHumanReview: analyzed.needsHumanReview || false,
        reporterName: "Marcus Chen",
        reporterId: "8824-X",
        mediaUrl: data.mediaUrl,
        isFollowUpDrafted: false
      };

      // Add report
      setReports((prev) => [...prev, newReport]);

      // Add critical alert notification
      const newAlert: NotificationAlert = {
        id: `notif-00${alerts.length + 1}`,
        title: newReport.needsHumanReview ? "Awaiting Manual Review" : "Formal Legal Draft Created",
        message: newReport.needsHumanReview
          ? `Your issue '${newReport.title}' requires manual human parsing due to text ambiguity. Set aside for review.`
          : `CivicAI parsed your report on '${newReport.title}' and drafted a legal letter for ${newReport.category}. Check details!`,
        time: "Just now",
        type: newReport.needsHumanReview ? "warning" : "success",
        glowColor: newReport.needsHumanReview ? "yellow" : "purple",
        read: false
      };

      setAlerts((prev) => [newAlert, ...prev]);

      // Open detail view for this newly compiled case immediately so user can see their letter!
      setSelectedReport(newReport);
      setTab("case-detail");

      return newReport;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleMarkAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const t = TRANSLATIONS[language];

  // Render proper sub-screen view
  const renderTabContent = () => {
    switch (tab) {
      case "dashboard":
        return (
          <Dashboard
            reports={reports}
            onReportIssue={() => setTab("new-report")}
            onSelectReport={handleSelectReport}
            language={language}
          />
        );
      case "new-report":
        return <NewReport onSubmitReport={handleNewReportSubmit} language={language} />;
      case "case-detail":
        return selectedReport ? (
          <CaseDetails
            report={selectedReport}
            onBack={() => setTab("dashboard")}
            onUpdateReport={handleUpdateReport}
            language={language}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">Select a case to inspect details.</div>
        );
      case "cases":
        return <CaseList reports={reports} onSelectReport={handleSelectReport} language={language} />;
      case "authorities":
        return <Authorities language={language} />;
      case "map":
        return <Heatmap reports={reports} onSelectReport={handleSelectReport} language={language} />;
      case "notifications":
        return (
          <NotificationsScreen
            alerts={alerts}
            onMarkRead={handleMarkAlertRead}
            onMarkAllRead={handleMarkAllAlertsRead}
            language={language}
          />
        );
      default:
        return (
          <Dashboard
            reports={reports}
            onReportIssue={() => setTab("new-report")}
            onSelectReport={handleSelectReport}
            language={language}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col relative overflow-x-hidden select-none">
      {/* Soft background ambient gradient glows (cross-fading smoothly) */}
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] pointer-events-none -z-10">
        {/* Purple glow: Home / Overview (dashboard) */}
        <div className={`absolute inset-0 bg-gradient-to-b from-purple-600/15 to-transparent rounded-full blur-[160px] transition-opacity duration-1000 ease-in-out ${tab === "dashboard" ? "opacit...