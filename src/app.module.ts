import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TaskerApplicationsModule } from './modules/tasker-applications/tasker-applications.module';

@Module({
  imports: [AuthModule, UsersModule, CategoriesModule, TaskerApplicationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
