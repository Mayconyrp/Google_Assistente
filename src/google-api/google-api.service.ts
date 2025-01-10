import { Injectable } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { GoogleAuth } from './auth/google-api.auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleApiService {
  private calendar: calendar_v3.Calendar;

  constructor(
    private readonly googleAuth: GoogleAuth,
    private readonly configService: ConfigService
  ) {
    const oauth2Client = this.googleAuth.getOAuth2Client();
    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  // Método genérico para buscar eventos com base em um intervalo de tempo
  async getEventsByTimeRange(startTime: string, endTime: string): Promise<any[]> {
    return this.calendar.events.list({
      calendarId: 'primary',
      timeMin: startTime, // Início do intervalo
      timeMax: endTime, // Fim do intervalo
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    })
      .then((response) => {
        // Filtra os dados para retornar apenas os campos essenciais
        return response.data.items?.map(event => ({
          summary: event.summary, // Título do evento
          start: this.formatDate(event.start.dateTime || event.start.date), // Formata a data de início
          end: this.formatDate(event.end.dateTime || event.end.date), // Formata a data de término
          location: event.location,
        })) || [];
      })
      .catch((error) => {
        console.error('Erro ao obter eventos:', error.message);
        throw error;
      });
  }

  // Método para formatar a data para o padrão pt-BR (dd/mm/yyyy)
  private formatDate(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR'); // Formata a data para o formato brasileiro
  }

  // Método para obter eventos do dia
  async getEventsOfDay(): Promise<any[]> {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString(); // Início do dia
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // Fim do dia
    return this.getEventsByTimeRange(startOfDay, endOfDay);
  }

  // Método para obter eventos da semana
  async getEventsOfWeek(): Promise<any[]> {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString(); // Início da semana
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6)).toISOString(); // Fim da semana
    return this.getEventsByTimeRange(startOfWeek, endOfWeek);
  }

  // Método para obter eventos do mês
  async getEventsOfMonth(): Promise<any[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString(); // Início do mês
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(); // Fim do mês
    return this.getEventsByTimeRange(startOfMonth, endOfMonth);
  }
}
