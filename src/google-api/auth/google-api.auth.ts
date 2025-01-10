import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuth implements OnModuleInit {
  private oauth2Client: any;
  private readonly logger = new Logger(GoogleAuth.name);

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('SECRET_ID');
    const redirectUri = this.configService.get<string>('REDIRECT'); // Certifique-se de usar a URL correta

    // Instanciando o OAuth2Client
    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  /**
   * Valida o token ao iniciar o sistema e configura o cliente OAuth2.
   */
  async onModuleInit() {
    const accessToken = this.configService.get<string>('ACCESS_TOKEN');

    if (!accessToken) {
      this.logger.error('ACCESS_TOKEN não encontrado. Configure-o no arquivo .env.');
      return;
    }

    try {
      // Configurando o token inicial
      this.oauth2Client.setCredentials({ access_token: accessToken });

      // Validando o token
      await this.validateToken();
      this.logger.log('Token válido e configurado com sucesso.');
    } catch (error) {
      this.logger.error(
        'Token inválido ou expirado. Atualize o ACCESS_TOKEN no arquivo .env.',
        error.message
      );
    }
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
    this.logger.log('Novo Access Token obtido:', tokens);

    this.oauth2Client.setCredentials(tokens);

    // Salve o token em uma variável de ambiente ou banco de dados
    // Aqui seria um ponto de persistência (ex.: arquivo ou DB)

    return tokens;
  }

  /**
   * Valida se o token atual é válido.
   */
  private async validateToken() {
    const tokenInfo = await this.oauth2Client.getTokenInfo(
      this.oauth2Client.credentials.access_token
    );

    this.logger.log(`Token válido para os escopos: ${tokenInfo.scope}`);
  }

  /**
   * Retorna o cliente OAuth2 configurado.
   */
  getOAuth2Client() {
    return this.oauth2Client;
  }
}
