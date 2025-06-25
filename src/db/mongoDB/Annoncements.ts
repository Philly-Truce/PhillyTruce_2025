import mongoose, { Schema, model, Document } from "mongoose";

interface IAnnouncement extends Document {
  title: string;
  detail: string;
}

const AnnouncementsSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  detail: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.models.Announcements ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementsSchema, "Announcements");