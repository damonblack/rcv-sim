const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// cloud functions getting started: https://firebase.google.com/docs/functions/get-started
// to deploy, run from CLI: firebase deploy --only functions

// https://us-central1-rcv-sim.cloudfunctions.net/addMessage?text=yourmessagetext
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    const obj = { original: original, created: Date.now() };
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push(obj).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      //return res.redirect(303, snapshot.ref.toString());
      return res.send(obj);
    });
  });

// https://us-central1-rcv-sim.cloudfunctions.net/deleteOldMessages
exports.deleteOldMessages = functions.https.onRequest((req, res) => {

    console.info('version 7');

    const messages = admin.database().ref('/messages');
    
    const now = Date.now();
    //cutoff is 14 days in the past, as milliseconds
    //const cutoff = now - 14 * 24 * 60 * 60 * 1000;
    const cutoff = now - 2 * 60 * 60 * 1000;

    // https://stackoverflow.com/questions/32004582/delete-firebase-data-older-than-2-hours
    const oldItemsQuery = messages.orderByChild('created').startAt(0).endAt(cutoff);
    const updates = {};
    // cloud functions don't yet support "await": https://stackoverflow.com/questions/49117972/how-to-make-http-request-async-await-in-cloud-functions-for-firebase
    oldItemsQuery.once('value', snapshot => {
      snapshot.forEach(child => {
        updates[child.key] = null
      });

      return messages.update(updates);
    }).then(result => {
      console.log(result);
      console.log(updates);
      console.log(`deleted ${Object.keys(updates).length} elections with related data`);
      return true;
    }).catch((err) => {
      console.log(err);
      throw Error('failure completing updates');
    });

    return res.send("delete request was queued without errors, review database log for results");
  });
