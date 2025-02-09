import type { Request, Response } from "express";

import { Subscriber } from "../models/Subscriber";
import { SubscribeRequest } from "../types/request";

export const getSubscribers: () => void = async () => {
  try {
    const subscribers = await Subscriber.find();
    return subscribers;
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    throw error;
  }
};

export const subscribe: (
  req: Request<{}, {}, SubscribeRequest>,
  res: Response
) => void = async (req: Request<{}, {}, SubscribeRequest>, res: Response) => {
  const { email } = req.body;

  try {
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber)
      return res
        .status(400)
        .json({ success: false, message: "Email is already subscribed" });

    const newSubscriber = new Subscriber({ email });

    await newSubscriber.save();

    res.status(200).json({ success: true, message: "Subscribed successfully" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const unSubscribe: (
  req: Request<{ userId: string }>,
  res: Response
) => void = async (req: Request<{ userId: string }>, res: Response) => {
  const { userId } = req.params;

  try {
    const subscriber = await Subscriber.findByIdAndDelete(userId);

    if (!subscriber) {
      return res
        .status(404)
        .json({ success: false, message: "Subscriber not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Unsubscribed successfully" });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};
