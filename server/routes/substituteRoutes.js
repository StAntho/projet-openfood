import express from "express";
import Substitute from "../controller/substituteController.js";
import { isAuth } from "../auth/authentification.js";

const substituteRouter = express.Router();

substituteRouter.get("/:userId", isAuth, Substitute.getSubstitutes);
substituteRouter.get("/:userId/:id", isAuth, Substitute.getSubstituteById);
substituteRouter.patch("/set", isAuth, Substitute.setSubstitute);
substituteRouter.patch("/update", isAuth, Substitute.updateSubstitute);
substituteRouter.patch("/delete", isAuth, Substitute.deleteSubstitute);

export default substituteRouter;
