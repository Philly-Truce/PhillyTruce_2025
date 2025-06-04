import ReportList from "@/components/reports/ReportList";
import SearchBar from "@/components/search-bar";
import { Report } from "@/db/mongoDB/report-schema";
import dbConnect from "@/db/mongoDB/db-connect";

export type ReportSummaryType = {
  id: string;
  report_stage: string;
  report_initiated_at: Date;
  incident_report_number: number;
};

const fetchAllReports = async () => {
  await dbConnect();

  const reports = await Report.find({}).select(
    "report_stage incident_report_number id report_initiated_at"
  );

  const sanitizedReports = reports.map((report) => ({
    id: report._id.toString(), // Convert ObjectId to string
    report_stage: report.report_stage,
    report_initiated_at: report.report_initiated_at.toISOString(), // Convert Date to ISO string
    incident_report_number: report.incident_report_number,
  }));

  console.log("Sanitized reports:", sanitizedReports);
  return sanitizedReports;
};

export default async function Main() {
  const reports = await fetchAllReports();

  return (
    <div
      id="reports-page-container"
      className="overflow-y-scroll flex flex-col gap-4 pt-20 pb-20 px-4"
    >
      <SearchBar page="reports" />
      <ReportList reports={reports} />
    </div>
  );
}
