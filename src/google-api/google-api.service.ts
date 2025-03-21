import { Injectable } from '@nestjs/common';
import { google, calendar_v3, sheets_v4 } from 'googleapis';
import { GoogleAuth } from './auth/google-api.auth';
import { ConfigService } from '@nestjs/config';
import { Eventos } from '../interfaces/event.interface';

@Injectable()
export class GoogleApiService {
  private calendar: calendar_v3.Calendar;
  private sheets: sheets_v4.Sheets;


  private formatarData(data: string): string {
    const dateObj = new Date(data);
    return dateObj.toLocaleDateString('pt-BR');
  } 

  constructor(
    private readonly googleAuth: GoogleAuth,
    private readonly configService: ConfigService
  ) {
    const oauth2Client = this.googleAuth.getOAuth2Client();
    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    this.sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  }


  async enviarEvento(evento: Eventos): Promise<calendar_v3.Schema$Event> {
    const novoEvento: calendar_v3.Schema$Event = {
      summary: evento.summary,
      description: evento.description,
      location: evento.location,
      start: {
        dateTime: evento.startDateTime, 
        timeZone: 'America/Sao_Paulo', 
      },
      end: {
        dateTime: evento.endDateTime,   
        timeZone: 'America/Sao_Paulo',
      },
    };
    return this.calendar.events.insert({
      calendarId: 'primary', 
      requestBody: novoEvento,
    })
      .then((response) => {
        console.log('Evento criado:', response.data);
        return response.data; // Retorna o evento criado
      })
      .catch((error) => {
        console.error('Erro ao criar evento:', error.message);
        throw error;
      });
  }
      
  async buscarEventosPorIntervalo(inicioIntervalo: string, fimIntervalo: string): Promise<Eventos[]> {
    console.log('Buscando eventos de:', inicioIntervalo, 'até:', fimIntervalo);
    return await this.calendar.events.list({
      calendarId: 'primary',
      timeMin: inicioIntervalo,
      timeMax: fimIntervalo,
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    })
      .then((response) => {
        const eventos: Eventos[] = (response.data.items?.map(event => ({
          summary: event.summary, 
          start: this.formatarData(event.start.dateTime || event.start.date), 
          end: this.formatarData(event.end.dateTime || event.end.date),
          location: event.location || null, 
        })) || []);

        console.log('Eventos encontrados:', eventos);
        return eventos;
      })
      .catch((error) => {
        console.error('Erro ao obter eventos:', error.message);
        throw error;
      });
  }
  buscarEventosDoDia(): Promise<Eventos[]> {
    const agora = new Date();
    const inicioDoDia = new Date(agora.setHours(0, 0, 0, 0)).toISOString(); // Início do dia
    const fimDoDia = new Date(agora.setHours(23, 59, 59, 999)).toISOString(); // Fim do dia
    console.log('Buscando eventos do dia...');

    return this.buscarEventosPorIntervalo(inicioDoDia, fimDoDia);
  }

  buscarEventosDaSemana(): Promise<Eventos[]> {
    const agora = new Date();
    const inicioDaSemana = new Date(agora.setDate(agora.getDate() - agora.getDay())).toISOString(); // Início da semana
    const fimDaSemana = new Date(agora.setDate(agora.getDate() - agora.getDay() + 6)).toISOString(); // Fim da semana
    console.log('Buscando eventos da semana...');

    return this.buscarEventosPorIntervalo(inicioDaSemana, fimDaSemana);
  }

  buscarEventosDoMes(): Promise<Eventos[]> {
    const agora = new Date();
    const inicioDoMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString(); // Início do mês
    const fimDoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).toISOString(); // Fim do mês
    console.log('Buscando eventos do mês...');

    return this.buscarEventosPorIntervalo(inicioDoMes, fimDoMes);
  }

