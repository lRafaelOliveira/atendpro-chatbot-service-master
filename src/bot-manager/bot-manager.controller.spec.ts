import { Test, TestingModule } from '@nestjs/testing';
import { BotManagerController } from './bot-manager.controller';

describe('BotManagerController', () => {
  let controller: BotManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotManagerController],
    }).compile();

    controller = module.get<BotManagerController>(BotManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
