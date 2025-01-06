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
  <div>
    <h1>Your appointment has been confirmed!</h1>
    <p>Dear {appointmentDetails.patientName},</p>
    <p>Your appointment with Dr. {appointmentDetails.doctor.name} has been scheduled for {new Date(appointmentDetails.appointmentDateTime).toLocaleString()}.</p>
    <p>Appointment Details:</p>
    <ul>
      <li>Doctor: {appointmentDetails.doctor.name}</li>
      <li>Speciality: {appointmentDetails.doctor.speciality}</li>
      <li>Date and Time: {new Date(appointmentDetails.appointmentDateTime).toLocaleString()}</li>
      <li>Payment Method: {appointmentDetails.paymentMethod}</li>
    </ul>
    <p>If you need to make any changes to your appointment, please contact us.</p>
    <p>Thank you for choosing our service!</p>
  </div>
);
