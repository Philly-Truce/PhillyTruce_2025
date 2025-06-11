import React from "react";
import ReportView from "@/components/report-view";
import { Report } from "../../../db/mongoDB/report-schema";
import dbConnect from "../../../db/mongoDB/db-connect";

/**
 * Fetches a report by incident report number
 * @param incidentReportNumber the report number.
 * @returns report details in JS object format
 */
export const fetchReportByReportNumber = async (
  incidentReportNumber: string
) => {
  console.log("getting report #" + incidentReportNumber);
  console.log(typeof incidentReportNumber);
  
  try {
    console.log("Connecting to DB...");
    await dbConnect();
    console.log("DB Connected!");

    const parsedNumber = Number.parseInt(incidentReportNumber);

    const report = await Report.findOne({ incident_report_number: parsedNumber });
    if (!report) {
      throw new Error("Report not found");
    }
    return report;
  } catch (error) {
    throw new Error("Error fetching report");
  }
};

/**
 * @param params - get url params in order to fetch data on server-side
 * @returns Report view
 */
export default async function ReportsViewPage({
  params,
}: {
  params: { incident_report_number: string };
}) {
  // Fetch the report data
  const fetchedReport = await fetchReportByReportNumber(params.incident_report_number).catch(() => null);

  if (!fetchedReport) {
    return <div>Report Not Found</div>;
  }

  return (
    <div id="reports-view-page" className="pt-[88px] px-4 w-full h-full">
      <ReportView initialReport={fetchedReport} />
    </div>
  );
}
