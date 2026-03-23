// @ts-check
/// <reference path="../pb_data/types.d.ts" />

routerAdd('POST', '/api/demande-pret', (e) => {
  const body = e.requestInfo().body;
  const data = body.data;
  const {email, message, objet} = data;

  // Enregistre la demande de prêt
  let collection = $app.findCollectionByNameOrId("demande_pret")
  let record = new Record(collection)
  record.set("email", email)
  record.set("message", message)
  record.set("objet", objet)
  $app.save(record);


  // Récupère l'objet  )
  const objetRecord = new Record();
  $app.recordQuery("objets")
      .andWhere($dbx.like("nom", objet))
      .limit(1)
      .one(objetRecord)
  const objetId = objetRecord.get('id')

  // Récupère la liste des prêteurs de cet objet
  const preteurRecords = arrayOf(new Record);
  $app.recordQuery("preteur")
      .andWhere($dbx.exists(
        $dbx.exp("SELECT 1 FROM json_each(objets) objet WHERE value = {:objetId}", {objetId: objetId}))
      )
      .all(preteurRecords)
  const preteurEmails = preteurRecords.map(preteurRecord => preteurRecord?.get('email'))
  // DEBUG: pour suivre un peu l'activité du site 
  preteurEmails.push($os.getenv("EMAIL_SEND_PROPOSITION_PRET_TO"))

  // Envoi un email à chacun d'eux
  const mailClient = $app.newMailClient()
  const nomSite = '"Partage sur Châteaubourg"'
  for (const preteurEmail of preteurEmails) {          
      // To avoid resend rate limit
      sleep(600)

    const emailToSend = new MailerMessage({
      from: {
          address: $app.settings().meta.senderAddress,
          name:    $app.settings().meta.senderName,
      },
      to:      [{address: preteurEmail}],
      subject: `Quelqu'un est à la recherche d'un(e) ${objet}`,
      text: `
Un utilisateur du site ${nomSite} est à la recherche d'un(e) ${objet}

Sur le même site, vous aviez dit en avoir un(e), ca tombe bien ! 🎉

Lisez le message du demandeur ci dessous et contactez le directement à son adresse email : ${email}

De notre côté notre tâche s'arrête ici 👋, on vous laisse vous organiser librement pour le reste 💬
et on vous dit à bientôt sur ${nomSite} !

--- Message du demandeur ---

${message}

--- Fin du message ---

=> pour lui répondre : ${email}


Bonne journée :-)
      `
    })
    mailClient.send(emailToSend)
  }

  return e.json(200, {});
});