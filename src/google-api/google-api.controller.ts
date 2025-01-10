import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express'; // Certifique-se de que está importando o Response do Express
import { GoogleApiService } from './google-api.service';
import { calendar_v3 } from 'googleapis'; // Certifique-se de importar o tipo de evento

@Controller('google-api')
export class GoogleApiController {
    constructor(private readonly googleapiService: GoogleApiService) { }

    @Get('EventosDia')
    async ExibirEventosDia(@Res()res: Response): Promise<void> {
        this.googleapiService.getEventsOfDay() // Chama o serviço para obter eventos do dia
            .then((events) => {
                if (events.length === 0) {
                    return res.status(200).send('Não há eventos marcados para hoje');
                }
                return res.status(200).json(events);
            })
            .catch((error) => {
                console.error('Erro ao exibir eventos do dia:', error.message);
                return res.status(500).send('Erro ao tentar obter os eventos');
            });
    }
    @Get('EventosSemana')
    async ExibirEventosSemana(@Res()res: Response): Promise<void> {
        this.googleapiService.getEventsOfWeek() // Chama o serviço para obter eventos da semana
            .then((events) => {
                if (events.length === 0) {
                    return res.status(200).send('Não há eventos marcados para esta semana');
                }
                return res.status(200).json(events);
            })
            .catch((error) => {
                console.error('Erro ao exibir eventos da semana:', error.message);
                return res.status(500).send('Erro ao tentar obter os eventos');
            });
    }

    @Get('EventosMes')
    async ExibirEventosMes(@Res() res: Response): Promise<void> {
        this.googleapiService.getEventsOfMonth()
            .then((events) => {
                if (events.length === 0) {
                    return res.status(200).send('Não há eventos marcados para este mês');
                }
                return res.status(200).json(events);
            })
            .catch((error) => {
                console.error('Erro ao exibir eventos do mês:', error.message);
                return res.status(500).send('Erro ao tentar obter os eventos');
            });
    }
}
