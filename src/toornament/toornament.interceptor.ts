import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ChatInputCommandInteraction } from "discord.js";
import { Observable, throwError, from } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { ToornamentAuthService } from "./auth.service";

@Injectable()
export class ToornamentApiInterceptor implements NestInterceptor {
  private apiKey: string;

  constructor(
    private authService: ToornamentAuthService,
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>("TOORNAMENT_TOKEN");
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap((token) => {
        const request = context.switchToHttp().getRequest();
        if (request instanceof ChatInputCommandInteraction)
          return next.handle();   
        request.headers["Authorization"] = `Bearer ${token}`;
        request.headers["X-Api-Key"] = this.apiKey;
        return next.handle();
      }),
      catchError((error) => {
        if (error.response && error.response.status === 401) {
          // Handle 401 error by refreshing the token
          return this.handleUnauthorizedError(context, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap((token) => {
        const request = context.switchToHttp().getRequest();
        request.headers.authorization = `Bearer ${token}`;
        return next.handle();
      }),
      catchError((err) => throwError(() => err))
    );
  }
}
