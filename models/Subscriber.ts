import mongoose from "mongoose";

interface ISubscriber extends Document {
  email: string;
}

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Subscriber = mongoose.model<ISubscriber>(
  "subscribers",
  subscriberSchema
);