async lerDadosDaPlanilha(): Promise<any[][]> {
  const sheetId = 'SEU_SHEET_ID';
  const range = 'Atual!I11:J11';

  console.log(`Lendo dados da planilha: ${sheetId}, intervalo: ${range}`);

  return await this.sheets.spreadsheets.values
    .get({
      spreadsheetId: sheetId,
      range: range,
    })
    .then((response) => {
      const valores = response.data.values || [];
      console.log('Dados encontrados:', valores);
      return valores;
    })
    .catch((error) => {
      console.error('Erro ao ler dados da planilha:', error.message);
      throw error;
    });
}
async lerDadosDeMultiplasAbas(): Promise<{ [key: string]: any[][] }> {
  const sheetId = 'SEU_SHEET_ID'; 
  const abas = [
    { nome: 'Janeiro', range: 'I11:J11' },
    { nome: 'Fevereiro', range: 'I11:J11' },
    { nome: 'Março', range: 'I11:J11' },
  ];
  console.log('🔄 Iniciando leitura de múltiplas abas na mesma planilha...');

  const resultados: { [key: string]: any[][] } = {};

  for (const aba of abas) {
    const rangeCompleto = `${aba.nome}!${aba.range}`;
    console.log(`📖 Lendo dados da aba: ${aba.nome}, intervalo: ${aba.range}`);

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: rangeCompleto,
      });

      const valores = response.data.values || [];
      console.log(`✅ Dados encontrados na aba ${aba.nome}:`, valores);

      resultados[aba.nome] = valores;
    } catch (error) {
      console.error(`❌ Erro ao ler a aba ${aba.nome}:`, error.message);
      resultados[aba.nome] = [];
    }
  }

  return resultados;
}
async gerarRelatorioFinanceiro(): Promise<any> {
  const sheetId = 'SEU_SHEET_ID';
  const meses = ['Janeiro', 'Fevereiro', 'Março']; 
  const rangeBase = '!A:B'; // Coluna A (Produto) e B (Preço)

  console.log('📊 Gerando relatório financeiro...');

  let compras: { mes: string; produto: string; valor: number }[] = [];

  // Lendo dados de cada aba (mês)
  for (const mes of meses) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${mes}${rangeBase}`,
      });

      const dados = response.data.values || [];

      dados.forEach(row => {
        const produto = row[0]?.trim();
        const valor = parseFloat(row[1]) || 0;
        if (produto && valor) {
          compras.push({ mes, produto, valor });
        }
      });
    } catch (error) {
      console.error(`❌ Erro ao ler a aba ${mes}:`, error.message);
    }
  }

  if (compras.length === 0) {
    console.warn('⚠️ Nenhum dado encontrado para o relatório.');
    return { message: 'Nenhum dado disponível.' };
  }

  // Total gasto por mês
  const totalPorMes = meses.map(mes => ({
    mes,
    total: compras
      .filter(c => c.mes === mes)
      .reduce((sum, item) => sum + item.valor, 0),
  }));

  // Média trimestral
  const totalGastos = totalPorMes.reduce((sum, item) => sum + item.total, 0);
  const mediaTrimestral = totalGastos / meses.length;

  // Compra mais cara e mais barata
  const compraMaisCara = compras.reduce((max, item) => (item.valor > max.valor ? item : max), compras[0]);
  const compraMaisBarata = compras.reduce((min, item) => (item.valor < min.valor ? item : min), compras[0]);

  const contagemProdutos = compras.reduce((acc, item) => {
    acc[item.produto] = (acc[item.produto] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const produtosMaisComprados = Object.entries(contagemProdutos)
    .map(([produto, quantidade]) => ({ produto, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 3);

  const maiorGastoMensal = totalPorMes.reduce((max, mes) => (mes.total > max.total ? mes : max), totalPorMes[0]);
  const menorGastoMensal = totalPorMes.reduce((min, mes) => (mes.total < min.total ? mes : min), totalPorMes[0]);

  console.log('📌 Resumo do Relatório Financeiro:');
  console.log(`💰 Total Gasto: R$ ${totalGastos.toFixed(2)}`);
  console.log(`📊 Média Trimestral: R$ ${mediaTrimestral.toFixed(2)}`);
  console.log(`📉 Maior Gasto Mensal: ${maiorGastoMensal.mes} - R$ ${maiorGastoMensal.total.toFixed(2)}`);
  console.log(`📈 Menor Gasto Mensal: ${menorGastoMensal.mes} - R$ ${menorGastoMensal.total.toFixed(2)}`);
  
  console.log(`🏆 Compra Mais Cara: ${compraMaisCara.produto} - R$ ${compraMaisCara.valor.toFixed(2)} (${compraMaisCara.mes})`);
  console.log(`🎯 Compra Mais Barata: ${compraMaisBarata.produto} - R$ ${compraMaisBarata.valor.toFixed(2)} (${compraMaisBarata.mes})`);

  console.log('🛍️ Top 3 Produtos Mais Comprados:');
  produtosMaisComprados.forEach((p, i) =>
    console.log(`  ${i + 1}. ${p.produto} - ${p.quantidade}x`));

  return {
    totalGastos: totalGastos.toFixed(2),
    mediaTrimestral: mediaTrimestral.toFixed(2),
    maiorGastoMensal,
    menorGastoMensal,
    compraMaisCara,
    compraMaisBarata,
    produtosMaisComprados,
  };
}
}