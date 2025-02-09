import cron from "node-cron";

import { sendDailyEmail } from "../emails/sendDailyEmail";

import { getSubscribers } from "../controllers/subscribers";

cron.schedule(
  "0 8 * * *",
  async () => {
    try {
      // Fetch all subscribers from the database
      const subscribers: any = await getSubscribers();

      // Send email to each subscriber
      for (const subscriber of subscribers) {
        await sendDailyEmail(subscriber.email);
      }

      console.log("Daily email sent successfully to all subscribers.");
    } catch (error) {
      console.error("Error sending daily email:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/New_York", // Adjust to your timezone
  }
);
