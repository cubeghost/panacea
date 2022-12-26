import mail from '@sendgrid/mail';

mail.setApiKey(process.env.SENDGRID_API_KEY);

interface SendEmailArguments {
  to: string;
  subject: string;
  body: string;
}
export const sendEmail = ({
  to,
  subject,
  body,
}: SendEmailArguments) => 
mail
  .send({
    from: process.env.AUTH_EMAIL_FROM,
    to,
    subject,
    html: body,
  })
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  });
