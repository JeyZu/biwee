import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config"; 
import { ToornamentService } from "./toornament.service";
import { ToornamentAuthService } from "./auth.service";
import { TOORNAMENT_BASE_URL } from "./toornament.constants";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ToornamentApiInterceptor } from "./toornament.interceptor";

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>(
          "TOORNAMENT_BASE_URL",
          TOORNAMENT_BASE_URL
        ),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
  ],
  providers: [
    ToornamentService,
    ToornamentAuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ToornamentApiInterceptor,
    },
  ],
  exports: [ToornamentService, ToornamentAuthService],
})
export class ToornamentModule {}
