import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { config } from '../config';
import type { User, AuthTokens, AuthResponse } from '@ai-code-tutor/shared';

export class AuthService {
  async signup(email: string, password: string): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at, updated_at',
      [email, passwordHash]
    );

    const user = this.mapUser(result.rows[0]);

    // Initialize streak
    await query('INSERT INTO streaks (user_id) VALUES ($1)', [user.id]);

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    return { user, tokens };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const result = await query(
      'SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const userRow = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, userRow.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const user = this.mapUser(userRow);
    const tokens = this.generateTokens(user.id);

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
      return this.generateTokens(payload.userId);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  verifyToken(token: string): { userId: string } {
    try {
      const payload = jwt.verify(token, config.jwt.secret) as { userId: string };
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateTokens(userId: string): AuthTokens {
    const accessToken = jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  private mapUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
