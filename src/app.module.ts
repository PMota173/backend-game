import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes the configuration available globally
        }),
        GameModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
