import express from 'express';
import { login, getMe, getCaptcha, verify2FA } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/captcha', getCaptcha);
router.post('/login', login);
router.post('/verify-2fa', verify2FA);
router.get('/me', getMe);

export default router;
