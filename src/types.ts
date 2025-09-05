import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export interface BaseMessage {
  subject: string;
  text?: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: string[];
  template?: string;
  variables?: Record<string, string>;
}

export interface DirectMailMessage extends BaseMessage {
  to: string | string[];
  group?: never; 
}

export interface GroupMailMessage extends BaseMessage {
  group: string;
  to?: never; 
}

export type MailMessage = DirectMailMessage | GroupMailMessage;

export interface MailConfig {
  transporterOptions: SMTPTransport.Options; // instead of TransportOptions
  defaultFrom: string;
}