import express from "express";

import {
    saveRequirement,
    getAllRequirements,
    getRequirementById,
    deleteRequirement,
    updateRequirement,
} from "../controllers/requirement.controller.js";

const router = express.Router();

router.route("/").post(saveRequirement);
router.route("/").get(getAllRequirements);
router.route("/:id").get(getRequirementById);
router.route("/:id").delete(deleteRequirement);
router.route("/:id").patch(updateRequirement);

export default router;
