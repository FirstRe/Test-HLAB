import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './common/prisma/prisma.service'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [ServicesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
