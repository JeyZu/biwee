// src/toornament/toornament-auth.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { of } from "rxjs";
import { ToornamentAuthService } from "./auth.service";

describe("ToornamentAuthService", () => {
  let service: ToornamentAuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [ToornamentAuthService],
    }).compile();

    service = module.get<ToornamentAuthService>(ToornamentAuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });


  it("should retrieve a new access token", async () => {
    const mockResponse = {
      data: {
        access_token: "test_token",
        expires_in: 90000,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        url: "https://api.toornament.com/oauth/v2/token",
        method: "post",
        headers: {},
      }, // Mock config
    };

    jest
      .spyOn(httpService, "post")
      .mockImplementation(() => of(mockResponse as any));
    const token = await service.getAccessToken();
    expect(token).toEqual("test_token");
  });

  // Additional tests can be written here
});
