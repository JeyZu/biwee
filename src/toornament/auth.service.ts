import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ToornamentAuthService {
  private accessToken: string;
  private accessTokenExpires: Date;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async getAccessToken(): Promise<string> {
    // Check if the current token is still valid
    if (this.accessToken && new Date() < this.accessTokenExpires) {
        return this.accessToken;
    }
    console.log('i go there')

    // Retrieve new token
    const clientId = this.configService.get<string>("TOORNAMENT_CLIENT_ID");
    const clientSecret = this.configService.get<string>(
      "TOORNAMENT_CLIENT_SECRET"
    );
    const scope = this.configService.get<string>(
      "TOORNAMENT_SCOPE",
      "organizer:admin"
    );

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          "/oauth/v2/token",
          `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=${scope}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
      );

      this.accessToken = response.data.access_token;
      // Calculate the expiry time based on the current time and the expires_in duration
      this.accessTokenExpires = new Date(
        new Date().getTime() + response.data.expires_in * 1000
      );

      return this.accessToken;
    } catch (error) {
      // Handle or log the error appropriately
      console.error("Error fetching Toornament access token:", error);
      throw error;
    }
  }
}
