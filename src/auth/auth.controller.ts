import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: { email: string; password: string; full_name: string; username: string }) {
    const { email, password, full_name, username } = body;
    return this.authService.register(email, password, full_name, username);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Déconnecté' };
  }

  @Get('me')
  async getMe(@Req() req) {
    const user = await this.authService.findUserById(req.user.sub);
    return { user };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Cette route déclenche l'authentification Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { token, user } = req.user;
    // Rediriger vers le frontend avec le token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }

  @Public()
  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  appleAuth() {
    // Cette route déclenche l'authentification Apple
  }

  @Public()
  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleAuthCallback(@Req() req, @Res() res: Response) {
    const { token, user } = req.user;
    // Rediriger vers le frontend avec le token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
}
