import { WsAuthGuard } from './ws-auth/ws-auth.guard';

describe('WsAuthGuard', () => {
  it('should be defined', () => {
    expect(new WsAuthGuard()).toBeDefined();
  });
});
