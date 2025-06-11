import { NextRequest, NextResponse } from "next/server";
import { Report } from "@/db/mongoDB/report-schema";
import dbConnect from "@/db/mongoDB/db-connect";

export async function POST(request: NextRequest) {
  try {
    await dbConnect(); // Ensure the database connection is established

    const body = await request.json();

    // Extract data from the request body
    const {
      incident_type,
      location,
      date,
      time,
      description,
      ppd_notified,
      incident_report_number, // Include this if editing an existing report
    } = body;

    // Validate required fields
    if (!incident_type || !location || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let reportNumber = incident_report_number;
    let reportStage = "unclaimed"; // Default stage for new reports
    let reportOrigin = "user_created"; // Default origin
    let reportInitiatedAt = new Date(`${date}T${time}`); // Combine date and time

    if (reportNumber) {
      // Check if the report already exists
      const existingReport = await Report.findOne({
        incident_report_number: reportNumber,
      });

      if (existingReport) {
        // Retain the existing report stage, origin, and initiated date
        reportStage = existingReport.report_stage;
        reportOrigin = existingReport.report_origin;
        reportInitiatedAt = existingReport.report_initiated_at;
      }
    } else {
      // Generate a unique report number for new reports
      reportNumber = await generateUniqueReportNumber();
    }

    // Create or update the report
    const newReport = await Report.findOneAndUpdate(
      { incident_report_number: reportNumber }, // Match by report number
      {
        incident_report_number: reportNumber,
        report_stage: reportStage, // Retain existing stage if editing
        report_origin: reportOrigin, // Retain existing origin if editing
        report_initiated_at: reportInitiatedAt, // Retain existing date if editing
        incident_type,
        location,
        description,
        ppd_notified: ppd_notified || false,
      },
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("Error creating or updating report:", error);
    return NextResponse.json(
      { error: "Failed to create or update report" },
      { status: 500 }
    );
  }
}

async function generateUniqueReportNumber(): Promise<number> {
  let isUnique = false;
  let reportNumber = Math.floor(1000 + Math.random() * 9000);

  while (!isUnique) {
    try {
      // Try to find a report with this number
      const existingReport = await Report.findOne({
        incident_report_number: reportNumber,
      });

      if (existingReport) {
        console.log(
          `Report number ${reportNumber} already exists, generating a new one.`
        );
        reportNumber = Math.floor(1000 + Math.random() * 9000); // Generate a new random number
      } else {
        // If no report exists, the number is unique
        isUnique = true;
      }
    } catch (error) {
      console.error("Error checking report number uniqueness:", error);
      throw new Error("Failed to generate a unique report number");
    }
  }

  return reportNumber;
}
