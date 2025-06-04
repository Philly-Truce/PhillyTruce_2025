import { NextRequest, NextResponse } from "next/server";
import { Report } from "@/db/mongoDB/report-schema";
import { ReportSummaryType } from "@/app/reports/page";
import dbConnect from "@/db/mongoDB/db-connect";

export async function GET(request: NextRequest) {
  await dbConnect();

  const reports = await Report.find({}).select(
    "report_stage incident_report_number id report_initiated_at"
  );

  const unclaimed = reports.filter(
    (report: ReportSummaryType) => report.report_stage === "unclaimed"
  );
  const claimed = reports.filter(
    (report: ReportSummaryType) => report.report_stage === "claimed"
  );
  const closed = reports.filter(
    (report: ReportSummaryType) =>
      report.report_stage === "closed" || report.report_stage === "archived"
  );

  const lists = {
    unclaimed: unclaimed ?? [],
    claimed: claimed ?? [],
    closed: closed ?? [],
  };

  return NextResponse.json(lists, {
    status: 200,
  });
}
