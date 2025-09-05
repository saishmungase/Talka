// This file is for manual testing of an application !

import { Mail } from "../mail/mail.js";
import dotenv from "dotenv";

dotenv.config();

const mail = new Mail({
  transporterOptions: {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  defaultFrom: process.env.EMAIL_USER!,
});


async function runTests() {
  try {
    // 1️⃣ sendBasic
    await mail.sendBasic({
      to: process.env.TEST_RECEIVER!,
      subject: "🔹 Basic Send",
      text: "Hello from sendBasic()!",
    });

    // 2️⃣ sendWithAttachments
    await mail.sendWithAttachments({
      to: process.env.TEST_RECEIVER!,
      subject: "📎 Attachment Test",
      text: "Check the attached file",
      attachments: ["./dist/test/sample.txt"],
    });

    // 3️⃣ sendWithTemplate
    await mail.sendWithTemplate({
      to: process.env.TEST_RECEIVER!,
      subject: "👋 Hello {{name}}",
      template: ("./dist/test/template.html"),
      variables: { name: "Saish", product: "Mail Library" },
    });

    // 4️⃣ Groups
    mail.addGroup("team", [process.env.TEST_RECEIVER!]);
    await mail.sendGroup(["team"], {
      group: "team",
      subject: "👥 Group Test",
      text: "This was sent to group 'team'",
    });

    // 5️⃣ sendScheduled (after 5s)
    await mail.sendScheduled(
      {
        to: process.env.TEST_RECEIVER!,
        subject: "⏰ Scheduled Test",
        text: "This email was sent after 5 seconds",
      },
      5000
    );

    // 6️⃣ sendBulkPersonalized
    await mail.sendBulkPersonalized(
      {
        group: "team",
        subject: "🎯 Personalized Email for {{name}}",
        template: ("./dist/test/template.html"),
      },
      [
        { name: "Kau Di", product: "Beauty", email : "kaveri.gmungase@gmail.com" },
        { name: "Saudi", product: "Software", email : "saishmungase@gmail.com" },
      ]
    );

    // 7️⃣ sendWithRetry
    await mail.sendWithRetry(
      {
        to: process.env.TEST_RECEIVER!,
        subject: "🔄 Retry Test",
        text: "This message will retry if sending fails",
      },
      { retries: 3, delay: 2000 }
    );

    // 8️⃣ sendTest
    await mail.sendTest();

    // 9️⃣ sendScheduledCron (every minute for demo)
    const cronTask = mail.sendScheduledCron("* * * * *", {
      to: process.env.TEST_RECEIVER!,
      subject: "🌀 Cron Test",
      text: "This runs every minute",
    });
    
    // stop after 2 minutes
    setTimeout(() => {
      cronTask.stop();
      console.log("🛑 Cron stopped after 2 minutes");
    }, 2 * 60 * 1000);

  } catch (err) {
    console.error("❌ Error in manual tests:", err);
  }
}

runTests();
