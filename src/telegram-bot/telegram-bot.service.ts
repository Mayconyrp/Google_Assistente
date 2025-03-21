import { Injectable } from '@nestjs/common';
import { Action, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { HttpService } from '@nestjs/axios';
import { Eventos } from 'src/interfaces/event.interface';

@Injectable()
@Update()
export class TelegramBotService {
  constructor(private readonly httpService: HttpService) { }

  @Start()
  async startCommand(ctx: Context) {
    console.log('[Start] Command received:', ctx.text);

    await ctx.reply(`👋 Olá, ${ctx.message.from.first_name}!`);
    await ctx.reply('📌 Bem-vindo! Aqui você pode consultar eventos e acompanhar seus gastos.');

    await ctx.reply(
      '📅 Escolha uma das opções abaixo para visualizar eventos ou verificar seus gastos:',
      Markup.inlineKeyboard([
        [Markup.button.callback('📅 Eventos do Dia', 'eventos_dia')],
        [Markup.button.callback('📆 Eventos da Semana', 'eventos_semana')],
        [Markup.button.callback('📅 Eventos do Mês', 'eventos_mes')],
        [Markup.button.callback('💰 Resumo gasto do mês', 'gastos_mes')],
        [Markup.button.callback('📊 Relatório Financeiro', 'dados_financeiros')],
        [Markup.button.callback('📑 Consultar Resumo Financeiro', 'multiplas_abas')]
      ])
    );
  }

  @Hears('/menu')
  async menuCommand(ctx: Context) {
    console.log('[Menu] Command received:', ctx.text);

    await ctx.reply(
      '📌 Escolha uma opção abaixo para consultar eventos:',
      Markup.inlineKeyboard([
        [Markup.button.callback('📅 Eventos do Dia', 'eventos_dia')],
        [Markup.button.callback('📆 Eventos da Semana', 'eventos_semana')],
        [Markup.button.callback('📅 Eventos do Mês', 'eventos_mes')],
        [Markup.button.callback('💰 Resumo gasto do mês', 'gastos_mes')],
        [Markup.button.callback('📊 Relatório Financeiro', 'dados_financeiros')],
        [Markup.button.callback('📑 Consultar Resumo Financeiro', 'multiplas_abas')],
        [Markup.button.callback('❓ Ajuda', 'help_menu')]
      ])
    );
  }


  @Action('help_menu')
  async helpMenu(ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply(
      'ℹ️ Como posso te ajudar?\n\n' +
      '🔹 *Eventos do Dia:* Veja os eventos marcados para hoje.\n' +
      '🔹 *Eventos da Semana:* Consulte a agenda semanal.\n' +
      '🔹 *Eventos do Mês:* Tenha uma visão geral dos eventos do mês.\n\n' +
      'Caso tenha dúvidas, selecione uma opção acima ou envie um comando específico.',
      { parse_mode: 'Markdown' }
    );
  }

  @Action('menu')
  async menuAction(ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.reply(
      '📌 Olá! Como posso te ajudar hoje? Escolha uma opção abaixo para consultar eventos:',
      Markup.inlineKeyboard([
        [Markup.button.callback('📅 Eventos do Dia', 'eventos_dia')],
        [Markup.button.callback('📆 Eventos da Semana', 'eventos_semana')],
        [Markup.button.callback('📅 Eventos do Mês', 'eventos_mes')],
        [Markup.button.callback('💰 Resumo gasto do mês', 'gastos_mes')],
        [Markup.button.callback('📊 Relatório Financeiro', 'dados_financeiros')],
        [Markup.button.callback('📑 Consultar Resumo Financeiro', 'multiplas_abas')],
        [Markup.button.callback('❓ Preciso de Ajuda', 'help_menu')],
      ])
    );
  }

  @Action('eventos_dia')
  async findDia(ctx: Context) {
    this.httpService.axiosRef
      .get<Eventos[]>('http://localhost:8080/google-api/EventosDia')
      .then((result) => {
        console.log('Dados:', result.data);

        if (!result.data.length) {
          ctx.reply(
            '📭 Nenhum evento marcado para hoje.',
            Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
          );
        } else {
          const eventosFormatados = result.data
            .map((evento) =>
              `📅 *${evento.summary}*\n📍 Local: ${evento.location || 'Não informado'}\n🗓️ Data: ${evento.start} - ${evento.end}`
            )
            .join('\n\n');

          ctx.reply(
            `📆 Eventos de hoje:\n\n${eventosFormatados}`,
            {
              parse_mode: 'Markdown',
              ...Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
            }
          );
        }
      })
      .catch((error) => {
        console.log('Erro ao buscar eventos do dia:', error);
        ctx.reply(
          '⚠️ Ops! Não foi possível buscar os eventos de hoje.',
          Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
        );
      })
      .finally(() => {
        ctx.answerCbQuery();
      });
  }

  @Action('eventos_semana')
  async eventosSemana(ctx: Context) {
    this.httpService.axiosRef
      .get<Eventos[]>('http://localhost:8080/google-api/EventosSemana')
      .then((response) => {
        const events = response.data;

        if (!events.length) {
          ctx.reply(
            '📭 Nenhum evento marcado para esta semana.',
            Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
          );
          return;
        }

        const message = events.map((event) =>
          `📅 *${event.summary}*\n📍 Local: ${event.location || 'Não informado'}\n🗓️ De: ${event.start} até ${event.end}`
        ).join('\n\n');

        ctx.reply(
          `📆 Eventos desta semana:\n\n${message}`,
          {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
          }
        );
      })
      .catch(() => {
        ctx.reply(
          '⚠️ Ops! Não foi possível buscar os eventos da semana.',
          Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
        );
      })
      .finally(() => {
        ctx.answerCbQuery();
      });
  }

  @Action('eventos_mes')
  async eventosMes(ctx: Context) {
    this.httpService.axiosRef
      .get<Eventos[]>('http://localhost:8080/google-api/EventosMes')
      .then((response) => {
        const events = response.data;
        console.log(events);

        if (!events.length) {
          ctx.reply(
            '📭 Não há eventos marcados para este mês.',
            Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
          );
          return;
        }

        const message = events.map((event) =>
          `📅 *${event.summary}*\n🗓️ Início: ${event.start}\n🕛 Fim: ${event.end}\n📍 Local: ${event.location || 'Não informado'}`
        ).join('\n\n');

        ctx.reply(
          `📆 Eventos deste mês:\n\n${message}`,
          {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
          }
        );
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos do mês:', error);
        ctx.reply(
          '⚠️ Ops! Não foi possível buscar os eventos do mês.',
          Markup.inlineKeyboard([[Markup.button.callback('🏠 Menu Principal', 'menu')]])
        );
      })
      .finally(() => {
        ctx.answerCbQuery();
      });
  }

  @Action('gastos_mes')
  lerGastos(ctx: Context) {
    this.httpService.axiosRef
      .get("http://localhost:8080/google-api/LerPlanilha")
      .then((response) => {
        const leituraPlanilha = response.data;

        if (!leituraPlanilha || leituraPlanilha.length === 0) {
          ctx.reply(
            '📭 Nenhum gasto registrado para este mês. Parece que você está economizando bem! 😉',
            Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]])
          );
        } else {
          ctx.reply(
            `📊 *Gastos do mês:* \n\n${leituraPlanilha}\n\n💡 Lembre-se de acompanhar suas finanças regularmente!`,
            {
              parse_mode: 'Markdown',
              ...Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]])
            }
          );
        }
      })
      .catch(() => {
        ctx.reply(
          '⚠️ Ops! Não foi possível carregar os gastos do mês no momento. Por favor, tente novamente mais tarde.',
          Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]])
        );
      })
      .finally(() => {
        ctx.answerCbQuery();
      });
  }
  @Action('dados_financeiros')
  async consultarDadosFinanceiros(ctx: Context) {
    this.httpService.axiosRef
      .get('http://localhost:8080/google-api/financeiro')
      .then((response) => {
        const dados = response.data;
        const mensagem = `💰 *Resumo Financeiro:*

` +
          `📊 *Total de Gastos:* R$ ${dados.totalGastos}
` +
          `📈 *Média Trimestral:* R$ ${dados.mediaTrimestral}
` +
          `📅 *Maior Gasto:* ${dados.maiorGastoMensal.mes} - R$ ${dados.maiorGastoMensal.total}
` +
          `📅 *Menor Gasto:* ${dados.menorGastoMensal.mes} - R$ ${dados.menorGastoMensal.total}

` +
          `💸 *Compra Mais Cara:* ${dados.compraMaisCara.produto} (R$ ${dados.compraMaisCara.valor}) em ${dados.compraMaisCara.mes}
` +
          `🛒 *Compra Mais Barata:* ${dados.compraMaisBarata.produto} (R$ ${dados.compraMaisBarata.valor}) em ${dados.compraMaisBarata.mes}

` +
          `📦 *Produtos Mais Comprados:*
` +
          dados.produtosMaisComprados.map(p => `🔹 ${p.produto}: ${p.quantidade}x`).join('\n');

        ctx.reply(mensagem,Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]]))        ;
        
        
      })
      .catch(() => {
        ctx.reply(
          '⚠️ Ops! Não foi possível carregar os Relatório Financeiro no momento. Por favor, tente novamente mais tarde.',
          Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]])
        );
      })
      .finally(() => {
        ctx.answerCbQuery();
      });
  }
  @Action('multiplas_abas')
  async lerMultiplasAbas(ctx: Context) {
    this.httpService.axiosRef
      .get('http://localhost:8080/google-api/LerMultiplasAbas')
      .then((response) => {
        const dados = response.data;

        if (!dados || Object.keys(dados).length === 0) {
          ctx.reply(
            '📭 Nenhum dado encontrado nas abas da planilha.',
            Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]])
          );
          return;
        }

        let mensagem = '📊 *Resumo Financeiro por Mês:*\n\n';
        for (const mes in dados) {
          const total = dados[mes]?.[0]?.[1] ?? 'N/A';
          mensagem += `📅 *${mes}:* R$ ${total}\n`;
        }

        ctx.reply(mensagem, {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]])
        });
      })
      .catch(() => {
        ctx.reply(
          '⚠️ Ops! Não foi possível carregar os Relatório Financeiro no momento.',
          Markup.inlineKeyboard([[Markup.button.callback('🏠 Voltar ao Menu', 'menu')]])
        );
      })
      .finally(() => {
        ctx.answerCbQuery();
      });
  }

}
