# 🚀 Getting Started with FastForwardIt

Welcome to **FastForwardIt** — a lightweight, flexible mailing utility built on top of **Nodemailer**. Effortlessly send direct, bulk, templated emails, and attachments with a simple, customizable API.

This guide will help you install the package and send your **first email** in just a few minutes.

---

## 📦 Installation

Choose your preferred package manager:

```bash
# npm
npm install fastforwardit

# yarn
yarn add fastforwardit

# pnpm
pnpm add fastforwardit
```

---

## ⚡ Quick Start Example

Send your first email in just a few lines:

```typescript
import { Mail } from "fastforwardit";

async function main() {
  const mailer = new Mail({
    transporterOptions: {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,   // your email
        pass: process.env.EMAIL_PASS,   // your app password
      },
    },
    defaultFrom: process.env.EMAIL_USER, // fallback "from" address
  });

  await mailer.send({
    to: "receiver@example.com",
    subject: "Hello from FastForwardIt 👋",
    text: "This is a test email sent using FastForwardIt library.",
  });

  console.log("✅ Email sent successfully!");
}

main().catch(console.error);
```

---

## 🔑 Prerequisites

- **Node.js** version **16.x** or higher
- Valid email provider credentials (e.g., Gmail, Outlook, custom SMTP)
- For Gmail: [Generate an App Password](https://support.google.com/accounts/answer/185833) if 2FA is enabled

---

## 🎯 Next Steps
- 📚 **Reference:** [Explore all available methods and API details](./reference.md)

---

🔥 That’s it! You’ve just sent your first email with **FastForwardIt**.

Happy mailing!