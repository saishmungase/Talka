import { Provider } from "../talka/core.interface.js";
import nodemailer from "nodemailer";
import type { Transporter, TransportOptions } from "nodemailer"

const supportings = ["attachment", "template"]

interface MailMessage {
    to: string;
    subject: string;
    text: string;
    from?: string;
}

interface MailConfig{
    transporterOptions : TransportOptions,
    defaultFrom : string
}

export class Mail extends Provider {
    defaultFrom : string;
    transporter: Transporter;

    constructor(config: MailConfig) {
        super(config.transporterOptions);
        this.transporter = nodemailer.createTransport(config.transporterOptions);
        this.defaultFrom = config.defaultFrom;
    }

    async send(message : MailMessage): Promise<void> {
        try {
            this.verify()
            await this.transporter.sendMail({
                from : message.from || this.defaultFrom,
                to : message.to,
                subject : message.subject,
                text : message.text
            })
        } catch (error) {
            throw new Error("Got Error While Sending Mail => \n" + error)
        }
    }

    supports(field: string): boolean {
        return supportings.includes(field.trim().toLowerCase())
    }

    async verify(){
        try {
            await this.transporter.verify()
            console.log("Verification Successfull !")
        } catch (error) {
            throw new Error("Error In Transporter Creation : " +  error)
        }
    }

}
