# 📧 FastForwardIt

<div align="center">

[![npm version](https://img.shields.io/npm/v/fastforwardit.svg?style=flat-square&color=007acc&logo=npm)](https://www.npmjs.com/package/fastforwardit)
[![npm downloads](https://img.shields.io/npm/dt/fastforwardit.svg?style=flat-square&color=green&logo=npm)](https://www.npmjs.com/package/fastforwardit)
[![weekly downloads](https://img.shields.io/npm/dw/fastforwardit.svg?style=flat-square&color=brightgreen&logo=npm)](https://www.npmjs.com/package/fastforwardit)
[![license](https://img.shields.io/npm/l/fastforwardit.svg?style=flat-square&color=blue)](https://github.com/yourusername/fastforwardit/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fastforwardit?style=flat-square&color=orange&logo=webpack)](https://bundlephobia.com/package/fastforwardit)
[![typescript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.npmjs.com/package/fastforwardit)

**A lightweight, flexible mailing utility built on top of Nodemailer**

*Send direct, bulk, templated emails, manage groups, schedule delivery, and handle attachments — all with a simple, customizable API.*

[📚 Documentation](docs/reference.md) • [🚀 Quick Start](docs/getting-started.md) • [💡 Installation](docs/installation.md) • 🤝 Open For Contribution
</div>

## 📊 Package Stats & Trends

<p align="center">
  <strong>📈 Real-time NPM Statistics</strong><br/><br/>
  🔗 <a href="https://npm-stat.com/charts.html?package=fastforwardit">NPM Package Stats (npm-stat.com)</a><br/>
  🔗 <a href="https://npmtrends.com/fastforwardit">Download Trends (npmtrends.com)</a><br/>
</p>

<br/>

<p align="center">
<table>
  <thead>
    <tr>
      <th>📌 Metric</th>
      <th>🔢 Current Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>📦 Current Version</strong></td>
      <td>
        <a href="https://www.npmjs.com/package/fastforwardit">
          <img src="https://img.shields.io/npm/v/fastforwardit?color=green&logo=npm" alt="npm version"/>
        </a>
      </td>
    </tr>
    <tr>
      <td><strong>📥 Total Downloads</strong></td>
      <td>
        <a href="https://www.npmjs.com/package/fastforwardit">
          <img src="https://img.shields.io/npm/dt/fastforwardit?color=blue&logo=npm" alt="total downloads"/>
        </a>
      </td>
    </tr>
    <tr>
      <td><strong>📅 Weekly Downloads</strong></td>
      <td>
        <a href="https://www.npmjs.com/package/fastforwardit">
          <img src="https://img.shields.io/npm/dw/fastforwardit?color=brightgreen&logo=npm" alt="weekly downloads"/>
        </a>
      </td>
    </tr>
    <tr>
      <td><strong>📦 Bundle Size</strong></td>
      <td>
        <a href="https://bundlephobia.com/package/fastforwardit">
          <img src="https://img.shields.io/bundlephobia/minzip/fastforwardit?color=orange&logo=webpack" alt="bundle size"/>
        </a>
      </td>
    </tr>
    <tr>
      <td><strong>📄 License</strong></td>
      <td>
        <a href="https://github.com/yourusername/fastforwardit/blob/main/LICENSE">
          <img src="https://img.shields.io/npm/l/fastforwardit?color=blue" alt="license"/>
        </a>
      </td>
    </tr>
  </tbody>
</table>

<br/>

</p>

<p align="center">
  <strong>📊 View detailed analytics:</strong><br/>
  <a href="https://npm-stat.com/charts.html?package=fastforwardit">npm-stat</a> • 
  <a href="https://npmtrends.com/fastforwardit">npmtrends</a> • 
  <a href="https://bundlephobia.com/package/fastforwardit">bundlephobia</a>
</p>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📮 **Email Types**
- ✉️ **Direct emails** (text & HTML)
- 📝 **Template-based emails** with variables  
- 📢 **Bulk personalized emails**
- 📎 **Attachment support** (files, images, PDFs)

</td>
<td width="50%">

### ⚙️ **Advanced Features**
- 👥 **Group management** for teams & bulk sends
- ⏰ **Scheduled & recurring emails**
- 🔄 **Retry mechanism** with exponential backoff
- 🧪 **Built-in test method** for quick verification

</td>
</tr>
</table>

---

## 📦 Installation

Choose your preferred package manager:

```bash
# Using npm
npm install fastforwardit

# Using yarn
yarn add fastforwardit

# Using pnpm
pnpm add fastforwardit
```

---

## ⚡ Quick Start

Send your first email in just a few lines:

```javascript
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
    defaultFrom: process.env.EMAIL_USER,
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

> **💡 Tip:** For more advanced examples, check out our [Getting Started Guide](docs/getting-started.md)

---

## 🔧 Key Use Cases

<details>
<summary><strong>📝 Template-based Emails</strong></summary>

```javascript
await mailer.sendTemplate({
  to: "user@example.com",
  template: "welcome",
  variables: { 
    name: "John Doe", 
    company: "Acme Corp" 
  }
});
```

</details>

<details>
<summary><strong>👥 Group Management</strong></summary>

```javascript
// Create groups and send bulk emails
await mailer.createGroup("team", ["john@company.com", "jane@company.com"]);
await mailer.sendToGroup("team", {
  subject: "Weekly Update",
  html: "<h1>Hello Team!</h1>"
});
```

</details>

<details>
<summary><strong>⏰ Scheduled Emails</strong></summary>

```javascript
// Schedule email for later
await mailer.schedule({
  to: "client@example.com",
  subject: "Scheduled Reminder",
  text: "This is your scheduled reminder!",
  sendAt: new Date("2024-12-25T10:00:00Z")
});
```

</details>

---

## 🔑 Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | ≥ 16.x | LTS recommended |
| **Email Provider** | Any SMTP | Gmail, Outlook, custom SMTP |
| **Gmail Users** | App Password | Required if 2FA is enabled |

---

## 📚 Documentation

<div align="center">

| 📖 Guide | 📄 Description |
|----------|----------------|
| [**Getting Started**](docs/getting-started.md) | Complete setup and basic usage |
| [**Installation Guide**](docs/installation.md) | Detailed installation instructions |
| [**Documentation**](docs/reference.md) | Full method documentation |

</div>

---

## 🌟 Why FastForwardIt?

<table>
<tr>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/Simple-API-brightgreen?style=for-the-badge" alt="Simple API">
<br><strong>Simple & Intuitive</strong>
<br>Easy-to-use API that gets you started in minutes
</td>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/High-Performance-blue?style=for-the-badge" alt="High Performance">
<br><strong>High Performance</strong>
<br>Built on Nodemailer with optimized bulk sending
</td>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/Flexible-Templates-orange?style=for-the-badge" alt="Flexible Templates">
<br><strong>Flexible Templates</strong>
<br>Support for dynamic templates and variables
</td>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/Production-Ready-red?style=for-the-badge" alt="Production Ready">
<br><strong>Production Ready</strong>
<br>Built-in retry mechanisms and error handling
</td>
</tr>
</table>

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 **Fork the repository**
2. 🌿 **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. 💻 **Make your changes** and add tests
4. ✅ **Run tests** (`npm test`)
5. 📝 **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. 🚀 **Push to your branch** (`git push origin feature/amazing-feature`)
7. 🔄 **Open a Pull Request**

### 🐛 Found a Bug?
Please [open an issue](https://github.com/yourusername/fastforwardit/issues) with:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### 💡 Feature Requests
We'd love to hear your ideas! [Open an issue](https://github.com/yourusername/fastforwardit/issues) and tell us about the feature you'd like to see.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 💝 Built with ❤️ to make emailing faster & simpler

**[⭐ Star this repo](https://github.com/yourusername/fastforwardit)** • **[📦 NPM Package](https://www.npmjs.com/package/fastforwardit)** • **[📊 Package Analytics](https://npm-stat.com/charts/fastforwardit)** • **[🐦 Follow us on Twitter](https://twitter.com/yourusername)**

---

*Made with 🚀 by [Saish](https://github.com/saishmungase)*

</div>