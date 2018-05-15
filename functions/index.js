const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// cloud functions getting started: https://firebase.google.com/docs/functions/get-started
// to deploy, run from CLI: firebase deploy --only functions

// https://us-central1-rcv-sim.cloudfunctions.net/deleteOldElections
exports.deleteOldElections = functions.https.onRequest((req, res) => {
  const now = Date.now();
  //cutoff is 14 days in the past, as milliseconds
  const cutoff = now - 14 * 24 * 60 * 60 * 1000;

  // https://stackoverflow.com/questions/32004582/delete-firebase-data-older-than-2-hours
  // be careful with startAt(0), if you remove that, elections without 'created' will be deleted.
  const oldItemsQuery = admin
    .database()
    .ref('/elections')
    .orderByChild('created')
    .startAt(0)
    .endAt(cutoff);

  // cloud functions don't yet support "await": https://stackoverflow.com/questions/49117972/how-to-make-http-request-async-await-in-cloud-functions-for-firebase
  const updates = {};
  oldItemsQuery
    .once('value', snapshot => {
      snapshot.forEach(child => {
        updates['/elections/' + child.key] = null;
        updates['/candidates/' + child.key] = null;
        updates['/votes/' + child.key] = null;
      });

      var deleteQuery = admin
        .database()
        .ref()
        .update(updates);

      return deleteQuery;
    })
    .then(result => {
      console.log(
        `deleted ${Object.keys(updates).length / 3} elections with related data`
      );
      return true;
    })
    .catch(err => {
      console.error(err);
      throw Error('failure completing updates');
    });

  return res.send(
    'delete request was queued successfully, review database log for results'
  );
});
