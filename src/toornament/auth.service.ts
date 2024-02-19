// toornament-auth.service.ts
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { TokenStore } from "./token.store";
@Injectable()
export class ToornamentAuthService {
  private tokenStore = new TokenStore(); 

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getAccessToken(scope: string): Promise<string> {
    let token = this.tokenStore.getToken(scope);
    if (token) {
      return token;
    }

    const clientId = this.configService.get<string>("TOORNAMENT_CLIENT_ID");
    const clientSecret = this.configService.get<string>(
      "TOORNAMENT_CLIENT_SECRET"
    );

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          "/oauth/v2/token",
          `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=${scope}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              skipInterceptor: true,
              "X-Custom-Scope": scope
            },
          }
        )
      );

      const newToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      this.tokenStore.setToken(scope, newToken, expiresIn);

      return newToken;
    } catch (error) {
      console.error("Error fetching Toornament access token:", error);
      throw error;
    }
  }
}
