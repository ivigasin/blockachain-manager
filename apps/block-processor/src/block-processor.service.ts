import { Block, Operator, Validator, Transaction } from '@app/common/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { readFile } from 'fs/promises';


interface SessionState {
  validators: Map<string, Validator>;
  operators: Map<number, Operator>;
  validatorIdCounter: number;
}

@Injectable()
export class BlockProcessorService {
  private readonly logger = new Logger(BlockProcessorService.name);
  private sessionStates: Map<string, SessionState> = new Map();
  private fileMutexes: Map<string, Mutex> = new Map();

  async processFile(filePath: string, fileName: string, session: string, blockId: number): Promise<void> {
    const fileMutex = this.fileMutexes.get(fileName) || new Mutex();
    this.fileMutexes.set(fileName, fileMutex);

    const release = await fileMutex.acquire();
    let sessionState = this.initializeSessionState(session);

    try {
      const content = await readFile(filePath + fileName, { encoding: 'utf-8' });
      const blocks: Block[] = JSON.parse(content).blocks;

      const chunkSize = 10;
      const chunks = this.chunkArray(blocks, chunkSize);

      await Promise.all(chunks.map(chunk => this.processChunk(chunk, sessionState, blockId)));

      this.logger.log(`Finished processing up to block ${blockId} from file ${fileName}.`);
    } catch (error) {
      this.logger.error(`Error processing file ${fileName}:`, error);
    } finally {
      release();
    }
  }

  private async processChunk(chunk: Block[], sessionState: SessionState, blockId: number): Promise<void> {
    for (const block of chunk) {
      if (block.id > blockId) break;
      for (const transaction of block.transactions) {
        if (transaction.register && transaction.register.length >= 3) {
          this.processTransaction(transaction, sessionState);
        }
      }
    }
  }

  private chunkArray(blocks: Block[], chunkSize: number): Block[][] {
    const chunks = [];
    for (let i = 0; i < blocks.length; i += chunkSize) {
      const chunk = blocks.slice(i, i + chunkSize);
      chunks.push(chunk);
    }
    return chunks;
  }


  private initializeSessionState(session: string): SessionState {
    let state = this.sessionStates.get(session);
    if (!state) {
      state = { validators: new Map(), operators: new Map(), validatorIdCounter: 0 };
      this.sessionStates.set(session, state);
    }
    return state;
  }

  private processTransaction(transaction: Transaction, sessionState: SessionState) {
    let validator = sessionState.validators.get(transaction.address);
    if (!validator) {
        validator = this.createValidator(transaction.address, sessionState);
        sessionState.validators.set(transaction.address, validator);
    }

    transaction.register?.forEach(operatorId => {
        let operator = sessionState.operators.get(operatorId);
        if (!operator) {
            operator = this.createOperator(operatorId, sessionState);
            sessionState.operators.set(operatorId, operator);
        }

        validator.operators.includes(operatorId) || validator.operators.push(operatorId);
        operator.validators.includes(validator.id) || operator.validators.push(validator.id);
    });
  }

  private createValidator(address: string, sessionState: SessionState): Validator {
    const validator: Validator = { id: sessionState.validatorIdCounter++, address, operators: [] };
    return validator;
  }

  private createOperator(id: number, sessionState: SessionState): Operator {
    const operator: Operator = { id, validators: [] };
    return operator;
  }

  public getStateBySession(session: string): { validators: Validator[]; operators: Operator[] } {
    const sessionState = this.sessionStates.get(session);
    if (!sessionState) {
      throw new Error(`Session ${session} not found.`);
    }

    const validators = Array.from(sessionState.validators.values());
    const operators = Array.from(sessionState.operators.values()).map(op => ({
        ...op,
        validators: Array.from(op.validators)
    }));


    this.sessionStates.delete(session);

    return { validators, operators };
  }
}
