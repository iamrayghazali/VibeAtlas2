const express = require("express");
const admin = require("../firebaseAdmin");
const router = express.Router();

router.post("/verifyToken", async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        res.json({ success: true, uid: decodedToken.uid });
    } catch (error)  {
        res.status(401).json({ error: "Unauthorized" });
    }
});

module.exports = router;