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
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Appointment Confirmation</title>
    </head>
    <body className="font-sans text-base leading-relaxed m-0 p-0">
      <div className="bg-gray-100 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
          <div className="bg-blue-500 text-white text-center py-6">
            <h1 className="text-2xl font-bold">Your appointment has been confirmed!</h1>
          </div>
          <div className="p-6">
            <p className="mb-4">Dear {appointmentDetails.patientName},</p>
            <p className="mb-6">
              Your appointment with Dr. {appointmentDetails.doctor.name} has been scheduled for{' '}
              {new Date(appointmentDetails.appointmentDateTime).toLocaleString()}.
            </p>
            <h2 className="text-xl font-semibold mb-4">Appointment Details:</h2>
            <table className="w-full mb-6">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Doctor:</td>
                  <td className="py-2">{appointmentDetails.doctor.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Speciality:</td>
                  <td className="py-2">{appointmentDetails.doctor.speciality}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Date and Time:</td>
                  <td className="py-2">{new Date(appointmentDetails.appointmentDateTime).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Payment Method:</td>
                  <td className="py-2">{appointmentDetails.paymentMethod}</td>
                </tr>
              </tbody>
            </table>
            <p className="mb-4">
              If you need to make any changes to your appointment, please contact us.
            </p>
            <p>Thank you for choosing our service!</p>
          </div>
          <div className="bg-gray-100 text-center py-4 text-sm text-gray-600">
            <p>&copy; 2023 Your Healthcare Service. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
  </html>
);

