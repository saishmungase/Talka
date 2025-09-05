import { Provider } from "../talka/core.interface.js";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer"
import fs from "fs"
import { Group } from "./group.js";
import cron from "node-cron"
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import type { DirectMailMessage, GroupMailMessage, MailConfig, MailMessage } from "../types.js";


export class Mail extends Provider {

    transporter : Transporter;
    defaultFrom : string;
    groups : Group;

    constructor(config: MailConfig) {
        super(config.transporterOptions);
        this.transporter = nodemailer.createTransport(config.transporterOptions);
        this.defaultFrom = config.defaultFrom;
        this.groups = new Group();
    }
   
    private async _send(options : any){
        try {
            return await this.transporter.sendMail({
                from: options.from || this.defaultFrom,
                to: options.to,
                subject: options.subject,
                text: options.text || "",
                html: options.html,
                attachments: options.attachments,
                cc: options.cc,
                bcc: options.bcc
            })   
        } catch (error) {
            throw new Error(`Error While Sending Message => ${(error as Error).message}`)
        }
    }


    async sendBasic(message : DirectMailMessage){
        try {
            await this._send(message)
        } catch (error) {
            throw new Error(`Error While Processing Message => ${(error as Error).message}`)
        }
    }

    async sendWithAttachments(message : DirectMailMessage){
        try {
            const attachments = (message.attachments || []).map(f => ({
                filename : f.split("/").pop(),
                path : f
            }));
            console.log(attachments)
            await this._send({...message, attachments});
        } catch (error) {
            throw new Error(`Error While Fetching Attachments => ${(error as Error).message}`)
        }
    }

    async sendWithTemplate(message : DirectMailMessage){
        try {
            if (!message.template) throw new Error("No template provided");

            let html = await fs.promises.readFile(message.template, "utf-8");
            let sendingSubject = message.subject;
            if(message.variables){
                for(const [key, val] of Object.entries(message.variables)){
                    sendingSubject = sendingSubject.replace(new RegExp(`{{${key}}}`, "g"), val);
                }
                for( const [key, val] of Object.entries(message.variables)){
                    html = html.replace(new RegExp(`{{${key}}}`, "g"), val);
                }
            }
            return this._send({...message, subject : sendingSubject, html})

        } catch (error) {
            console.log(`Error While Handling File => ${(error as Error).message}`)
        }
    }

    // Groups
    addGroup(key : string, value : string[]){
        try {
            this.groups.addGroup(key, value)
        } catch (error) {
            throw new Error(`Error While Adding Group => ${(error as Error).message}`)
        }
    }

    getGroup(key : string){
        try {
            return this.groups.getGroup(key)
        } catch (error) {
            throw new Error(`Error While Fetching Group => ${(error as Error).message}`)
        }
    }

    addBulkGroup(map : Map<string, string[]>){
        try {
            this.groups.addBulkGroups(map)
        } catch (error) {
            throw new Error(`Error While Adding Group => ${(error as Error).message}`)
        }
    }

    removeGroup(key : string) : boolean{
        try {
            return this.groups.removeGroup(key)
        } catch (error) {
            throw new Error(`Error While Adding Group => ${(error as Error).message}`)
        }
    }

    listGroups(){
        try {
            return this.groups.listGroups()
        } catch (error) {
            throw new Error(`Error While Adding Group => ${(error as Error).message}`)
        }
    }

    getAll(){
        try {
            return this.groups.getAll()
        } catch (error) {
            throw new Error(`Error While Adding Group => ${(error as Error).message}`)
        }
    }

    addGroupMember(key : string, person : string){
        try {
            this.groups.addGroupMember(key, person)
        } catch (error) {
            throw new Error(`Error While Adding Group => ${(error as Error).message}`)
        }
    }

    removeGroupMember(key : string, person : string){
        try {
            return this.groups.removeGroupMember(key, person)
        } catch (error) {
            throw new Error(`Error While Adding Group => ${(error as Error).message}`)
        }
    }

    async sendGroup(groupNames: string[], message: GroupMailMessage) {
      const promises = groupNames.flatMap((name) => {
        const group = this.getGroup(name);
        if (!group) throw new Error("No Valid Group Found For Id => " + name);
        return group.map((person) =>
          this._send({ ...message, to: person }) 
        );
      });
      return Promise.all(promises);
    }

