import { NestFactory } from '@nestjs/core';
import { BlockchainModule } from './blockchain.module';

async function bootstrap() {
  const app = await NestFactory.create(BlockchainModule);
  await app.listen(9999);
}
bootstrap();
