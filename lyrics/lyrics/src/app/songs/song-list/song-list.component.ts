import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {PageEvent} from "@angular/material/paginator";

import {Song} from '../song.model';
import {SongsService} from '../songs.service';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit, OnDestroy {
  songs: Song[]  = [];
  isLoading = false;
  private songsSub: Subscription;
  private authStatusSub: Subscription;
  private adminStatusSub: Subscription;
  totalSongs = 0;
  songsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  userIsAdmin = false;
  userId: string;
  term: string;

  constructor(public songsService: SongsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading=true;
    this.songsService.getSongs(this.songsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.songsSub = this.songsService.getSongUpdateListener()
    .subscribe((songData: {songs: Song[], songCount: number}) => {
      this.isLoading=false;
      this.totalSongs = songData.songCount;
      this.songs=songData.songs;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.userIsAdmin();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.adminStatusSub = this.authService.getAdminStatusListener()
      .subscribe(isAdmin => {
        this.userIsAdmin = isAdmin;
      });
  }

  onAddFavoriteSong(song: Song){
    this.songsService.addFavoriteSong(song);
  }

  onChangePage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.songsPerPage = pageData.pageSize;
    this.songsService.getSongs(this.songsPerPage, this.currentPage);
  }

  onDelete(songId: string){
    this.isLoading = true;
    this.songsService.deleteSong(songId).subscribe(() => {
      this.songsService.getSongs(this.songsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.songsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.adminStatusSub.unsubscribe();
  }
}
