const express = require("express");
const { getProfileById,createProfile,deleteProfile,getAllProfiles,updateProfile } = require("../controller/profile.controller");
const verifyToken = require("../middleware/verifyToken");
const uploads = require("../middleware/upload");

const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

<<<<<<< HEAD
router.get("/", verifyToken,getAllProfiles); // Fetch all profiles
router.get("/:userId", verifyToken,getProfileById); // Fetch profile by ID
=======
router.get("/", verifyToken,getAllProfiles);
router.get("/:userId", verifyToken,getProfileById); 
>>>>>>> f652a3c (new)
router.post("/",verifyToken,uploads.fields([
        { name: "profilePic", maxCount: 1 },
        { name: "aadhaarFront", maxCount: 1 },
        { name: "aadhaarBack", maxCount: 1 },
        { name: "panCard", maxCount: 1 },
        { name: "passport", maxCount: 1 },
        { name: "driversLicense", maxCount: 1 }
    ]),
    createProfile
);
<<<<<<< HEAD
router.put("/:userId", verifyToken, uploads.fields([
=======
router.patch("/:userId", verifyToken, uploads.fields([
>>>>>>> f652a3c (new)
    { name: "profilePic", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "driversLicense", maxCount: 1 }
  ]), updateProfile);

router.delete("/:id", verifyToken,deleteProfile);

module.exports = router;




