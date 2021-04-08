import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {PageEvent} from "@angular/material/paginator";

import {Song} from '../song.model';
import {SongsService} from '../songs.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-favoriteSongs-list',
  templateUrl: './favoriteSongs-list.component.html',
  styleUrls: ['./favoriteSongs-list.component.css']
})
export class FavoriteSongsListComponent implements OnInit, OnDestroy {
  favoriteSongs: Song[]  = [];
  isLoading = false;
  private songsSub: Subscription;

  constructor(public songsService: SongsService) {}

  ngOnInit() {
    this.isLoading=true;
    this.songsService.getFavoriteSongs();
    this.songsSub = this.songsService.getFavoriteSongUpdateListener()
    .subscribe((songs: Song[]) => {
      this.isLoading=false;
      this.favoriteSongs=songs;
    });

  }

  ngOnDestroy() {
    this.songsSub.unsubscribe();
  }

  onDelete(songId: string){
    this.isLoading = true;
    this.songsService.deleteFavoriteSong(songId).subscribe(() => {
      this.songsService.getFavoriteSongs();
    }, () => {
      this.isLoading = false;
    });
  }


}
