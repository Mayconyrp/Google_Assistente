import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleApiModule } from './google-api/google-api.module';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [GoogleApiModule, TelegramBotModule],
  controllers: [AppController],
  providers: [AppService, TelegramBotService],
})
export class AppModule {}
