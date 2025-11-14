import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck";
import { searchEmails } from "../controllers/searchController";
import { getEmails ,getEmailById} from "../controllers/emailController";


const router = Router();

router.get("/health", healthCheck);
router.get("/search", searchEmails);
router.get("/emails", getEmails);
router.get("/emails/:id", getEmailById);


export default router;
