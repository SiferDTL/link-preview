import express from 'express'
import {PrevLinkCtr} from '../controllers/prevLink.controllers'
const router = express.Router();
import { wrapperError  } from '../middlewares/error-handler'
import validation from '../middlewares/validationMiddleware'

router.get('/preview', validation.addValidationPrevLink, wrapperError(PrevLinkCtr.getPrevLink));

router.get('/image-proxy', validation.addValidationMedia, wrapperError(PrevLinkCtr.getMedia));

export default router;
