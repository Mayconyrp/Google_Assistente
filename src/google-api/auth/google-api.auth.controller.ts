import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuth } from './google-api.auth';

@Controller('')
export class GoogleAuthController {

    constructor(private readonly googleAuth: GoogleAuth) {}
  
    @Get()
    generateAuthUrl(@Res() res: Response): void {
      const authUrl = this.googleAuth.generateAuthUrl();
      res.redirect(authUrl);
    }
  
    @Get('redirect')
    async handleRedirect(@Query('code') code: string, @Res() res: Response): Promise<void> {
      this.googleAuth.getAccessToken(code)
        .then((tokens) => {
          res.send('Sucesso');
        })
        .catch((error) => {
          console.error('Erro ao trocar o código:', error);
          res.status(500).send('Erro ao trocar o código de autorização.');
        });
    }
    
}