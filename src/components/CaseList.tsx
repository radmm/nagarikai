import { CivicReport, IssueCategory, ReportStatus, UrgencyLevel } from "../types";
import { Scales, Users, Flame, CaretRight, ShieldWarning, Drop, Lightning, Eye } from "@phosphor-icons/react";
import { TRANSLATIONS } from "../translations";

interface CaseListProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  language?: "en" | "kn" | "hi";
}

export default function CaseList({ reports, onSelectReport, language = "en" }: CaseListProps) {
  const t = TRANSLATIONS[language];
  const categories = [
    {
      id: IssueCategory.WATER,
      title: language === "kn" ? "ನೀರು ಸರಬರಾಜು ಮತ್ತು ಒಳಚರಂಡಿ" : language === "hi" ? "जलापूर्ति और सीवेज" : "Water Supply & Sewage",
      icon: Drop,
      color: "blue",
      glowColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      description: language === "kn" ? "ಸೋರಿಕೆಗಳು, ಕೊಳವೆ ಒಡೆತ, ಕಲುಷಿತ ನೀರು ಮತ್ತು ಚರಂಡಿ ಸಮಸ್ಯೆಗಳ ನಿರ್ವಹಣೆ" : language === "hi" ? "नालियों, पाइप फटने और जल प्रदूषण" : "Leaks, pipe bursts, contamination and sewage issues"
    },
    {
      id: "Roads & Infrastructure", // Matching key format or value
      title: language === "kn" ? "ರಸ್ತೆಗಳು ಮತ್ತು ಮೂಲಸೌಕರ್ಯ" : language === "hi" ? "सड़कें और बुनियादी ढांचा" : "Roads & Infrastructure",
      categoryEnum: IssueCategory.ROADS,
      icon: Scales,
      color: "yellow",
      glowColor: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
      description: language === "kn" ? "ಗುಂಡಿಗಳು, ಪಾದಚಾರಿ ಮಾರ್ಗಗಳು, ಟ್ರಾಫಿಕ್ ದೀಪಗಳು ಮತ್ತು ಸುರಕ್ಷತೆ ಸಮಸ್ಯೆಗಳು" : language === "hi" ? "सड़कें, फुटपाथ और यातायात व्यवस्था" : "Potholes, sidewalks, traffic lights and structural road issues"
    },
    {
      id: IssueCategory.ELECTRICITY,
      title: language === "kn" ? "ವಿದ್ಯುತ್ ಮತ್ತು ವಿದ್ಯುತ್ ಗ್ರಿಡ್" : language === "hi" ? "बिजली और पावर ग्रिड" : "Electricity & Power Grid",
      icon: Lightning,
      color: "purple",
      glowColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      description: language === "kn" ? "ವಿದ್ಯುತ್ ಕಡಿತ, ಅಧಿಕ ವೋಲ್ಟೇಜ್ ಮತ್ತು ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್ ಘಟಕಗಳ ದೋಷಗಳು" : language === "hi" ? "बिजली कटौ��ी, सॉकेट सरज और ट्रांसफार्मर मुद्दे" : "Outages, surges, transformer faults and lighting"
    },
    {
      id: IssueCategory.SAFETY,
      title: language === "kn" ? "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ ಮತ್ತು ಕಾನೂನು" : language === "hi" ? "सार्वजनिक सुरक्षा और कानून" : "Public Safety & Law",
      icon: ShieldWarning,
      color: "red",
      glowColor: "bg-red-500/10",
      iconColor: "text-red-400",
      description: language === "kn" ? "ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯಕ್ಕೆ ಹಾನಿ, ಕಸ ಸಡಿಲಿಕೆ, ದುರಾಕ್ರಮ ಮತ್ತು ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳು" : language === "hi" ? "सार्वजनिक स्वास्थ्य, कचरा और आपात स्थिति" : "Public health hazards, illegal dumping and emergency incidents"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-headline-lg font-mono text-2xl font-bold text-white tracking-tight leading-none uppercase">
          {t.historyTitle}
        </h2>
        <p className="font-sans text-sm text-gray-400 mt-2">
          {t.historySubtitle}
        </p>
      </div>

