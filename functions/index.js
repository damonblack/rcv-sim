const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// cloud functions getting started: https://firebase.google.com/docs/functions/get-started
// to deploy, run from CLI: firebase deploy --only functions

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

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

    console.info('version 9');

    const messages = admin.database().ref('/messages');
    
    const now = Date.now();
    //cutoff is 14 days in the past, as milliseconds
    //const cutoff = now - 14 * 24 * 60 * 60 * 1000;
    const cutoff = now - 2 * 60 * 60 * 1000;

    // https://stackoverflow.com/questions/32004582/delete-firebase-data-older-than-2-hours
    const oldItemsQuery = messages.orderByChild('created').endAt(cutoff);

    var results = oldItemsQuery.once('value', function(snapshot) {
        // create a map with all children that need to be removed
        const updates = {};
        snapshot.forEach(function(child) {
          updates[child.key] = null
        });

        console.log(updates);
        // execute all updates in one go and return the result to end the function
        return messages.update(updates);
      });

    return res.send("trying something");
  });

