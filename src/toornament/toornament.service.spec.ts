// src/toornament/toornament.module.spec.ts

import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { ToornamentModule } from "./toornament.module";
import { ToornamentAuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("ToornamentModule", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [ToornamentAuthService],
    }).compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });
});
