const admin = require("firebase-admin");
const serviceAccount = require("./path/to/your/firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;