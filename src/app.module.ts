import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizeModule } from './authorize/authorize.module';

@Module({
  imports: [AuthorizeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
