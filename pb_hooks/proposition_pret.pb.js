// @ts-check
/// <reference path="../pb_data/types.d.ts" />

const CONSTANTS = require(`${__hooks}/constants.js`)

routerAdd('POST', '/api/proposition-pret', (e) => {
  const body = e.requestInfo().body;
  const data = body.data;
  const {email, message, objet} = data;

  let collection = $app.findCollectionByNameOrId("proposition_pret")
  let record = new Record(collection)
  record.set("email", email)
  record.set("message", message)
  record.set("objet", objet)
  $app.save(record);

  const emailToSend = new MailerMessage({
      from: {
          address: $app.settings().meta.senderAddress,
          name:    $app.settings().meta.senderName,
      },
      to:      [{address: $os.getenv("EMAIL_SEND_PROPOSITION_PRET_TO")}],
      subject: "Nouvelle proposition de prêt",
      html:    `Email : ${email}\n\nMessage : ${message}`
  })
  $app.newMailClient().send(emailToSend)

  return e.json(200, {});
});