import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {v4 as uuidv4} from 'uuid';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { constants } from 'buffer';


@Controller('state')
export class BlockchainController {
  constructor(@Inject('BLOCK_PROCESSOR') private client: ClientProxy) {}


  
  @Get()
  async getState(@Query('fileName') fileName: string, @Query('blockNumber')   blockNumber: string) {
    const blockId = parseInt(blockNumber);
    const session = uuidv4();
     
    await this.client.send({ cmd: 'process_blocks' }, { fileName, session, blockId }).toPromise();
    const response$ = await this.client.send({ cmd: 'get-file-state' }, { fileName, session }).toPromise();
   
    return response$;

  }
}
