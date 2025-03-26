const express = require("express");
const admin = require("../firebaseAdmin");  // Firebase Admin SDK
const router = express.Router();

router.post("/verifyToken", async (req, res) => {
    const { idToken } = req.body;  // Get the ID token sent from the frontend

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);  // Verify the ID token
        res.json({ success: true, uid: decodedToken.uid });
    } catch (error)  {
        res.status(401).json({ error: "Unauthorized" });
    }
});

module.exports = router;