import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { ToornamentModule } from 'src/toornament/toornament.module';

import { PlayCommand } from './commands/play.command';
import { PlaylistCommand } from './commands/playlist.command';

@Module({
  imports: [DiscordModule.forFeature(), ToornamentModule],
  providers: [PlayCommand, PlaylistCommand],
})
export class BotModule {}
