import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { CustomHttpService } from "./http-module.service";

@Injectable()
export class ToornamentService {
  constructor(private httpService: CustomHttpService) {}

  async getAllTournaments(queryDto?: any): Promise<any[]> {
    try {
      const response = await this.httpService.get<any[]>(
        "/organizer/v2/tournaments",
        {
          headers: {
            Range: "tournaments=0-49",
          },
        },
        "organize:view"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tournaments from Toornament:", error);
      throw error;
    }
  }
}
