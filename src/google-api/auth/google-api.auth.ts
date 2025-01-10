import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuth {
    
    private oauth2Client: any;

    constructor(private readonly configService: ConfigService) {
      const clientId = this.configService.get<string>('CLIENT_ID');
      const clientSecret = this.configService.get<string>('SECRET_ID');
      const redirectUri = this.configService.get<string>('REDIRECT');  // Certifique-se de usar http://localhost:8080/redirect
  
      // Instanciando o OAuth2Client
      this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      
    }
  
    /**
     * Gera a URL para o usuário fazer login e autorizar o acesso ao Google Calendar e Google Sheets.
     */
    generateAuthUrl(): string {
      return this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      });
    }
  
    /**
     * Troca o código de autorização pelo token de acesso.
     * @param code Código de autorização obtido do Google.
     */
    async getAccessToken(code: string): Promise<any> {
      const { tokens } = await this.oauth2Client.getToken(code);
  
      // Log do token para debug
      console.log('Access Token:', tokens);
  
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    }
  
    getOAuth2Client() {
      return this.oauth2Client;
    }
  
  
}
