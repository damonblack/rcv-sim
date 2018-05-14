const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// cloud functions getting started: https://firebase.google.com/docs/functions/get-started
// to deploy, run from CLI: firebase deploy --only functions

// https://us-central1-rcv-sim.cloudfunctions.net/deleteOldElections
exports.deleteOldElections = functions.https.onRequest((req, res) => {
  const elections = admin.database().ref('/elections');
  const candidates = admin.database().ref('/candidates');
  const votes = admin.database().ref('/votes');

  const now = Date.now();
  //cutoff is 14 days in the past, as milliseconds
  const cutoff = now - 14 * 24 * 60 * 60 * 1000;

  // https://stackoverflow.com/questions/32004582/delete-firebase-data-older-than-2-hours
  // be careful with startAt(0), if you remove that, elections without 'created' will be deleted.
  const oldItemsQuery = elections
    .orderByChild('created')
    .startAt(0)
    .endAt(cutoff);
  const updates = {};

  // cloud functions don't yet support "await": https://stackoverflow.com/questions/49117972/how-to-make-http-request-async-await-in-cloud-functions-for-firebase
  oldItemsQuery
    .once('value', snapshot => {
      snapshot.forEach(child => {
        updates[child.key] = null;
      });

      var delElections = elections.update(updates);
      var delCandidates = candidates.update(updates);
      var delVotes = votes.update(updates);

      return { delElections, delCandidates, delVotes };
    })
    .then(result => {
      console.log(
        `deleted ${Object.keys(updates).length} elections with related data`
      );
      return true;
    })
    .catch(err => {
      console.log(err);
      throw Error('failure completing updates');
    });

  return res.send(
    'delete request was queued successfully, review database log for results'
  );
});
