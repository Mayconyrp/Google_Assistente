import { Controller, Get, Post ,Body,HttpCode, HttpStatus, Param } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { ApiOperation,ApiResponse } from '@nestjs/swagger';

@Controller('google-api')
export class GoogleApiController {
    constructor(private readonly googleApiService: GoogleApiService) { }

    @HttpCode(HttpStatus.OK)
    @Get('EventosDia')
    ExibirEventosDia() {
        return this.googleApiService.buscarEventosDoDia()
    }

    @HttpCode(HttpStatus.OK)
    @Get('EventosSemana')
    async ExibirEventosSemana() {
        return await this.googleApiService.buscarEventosDaSemana()
    }

    @HttpCode(HttpStatus.OK)
    @Get('EventosMes')
    async ExibirEventosMes() {
        return await this.googleApiService.buscarEventosDoMes()
    }

    @HttpCode(HttpStatus.OK)
    @Get('LerPlanilha')
    async LerPlanilha () {
        return await this.googleApiService.lerDadosDaPlanilha()
    }

  @HttpCode(HttpStatus.OK)
    @Get('LerMultiplasAbas')
    async LerMultiplasAbas() {
        return await this.googleApiService.lerDadosDeMultiplasAbas();
    }
    @HttpCode(HttpStatus.OK)
    
    @Get('financeiro')
    async gerarRelatorioFinanceiro() {
      return await this.googleApiService.gerarRelatorioFinanceiro();
    }
  }