import { NestFactory } from '@nestjs/core';
import { BlockProcessorModule } from './block-processor.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlockProcessorModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'block-processor',
        port: 9001,
      },
    },
  );
  await app.listen();
}
bootstrap();
