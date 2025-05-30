import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface OAuthUser {
  email: string;
  full_name: string;
  avatar_url?: string;
  provider: string;
  provider_id: string;
  email_verified: boolean;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string, full_name: string, username: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException("Un utilisateur avec cet email existe déjà.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password_hash: hashedPassword, full_name, username, status: "ACTIVE" },
    });
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { token, user: { id: user.id, email: user.email, full_name: user.full_name, username: user.username } };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password_hash) {
      throw new UnauthorizedException("Email ou mot de passe incorrect.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email ou mot de passe incorrect.");
    }
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { token, user: { id: user.id, email: user.email, full_name: user.full_name, username: user.username } };
  }

  async findUserById(userId: number) {
    return await prisma.user.findUnique({ where: { id: userId } });
  }

  async validateOAuthUser(oauthUser: OAuthUser) {
    const { email, full_name, avatar_url, provider, provider_id, email_verified } = oauthUser;

    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { provider_id, provider }
        ]
      }
    });

    if (user) {
      // Mettre à jour les informations si nécessaire
      if (user.provider !== provider || user.provider_id !== provider_id) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider,
            provider_id,
            email_verified: email_verified || user.email_verified,
            avatar_url: avatar_url || user.avatar_url,
            last_login: new Date(),
          }
        });
      } else {
        // Mettre à jour last_login
        user = await prisma.user.update({
          where: { id: user.id },
          data: { last_login: new Date() }
        });
      }
    } else {
      // Créer un nouvel utilisateur
      const username = await this.generateUniqueUsername(full_name);
      user = await prisma.user.create({
        data: {
          email,
          full_name,
          username,
          avatar_url,
          provider,
          provider_id,
          email_verified,
          status: 'ACTIVE',
          password_hash: null, // Pas de mot de passe pour les utilisateurs OAuth
        }
      });
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        avatar_url: user.avatar_url,
        provider: user.provider,
        email_verified: user.email_verified
      }
    };
  }

  private async generateUniqueUsername(fullName: string): Promise<string> {
    const baseUsername = fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15);

    let username = baseUsername;
    let counter = 1;

    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }
}

