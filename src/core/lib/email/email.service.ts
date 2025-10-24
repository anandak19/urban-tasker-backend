import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';
import { sendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  constructor(private _configService: ConfigService) {}

  emailTransport() {
    const transport = nodeMailer.createTransport({
      host: this._configService.get<string>('SMTP_HOST'),
      port: this._configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this._configService.get<string>('SMTP_FROM'),
        pass: this._configService.get<string>('SMTP_PASS'),
      },
    });
    return transport;
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipient, subject, html } = dto;

    const transport = this.emailTransport();

    const options: nodeMailer.SendMailOptions = {
      from: this._configService.get<string>('SMTP_FROM'),
      to: recipient,
      subject: subject,
      html: html,
    };
    try {
      await transport.sendMail(options);
      console.log('Email send successfull');
    } catch (error) {
      console.log('Error sending emaill!!!', error);
    }
  }
}
