import { PrismaClient } from '@prisma/client';
import svgCaptcha from 'svg-captcha';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const prisma = new PrismaClient();

// In-memory store for captchas (in production, use Redis or DB)
const captchaStore = new Map();

// Configure Nodemailer (Test Account)
let transporter;
nodemailer.createTestAccount().then(account => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
  console.log('📧 Ethereal Email test account configured.');
});

export const getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    ignoreChars: '0o1il',
    noise: 2,
    color: true,
    background: '#1e1e2e'
  });
  const id = crypto.randomUUID();
  
  // Store solution for 5 minutes
  captchaStore.set(id, captcha.text);
  setTimeout(() => captchaStore.delete(id), 5 * 60 * 1000);

  res.json({ id, svg: captcha.data });
};

export const login = async (req, res) => {
  try {
    const { email, password, captchaId, captchaValue } = req.body;
    
    // Verify Captcha
    if (!captchaId || !captchaValue) {
      return res.status(400).json({ message: 'Captcha requis' });
    }
    const storedCaptcha = captchaStore.get(captchaId);
    if (!storedCaptcha || storedCaptcha.toLowerCase() !== captchaValue.toLowerCase()) {
      captchaStore.delete(captchaId);
      return res.status(401).json({ message: 'Captcha invalide ou expiré' });
    }
    captchaStore.delete(captchaId); // One-time use

    // Verify Credentials
    const user = await prisma.user.findUnique({
      where: { email },
      include: { stats: true }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Generate 6-digit 2FA code
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode, twoFactorExpires }
    });

    // Send Email
    if (transporter) {
      const info = await transporter.sendMail({
        from: '"SportSync Security" <security@sportsync.fr>',
        to: user.email,
        subject: "Votre code de vérification 2FA",
        html: `
          <h2>Vérification 2FA</h2>
          <p>Bonjour ${user.name},</p>
          <p>Votre code de vérification est : <strong style="font-size:24px; letter-spacing: 4px;">${twoFactorCode}</strong></p>
          <p>Ce code expire dans 10 minutes.</p>
        `
      });
      console.log('✉️ 2FA Email sent. Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    // Return status requesting 2FA
    res.json({ 
      status: '2FA_REQUIRED',
      message: 'Un code de vérification vous a été envoyé.',
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { stats: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.twoFactorCode !== code) {
      return res.status(401).json({ message: 'Code 2FA incorrect' });
    }

    if (user.twoFactorExpires < new Date()) {
      return res.status(401).json({ message: 'Code 2FA expiré' });
    }

    // Clear 2FA code
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode: null, twoFactorExpires: null }
    });

    const { password: _, twoFactorCode, twoFactorExpires, ...userWithoutSensitiveInfo } = user;
    
    res.json({ 
      user: userWithoutSensitiveInfo, 
      token: 'mock-jwt-token-' + user.id 
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getMe = async (req, res) => {
  res.json({ message: 'Not implemented yet' });
};
