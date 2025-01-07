import * as React from 'react';

interface EmailTemplateProps {
  appointmentDetails: {
    patientName: string;
    doctor: {
      name: string;
      speciality: string;
    };
    appointmentDateTime: string;
    paymentMethod: string;
  };
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  appointmentDetails,
}) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Appointment Confirmation</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%; background-color: #f6f6f6;">
        <tr>
          <td style="vertical-align: top; padding: 24px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #3498db; color: #ffffff; text-align: center; padding: 24px;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Your appointment has been confirmed!</h1>
              </div>
              <div style="padding: 24px;">
                <p style="margin-top: 0;">Dear {appointmentDetails.patientName},</p>
                <p>Your appointment with Dr. {appointmentDetails.doctor.name} has been scheduled for {new Date(appointmentDetails.appointmentDateTime).toLocaleString()}.</p>
                <h2 style="font-size: 20px; margin-top: 24px; margin-bottom: 16px;">Appointment Details:</h2>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e1e1e1;"><strong>Doctor:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e1e1e1;">{appointmentDetails.doctor.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e1e1e1;"><strong>Speciality:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e1e1e1;">{appointmentDetails.doctor.speciality}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e1e1e1;"><strong>Date and Time:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e1e1e1;">{new Date(appointmentDetails.appointmentDateTime).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
                    <td style="padding: 8px 0;">{appointmentDetails.paymentMethod}</td>
                  </tr>
                </table>
                <p style="margin-top: 24px;">If you need to make any changes to your appointment, please contact us.</p>
                <p style="margin-bottom: 0;">Thank you for choosing our service!</p>
              </div>
              <div style="background-color: #f8f8f8; text-align: center; padding: 16px; font-size: 14px; color: #888888;">
                <p style="margin: 0;">&copy; 2023 Your Healthcare Service. All rights reserved.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
);

