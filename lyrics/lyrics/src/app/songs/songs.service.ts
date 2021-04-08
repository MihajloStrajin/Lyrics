import {Injectable, NgModule} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {map} from "rxjs/operators"; //transformisemo svaki element niza u nov element i sacuvamo u novi niz
import {Router} from "@angular/router";
import {DomSanitizer} from '@angular/platform-browser';

import { Song } from "./song.model";

Injectable({providedIn: 'root'})
@NgModule()
export class SongsService{
  private songs: Song[] = [];
  private songsUpdated = new Subject<{songs: Song[], songCount: number}>();
  private favoriteSongsUpdated = new Subject<Song[]>();
  private favoriteSongs: Song[] = [];

  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer) {}

  getSongs(songsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${songsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, songs: any, maxSongs: number}>('http://localhost:3000/api/songs' + queryParams)
    .pipe(map(songData => {
      return { songs: songData.songs.map(song => {
        return {
          title: song.title,
          content: song.content,
          id: song._id,
          url: song.url,
          creator: song.creator
        };
      }), maxSongs: songData.maxSongs};
    }))
    .subscribe((trasnformedSongData) => {
      this.songs = trasnformedSongData.songs;
      this.songsUpdated.next({
        songs: [...this.songs],
        songCount: trasnformedSongData.maxSongs
      });
    });
  }

  getFavoriteSongs(){
    this.http.get<{message: string, songs: any}>('http://localhost:3000/api/favoriteSongs')
    .pipe(map(favSongData => {
      return favSongData.songs.map(favoriteSong => {
        return {
          title: favoriteSong.title,
          content: favoriteSong.content,
          id: favoriteSong._id,
          url: favoriteSong.url,

        };
      });
    }))
    .subscribe((trasnformedSongData) => {
      this.favoriteSongs = trasnformedSongData;
      this.favoriteSongsUpdated.next(
       [...this.favoriteSongs]
      );
    });
  }

  getSongUpdateListener(){
    return this.songsUpdated.asObservable();
  }

  getFavoriteSongUpdateListener(){
    return this.favoriteSongsUpdated.asObservable();
  }

  getSong(id: string){
    return this.http.get<{_id: string, title: string, content: string, url: string, creator: string}>(
      "http://localhost:3000/api/songs/" + id);
  }

  addSong(title: string, content: string, url: string){
    const song: Song = {
      id: null,
      title: title,
      content: content,
      url: url,
      creator: null
    };
    this.http.post<{message: string, songId: string}>('http://localhost:3000/api/songs', song)
    .subscribe((responseData) => {
      this.router.navigate(["/"]);
    });

  }

  addFavoriteSong(song: Song){
    this.http.post<{message: string, songId: string}>('http://localhost:3000/api/favoriteSongs', song)
    .subscribe((responseData) => {
      this.router.navigate(["/favoriteSongs"]);
    });

  }

  updateSong(id: string, title: string, content: string, url: string){
    const song: Song = {id: id, title: title, content: content, url: url, creator: null};
    this.http.put("http://localhost:3000/api/songs/" + id, song)
    .subscribe(response => {
      this.router.navigate(["/"]);
    });
  }

  deleteSong(songId: string){
    return this.http
      .delete("http://localhost:3000/api/songs/" + songId);
  }

  deleteFavoriteSong(songId: string){
    return this.http
      .delete("http://localhost:3000/api/favoriteSongs/" + songId);
  }

  getEmbedUrl(url: string){
    const splitted = url.split("=");
    const urlId = splitted[1];
    const EmbededUrl = "http://www.youtube.com/embed/" + urlId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(EmbededUrl);
  }
}
