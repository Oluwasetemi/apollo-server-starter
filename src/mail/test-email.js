require('dotenv').config({ path: 'variables.env' });
const { send } = require('../mail');

(async function sampleSend() {
  // send email to the new user
  try {
    await send({
      filename: 'request-reset',
      to: 'temi@mailinator.com',
      subject: 'Test Email',
      title: 'mr X',
      name: 'setemi ojo',
      companyName: 'dev Team',
      resetLink: 'https://oluwasetemi.dev',
      activateLink: 'https://oluwasetemi.dev',
      loginLink: 'https://oluwasetemi.dev',
      description: 'description',
      datetime: '12/02/1993',
      professional: 'Dr Sohci',
      type: 'Done',
      purpose: 'We need to eat',
    });
    console.log('Email Sent 💌');
  } catch (error) {
    console.error('some dangerous happened');
  }
})();
