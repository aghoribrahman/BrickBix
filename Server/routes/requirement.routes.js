import express from "express";

import {
    saveRequirement,
} from "../controllers/requirement.controller.js";

const router = express.Router();

router.route("/").get(saveRequirement);

export default router;
