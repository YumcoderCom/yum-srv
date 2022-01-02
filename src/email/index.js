import nodeMailer from "nodemailer";
import { parser } from "./parser.js";
import path from "path";

// TODO read from env
const key = {
  "type": "service_account",
  "project_id": "nbcc-app",
  "private_key_id": "058468e1bdfd.......",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBAD......\n-----END PRIVATE KEY-----\n",
  "client_email": "app-email-service@app.iam.gserviceaccount.com....",
  "client_id": "113057.....",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..........-app.iam.gserviceaccount.com"
}

// emailAdapter
export default opt => {
  //set defaults
  const templates = opt.templates || {};

  //create nodemailer transporter
  // let transporter = nodeMailer.createTransport(opt);
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: "support@xxx.io",
      serviceClient: key.client_id,
      privateKey: key.private_key,
    },
    ...opt
  });

  //transporter verification
  const verifyTransporter = () => {
    return new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      });
    });
  };

  //
  const sendMail = mail => {
    return new Promise((resolve, reject) => {
      //parse template
      parser(mail.template, mail.templateData)
        .then(html => {
          let mailOptions = {
            from: opt.from,
            to: [mail.to],
            subject: mail.subject,
            html
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              reject(error);
            } else {
              resolve(info);
            }
          });
        })
        .catch(error => reject(error));
    });
  };

  //sendVerificationEmail interface
  const sendVerificationEmail = data => {
    return new Promise((resolve, reject) => {
      const { user, appName } = data;
      sendMail({
        to: user.get("email") || user.get("username"),
        subject: "Please verify your E-mail with " + appName,
        template:
          templates.verificationEmail ||
          path.join(__dirname, "./templates/verificationEmail.html"),
        templateData: data
      })
        .then(success => {
          resolve(success);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  //sendPasswordResetEmail interface
  const sendPasswordResetEmail = data => {
    return new Promise((resolve, reject) => {
      const { user, appName } = data;
      sendMail({
        to: user.get("email") || user.get("username"),
        subject: "Reset your password with " + appName,
        template:
          templates.passwordResetEmail ||
          path.join(__dirname, "./templates/passwordResetEmail.html"),
        templateData: data
      })
        .then(success => {
          resolve(success);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  return {
    sendMail,
    verifyTransporter,
    sendVerificationEmail,
    sendPasswordResetEmail
  };
};

// module.exports = adapter;
