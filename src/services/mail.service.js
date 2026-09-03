import { transporter, isMailEnabled } from '../config/mailer.config.js';
import { config } from '../config/config.js';

const layout = (title, body) => `
  <div style="font-family: Arial, Helvetica, sans-serif; color: #1c1c1c; max-width: 560px;">
    <h1 style="color: #0b5fff; font-size: 20px;">${title}</h1>
    ${body}
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
    <p style="font-size: 12px; color: #666;">
      SoftwareAI - Cursos de desarrollo de software con Inteligencia Artificial<br />
      info@softwareai.com.mx
    </p>
  </div>
`;

// Un fallo de correo nunca invalida la operacion principal: se registra y se sigue.
const send = async ({ to, subject, html }) => {
  if (!isMailEnabled) {
    console.info(`[mail:omitido] ${subject} -> ${to} (MAIL_HOST no configurado)`);
    return false;
  }

  try {
    await transporter.sendMail({ from: config.mail.from, to, subject, html });
    return true;
  } catch (error) {
    console.error(`[mail:error] No se pudo enviar "${subject}" a ${to}: ${error.message}`);
    return false;
  }
};

export const sendTicketConfirmationEmail = ({ to, userName, eventTitle, eventDate, reservationCode, quantity }) =>
  send({
    to,
    subject: 'Confirmacion de inscripcion | SoftwareAI',
    html: layout(
      'Inscripcion confirmada',
      `<p>Hola ${userName}, tu inscripcion a <strong>${eventTitle}</strong> quedo confirmada.</p>
       <p>Fecha de inicio: <strong>${new Date(eventDate).toLocaleString('es-MX')}</strong></p>
       <p>Lugares reservados: <strong>${quantity}</strong></p>
       <p>Codigo de reserva: <strong>${reservationCode}</strong></p>
       <p>Presenta este codigo el dia del curso.</p>`
    )
  });

export const sendTicketCancellationEmail = ({ to, userName, eventTitle, reservationCode }) =>
  send({
    to,
    subject: 'Cancelacion de inscripcion | SoftwareAI',
    html: layout(
      'Inscripcion cancelada',
      `<p>Hola ${userName}, tu inscripcion a <strong>${eventTitle}</strong> fue cancelada.</p>
       <p>Codigo de reserva: <strong>${reservationCode}</strong></p>
       <p>El lugar quedo disponible para otras personas.</p>`
    )
  });
