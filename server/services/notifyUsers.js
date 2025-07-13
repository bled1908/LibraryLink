import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const notifyUsers = () => {
    cron.schedule("*/5 * * * * *", async () => {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                dueDate: {
                    $lt: oneDayAgo,
                },
                returnDate: null,
                notified: false,
            });

            for (const element of borrowers) {
                if(element.user && element.user.email) {
                    sendEmail({
                        email: element.user.email,
                        subject: "Book Return Reminder",
                        message: `<p>Dear ${element.user.name},</p>

<p>
  We noticed that one of your borrowed books is <strong>overdue</strong>.
  Kindly return it at your earliest convenience to avoid any late fees or restrictions on future borrowing.
</p>

<p>
  If you have already returned it, please disregard this message.
</p>

<p>Best regards,<br />
<strong>Library Management</strong></p>
`,
                    });
                    element.notified = true;
                    await element.save();
                    console.log(`Notification sent to ${element.user.email} for overdue book.`);
                }
            }
        } catch (error) {
            console.error("Some error occurred while notifying users:", error);
        }
    });
};