// firebaseAdmin.js
import admin from "firebase-admin";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse JSON manually
const serviceAccountPath = path.join(__dirname, "config", "firebaseServiceAccountKey.json");
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;