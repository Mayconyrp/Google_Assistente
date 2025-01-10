import { Injectable } from '@nestjs/common';
import { Action, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import axios from 'axios';

@Injectable()
@Update()
export class TelegramBotService {

  // Método para pegar os eventos do dia
  @Action('eventos_dia')
  eventosDia(ctx: Context) {
    axios.get('http://localhost:8080/google-api/EventosDia')
      .then((response) => {
        const events = response.data;

        if (events.length === 0) {
          ctx.reply('Não há eventos marcados para hoje.');
        } else {
          const message = events.map((event: any) => {
            // Verifica se o evento tem hora
            const start = event.start.dateTime || event.start.date;
            const formattedDate = new Date(start).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            return `Evento: ${event.summary}\nData: ${formattedDate}\n\n`;
          }).join('');
          ctx.reply(`Eventos do dia:\n\n${message}`);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos do dia:', error);
        ctx.reply('Erro ao tentar buscar eventos do dia.');
      })
      .finally(() => {
        ctx.answerCbQuery(); // Para encerrar o callback
      });
  }

  // Método para pegar os eventos da semana
  @Action('eventos_semana')
  eventosSemana(ctx: Context) {
    axios.get('http://localhost:8080/google-api/EventosSemana')
      .then((response) => {
        const events = response.data;

        if (events.length === 0) {
          ctx.reply('Não há eventos marcados para esta semana.');
        } else {
          const message = events.map((event: any) => {
            // Verifica se o evento tem hora
            const start = event.start.dateTime || event.start.date;
            const formattedDate = new Date(start).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            return `Evento: ${event.summary}\nData: ${formattedDate}\n\n`;
          }).join('');
          ctx.reply(`Eventos da semana:\n\n${message}`);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos da semana:', error);
        ctx.reply('Erro ao tentar buscar eventos da semana.');
      })
      .finally(() => {
        ctx.answerCbQuery(); // Para encerrar o callback
      });
  }

  //Método para pegar os eventos do mês
  @Action('eventos_mes')
  eventosMes(ctx: Context) {
    axios.get('http://localhost:8080/google-api/EventosMes')
      .then((response) => {
        const events = response.data;
        console.log(events);
  
        if (events.length === 0) {
          ctx.reply('Não há eventos marcados para este mês.');
        } else {
          // Iterar sobre o array de eventos para exibir cada evento individualmente
          const message = events.map((event: any) => {
            // Apenas utiliza a formatação já realizada no serviço
            const Inicio = event.start; // Já foi formatado no serviço
            const Fim = event.end; // Já foi formatado no serviço
  
            return `Nome: ${event.summary}\nInício: ${Inicio}\nFim: ${Fim}\nLocalização: ${event.location || 'Não informada'}\n\n`;
          }).join('');
          
          // Envia a resposta para o Telegram
          ctx.reply(`Eventos deste mês:\n\n${message}`);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos do mês:', error);
        ctx.reply('Erro ao tentar buscar eventos do mês.');
      })
      .finally(() => {
        ctx.answerCbQuery(); // Para encerrar o callback
      });
  }
  
  // Comando inicial
  @Start()
  async startCommand(ctx: Context) {
    console.log('[Start] Command received:', ctx.text);
    await ctx.reply("Olá, " + ctx.message.from.first_name);
    await ctx.reply('Bem-vindo! Escolha uma das opções abaixo para consultar eventos.');
    await ctx.reply(
      'Você pode consultar os eventos por dia, semana ou mês. Selecione uma das opções abaixo:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Eventos do Dia', 'eventos_dia')],
        [Markup.button.callback('Eventos da Semana', 'eventos_semana')],
        [Markup.button.callback('Eventos do Mês', 'eventos_mes')]
      ])
    );
  }

  // Comando do menu
  @Hears('/menu')
  async menuCommand(ctx: Context) {
    console.log('[Menu] Command received:', ctx.text);
    await ctx.reply(
      'Escolha uma opção abaixo para consultar eventos:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Eventos do Dia', 'eventos_dia')],
        [Markup.button.callback('Eventos da Semana', 'eventos_semana')],
        [Markup.button.callback('Eventos do Mês', 'eventos_mes')],
        [Markup.button.callback('Ajuda', 'help_menu')]
      ])
    );
  }

  // Comando de ajuda
  @Action('help_menu')
  async helpMenu(ctx: Context) {
    await ctx.reply('Aqui estão as opções para você consultar os eventos. Escolha uma das opções para começar.');
    await ctx.answerCbQuery(); // Para encerrar o callback sem erro
  }
}
