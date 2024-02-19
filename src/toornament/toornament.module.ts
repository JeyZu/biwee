import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config"; 
import { ToornamentService } from "./tournament.service";
import { ToornamentAuthService } from "./auth.service";
import { TOORNAMENT_BASE_URL } from "./toornament.constants";
import { CustomHttpService } from "./http-module.service";

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
  providers: [ToornamentService, ToornamentAuthService, CustomHttpService],
  exports: [ToornamentService, ToornamentAuthService, CustomHttpService],
})
export class ToornamentModule {}
