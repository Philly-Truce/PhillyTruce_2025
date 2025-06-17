//import ListItems from "../../data/list-items.json";
import Image from "next/image";
import Thumbnail from "./list-thumbnail.png";
import ClockIn from "./clock-in";
import { useEffect, useState } from "react";
import dbConnect from "../../db/mongoDB/db-connect";
import AnnouncementsModel from "../../db/mongoDB/Annoncements";

export default async function Home() {
  const announcements = await fetchAnnouncementsFromDatabase();

  //const session = await SessionControl();
  const date = new Date();
  const day = date.getDate();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const currentDate = month + " " + day + ", " + year;

  return (
    <div className="w-full px-4">
      <header className="space-y-1 mt-20 mb-4">
        <p className="text-xs text-center">
          We appreciate everything you do to keep our community safe.
        </p>
        <p className="text-[10px] text-center">{currentDate}</p>
      </header>

      <ClockIn />

      <section>
        <div className="flex text-sm my-3">
          <h1 className="font-bold">Pinned Announcements</h1>
          <a href="#" className="underline text-link ml-auto">
            See all
          </a>
        </div>
        {announcements.map((announcements, index) => (
          <div key={index} className="mb-2 py-2 px-4 bg-homelistbg flex">
            <Image
              src={Thumbnail}
              width={56}
              height={56}
              alt="List item thumbnail"
              className="self-center"
            />
            <div className="pl-4 self-center flex-1">
              <h6 className="text-sm">{announcements.title}</h6>
              <p className="text-xs">{announcements.detail}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

async function fetchAnnouncementsFromDatabase() {
  try {
    await dbConnect();
    console.log("Database connected successfully.");

    const announcements = await AnnouncementsModel.find({});
    console.log("Announcements fetched:", announcements);

    return announcements.map((item) => ({
      title: item.title,
      detail: item.detail,
    }));
  } catch (error) {
    console.error("Error fetching list items:", error);
    return [];
  }
}