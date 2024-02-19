import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ToornamentAuthService } from "./auth.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CustomHttpService {
  private apiKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: ToornamentAuthService,
    private configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>("TOORNAMENT_API_KEY");
    this.initializeRequestInterceptor();
  }

  private initializeRequestInterceptor() {
    this.httpService.axiosRef.interceptors.request.use(
      async (config: any) => {

        if (!config.headers["skipInterceptor"]) {
          try {
            let scope: string =
              config.headers["X-Custom-Scope"] || "default_scope";
            delete config.headers["X-Custom-Scope"]; // Clean up custom header

            config.metadata = { scope };

            const token = await this.authService.getAccessToken(scope);
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["X-Api-Key"] = this.apiKey;  
          } catch (error) {
            // Handle error
          }
        } else {
          // Remove the custom header so it doesn't get sent to the server
          delete config.headers["skipInterceptor"];
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.httpService.axiosRef.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          // Check if a refresh has already been attempted
          if (!error.config._retry) {
            error.config._retry = true;
            try {
              const scope = error.config.metadata;

              const token = await this.authService.getAccessToken(scope);
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.httpService.axiosRef.request(error.config);
            } catch (err) {
              return Promise.reject(err);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(
    url: string,
    config: AxiosRequestConfig = {},
    scope?: string
  ): Promise<AxiosResponse<T>> {
    config.headers["X-Custom-Scope"] = scope;
    return firstValueFrom(this.httpService.get<T>(url, config));
  }
}
