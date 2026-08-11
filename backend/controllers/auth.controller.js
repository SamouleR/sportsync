import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        stats: true
      }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // In a real app, we would generate a JWT token here.
    // For simplicity during migration, we'll return the user object (simulating token payload/session)
    // and a mock token.
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      user: userWithoutPassword, 
      token: 'mock-jwt-token-' + user.id 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getMe = async (req, res) => {
  // Mock endpoint to simulate getting current user from token
  res.json({ message: 'Not implemented yet' });
};
