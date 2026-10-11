import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  testRoute() {
    return 'Hi, iam Urban Tasker API';
  }
}
