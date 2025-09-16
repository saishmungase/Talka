# 📚 FastForwardIt Mail Documentation

## Table of Contents
- [Mail Class Overview](#mail-class-overview)
- [Core Methods](#core-methods)
- [Group Management](#group-management)
- [Advanced Features](#advanced-features)
- [Error Handling](#error-handling)

## Mail Class Overview

The `Mail` class is the core component that handles all email operations. It extends the `Provider` class and initializes with a Nodemailer transporter.

### Constructor

```typescript
const mailer = new Mail({
    transporterOptions: {
        service: "gmail",
        auth: {
            user: "your@gmail.com",
            pass: "your-app-password"
        }
    },
    defaultFrom: "your@gmail.com"
});
```

## Core Methods

### 1. Basic Email Sending
The `sendBasic` method handles simple email delivery.

**Theory:**
- Uses Nodemailer's transport
- Supports text and HTML content
- Handles basic email fields (to, from, subject, etc.)

**Syntax:**
```typescript
async sendBasic(message: DirectMailMessage): Promise<void>
```

**Example:**
```typescript
await mailer.sendBasic({
    to: "recipient@example.com",
    subject: "Hello!",
    text: "This is a simple email",
    cc: "cc@example.com",
    bcc: "bcc@example.com"
});
```

### 2. Attachments
The `sendWithAttachments` method handles emails with file attachments.

**Theory:**
- Supports multiple file attachments
- Automatically handles file paths
- Preserves original filenames

**Syntax:**
```typescript
async sendWithAttachments(message: DirectMailMessage): Promise<void>
```

**Example:**
```typescript
await mailer.sendWithAttachments({
    to: "recipient@example.com",
    subject: "Documents",
    text: "Please find attached files",
    attachments: [
        "path/to/document1.pdf",
        "path/to/document2.jpg"
    ]
});
```

### 3. Template-based Emails
The `sendWithTemplate` method supports HTML templates with variable substitution.

**Theory:**
- Loads HTML templates from filesystem
- Supports dynamic variable replacement
- Handles both subject and body templating

**Syntax:**
```typescript
async sendWithTemplate(message: DirectMailMessage): Promise<void>
```

**Example:**
```typescript
await mailer.sendWithTemplate({
    to: "recipient@example.com",
    subject: "Welcome {{name}}!",
    template: "templates/welcome.html",
    variables: {
        name: "John",
        company: "ACME",
        role: "Developer"
    }
});
```

## Group Management

### 1. Group Creation
The group management system allows organizing recipients into groups.

**Methods:**

```typescript
// Add a single group
addGroup(key: string, value: string[]): void

// Add multiple groups
addBulkGroup(map: Map<string, string[]>): void

// Get group members
getGroup(key: string): string[]

// Remove Group 
removeGroup(key : string) : boolean

// List all groups
listGroups(): string[]

// Get an Group Names and Their Members
getAll(): Map<string, string[]> 

```

**Examples:**
```typescript
// Create a group
mailer.addGroup("team", [
    "member1@example.com",
    "member2@example.com"
]);

// Add multiple groups
mailer.addBulkGroup(new Map([
    ["developers", ["dev1@example.com", "dev2@example.com"]],
    ["managers", ["mgr1@example.com", "mgr2@example.com"]]
]));
```

### 2. Group Member Management

**Methods:**
```typescript
addGroupMember(key: string, person: string): void
removeGroupMember(key: string, person: string): boolean
```

**Example:**
```typescript
mailer.addGroupMember("team", "new.member@example.com");
mailer.removeGroupMember("team", "old.member@example.com");
```

### 3. Share 

**Methods:**
```typescript
async sendGroup(groupNames: string[], message: GroupMailMessage) 
```

**Example:**
```typescript
async sendGroup(["developer", "stakeholder"], {
    to: "recipient@example.com",
    subject: "The Important Update in the Software"
}) 
```

## Advanced Features

### 1. Scheduled Emails

**Theory:**
- Supports delay-based scheduling
- Implements cron-based recurring emails
- Handles timezone considerations

**Methods:**
```typescript
// Delay-based scheduling
async sendScheduled(message: MailMessage, delayMs: number): Promise<void>

// Cron-based scheduling
sendScheduledCron(cronExpr: string, message: MailMessage): ScheduledTask
```

**Examples:**
```typescript
// Send after 5 seconds
await mailer.sendScheduled({
    to: "recipient@example.com",
    subject: "Delayed Message"
}, 5000);

// Send every day at 9 AM
const job = mailer.sendScheduledCron("0 9 * * *", {
    to: "recipient@example.com",
    subject: "Daily Update"
});
```

### 2. Bulk Personalized Emails

**Theory:**
- Handles mass email sending
- Supports individual personalization
- Includes error handling and reporting

**Syntax:**
```typescript
async sendBulkPersonalized(
    message: GroupMailMessage,
    list: { [key: string]: string }[]
): Promise<any[]>
```

**Example:**
```typescript
await mailer.sendBulkPersonalized({
    subject: "Welcome {{name}}",
    template: "welcome.html"
}, [
    { email: "user1@example.com", name: "John", role: "Admin" },
    { email: "user2@example.com", name: "Jane", role: "User" }
]);
```

### 3. Retry Mechanism

**Theory:**
- Implements exponential backoff
- Handles transient failures
- Configurable retry attempts

**Syntax:**
```typescript
async sendWithRetry(
    message: MailMessage,
    options?: { retries?: number, delay?: number }
): Promise<any>
```

**Example:**
```typescript
await mailer.sendWithRetry({
    to: "recipient@example.com",
    subject: "Important Message"
}, {
    retries: 3,
    delay: 1000
});
```

## Error Handling

All methods implement comprehensive error handling:

```typescript
try {
    await mailer.sendBasic({...});
} catch (error) {
    console.error("Send failed:", error.message);
    // Handle specific error types
}
```

## Testing

The library includes a built-in test method:

```typescript
await mailer.sendTest();
```

This sends a test email to verify your configuration.

## Best Practices

1. Always use environment variables for credentials
2. Implement proper error handling
3. Use templates for consistent styling
4. Test emails in development first
5. Monitor sending rates and limits