// eslint-disable-next-line import/no-mutable-exports
let admin = null;
if (process.server) {
  admin = require('firebase-admin');
  if (!admin.apps.length) {
    const serviceAccount = require('../firebase-adminsdk.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
}
export default admin;
