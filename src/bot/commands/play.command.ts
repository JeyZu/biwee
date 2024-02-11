import { SlashCommandPipe } from '@discord-nestjs/common';
import {
  Command,
  EventParams,
  Handler,
  InteractionEvent,
} from '@discord-nestjs/core';
import { ClientEvents } from 'discord.js';
import { catchError, from, map, Observable } from 'rxjs';
import { ToornamentAuthService } from 'src/toornament/auth.service';

import { PlayDto } from '../dto/play.dto';

@Command({
  name: 'play',
  description: 'Plays a song',
})
export class PlayCommand {

  constructor(private authService: ToornamentAuthService) {}

  @Handler()
  onPlayCommand(
    @InteractionEvent(SlashCommandPipe) dto: PlayDto,
    @EventParams() args: ClientEvents['interactionCreate'],
  ): Observable<string> {
    // Convert the promise to an observable
    const accessTokenObservable = from(this.authService.getAccessToken());

    // Subscribe to the observable
    return accessTokenObservable.pipe(
      map((accessToken) => {
        return `Start playing ${dto.song}. Access Token: ${accessToken}`;
      }),
      catchError((error) => {
        console.error("Error getting access token:", error);
        return `An error occurred while getting the access token: ${error.message}`;
      })
    );
  }
}
