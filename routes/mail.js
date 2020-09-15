import sgClient from '@sendgrid/client';

/** Your initial API key from the SendGrid UI */
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

let req = {
  method: 'POST',
  url: '/v3/api_keys',
  body: { name: 'NEW_SG_KEY' }
};

sgClient.request(req)
  .then( ([res, body]) => {
    console.log(`key: ${body.api_key}`);
    console.log(`ID:  ${body.api_key_id}`);
  })
  .catch( err => {
    console.log(`Unable to create new API key: ${err.code} ${err.message}`);
  });