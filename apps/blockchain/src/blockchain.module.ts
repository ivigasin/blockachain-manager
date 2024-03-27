import { Module } from '@nestjs/common';
import { BlockchainController } from './blockchain.controller';
import { BlockchainService } from './blockchain.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [BlockchainModule,
    ClientsModule.registerAsync([
      {
        name: 'BLOCK_PROCESSOR',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: 'block-processor',
            port: 9001,
          },
        }),
      },
    ]),
  ],
  controllers: [BlockchainController],
  providers: [BlockchainService],
})
export class BlockchainModule {}
