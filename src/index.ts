// Re-export everything you want users to access

export { Mail } from "./mail/mail.js";
export { Group } from "./mail/group.js";

export type {
  MailMessage,
  DirectMailMessage,
  GroupMailMessage,
  MailConfig,
} from "./types.js";