    // ============ Group Ends =============

    async sendScheduled(message: MailMessage, delayMs: number) {
      if (delayMs < 0) throw new Error("Delay must be >= 0");

      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const info = await this._send(message);
            console.log(`📧 Scheduled mail sent after ${delayMs}ms`);
            resolve(info);
          } catch (error) {
            reject(new Error(`Failed scheduled send => ${(error as Error).message}`));
          }
        }, delayMs);
      });
    }

    sendScheduledCron(cronExpr: string, message: MailMessage) {
      if (!cron.validate(cronExpr)) {
        throw new Error(`Invalid cron expression: ${cronExpr}`);
      }

      const task = cron.schedule(cronExpr, async () => {
        try {
          await this._send(message);
          console.log(`📧 Cron mail sent at ${new Date().toISOString()}`);
        } catch (error) {
          console.error(`❌ Cron mail failed: ${(error as Error).message}`);
        }
      });

      console.log(`⏰ Cron job scheduled with expression "${cronExpr}"`);
      return task; 
    }

    async sendBulkPersonalized(
      message: GroupMailMessage,
      list: { [key: string]: string }[]
    ) {
      try {
        if (!message.template) {
          throw new Error("No template provided");
        }

        const templateContent = await fs.promises.readFile(message.template, "utf-8");

        const skipped: { [key: string]: string }[] = [];

        const promises = list.map(async (person) => {
          if (!person.email) {
            skipped.push(person); 
            return null; 
          }

          let html = templateContent;
          let subject = message.subject;

          for (const [key, val] of Object.entries(person)) {
            subject = subject.replace(new RegExp(`{{${key}}}`, "g"), val);
            html = html.replace(new RegExp(`{{${key}}}`, "g"), val);
          }

          return this._send({
            ...message,
            to: person.email,
            subject,
            html,
          });
        });

        const results = await Promise.all(promises.filter(Boolean) as Promise<any>[]);

        if (skipped.length > 0) {
          console.warn(
            "⚠️ Skipped users (missing `email`):",
            skipped.map((s) => JSON.stringify(s, null, 2))
          );
        }

        return results;
      } catch (error) {
        throw new Error(
          `Error While Sending In Bulk => ${(error as Error).message}`
        );
      }
    }


    async sendWithRetry(message : MailMessage, { retries = 3, delay = 1000 } = {}) {
      let attempt = 0;
      let lastError;

      while (attempt < retries) {
        try {
          attempt++;
          console.log(`Attempt ${attempt} to send mail...`);
          const info = await this._send(message);
          console.log("Mail sent successfully!");
          return info; 
        } catch (error : any) {
            lastError = error;  
            if (error.responseCode && error.responseCode >= 400) { // 4xx mean permanent failure
              console.error("❌ Permanent error (won't retry):", error.message);
              break;
            }   
            console.error(`Failed attempt ${attempt}:`, (error.message || error)); 
            if (attempt < retries) {
              console.log(`Retrying in ${delay}ms...`);
              await new Promise((res) => setTimeout(res, delay));
            }
        }
      }

      throw new Error(`Failed after ${attempt} attempts: ${lastError.message}`);
    }

    async sendTest(){
        let subject = "Testing Mail Working"
        const date = new Date()
        let text = `This Mail is For Testing Purpose only \n 
        Test Information : \n
        Sender 🗣️ : ${this.defaultFrom}, \n
        Date 🗓️ : ${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}, \n
        Time ⏲️ : ${date.getHours()} : ${date.getMinutes()} : ${date.getSeconds()} (HH : MM : SS),
        Purpose 📃 : Testing an Amazing Library
        `
        if(!this.defaultFrom){
            throw new Error("Please Provide Default From Before Running sendTest() ")
        }

        const message : MailMessage = {
            from : this.defaultFrom,
            to : this.defaultFrom,
            subject : subject,
            text : text
        }

        await this._send(message);
        console.log("Mail Was Send Successfully ✅ \n Make Sure To Check Your Inbox / Sent for Mail ");
    }
}