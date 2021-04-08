import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { Subscription } from 'rxjs';


import {SongsService} from '../songs.service';
import {Song} from '../song.model';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.css']
})
export class SongCreateComponent implements OnInit, OnDestroy{
  enteredTitle='';
  enteredContent='';
  private mode = 'create'; //flag
  private songId: string;
  song: Song;
  isLoading = false;
  form: FormGroup;
  url = '';
  urlId: string;
  private authStatusSub: Subscription;

  constructor(public songsService: SongsService, public route: ActivatedRoute, public sanitizer: DomSanitizer, private authService: AuthService) {}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {validators: [Validators.required]}),
      url: new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('songId')){
        this.mode = 'edit';
        this.songId = paramMap.get('songId');
        this.isLoading=true;
        this.songsService.getSong(this.songId).subscribe(songData => {
          this.isLoading=false;
          this.song = {
            id:songData._id,
            title: songData.title,
            content: songData.content,
            url: songData.url,
            creator: songData.creator
          };
          this.form.setValue({
            title: this.song.title,
            content: this.song.content,
            url: this.song.url
          });
        });
      }
      else{
        this.mode = 'create';
        this.songId = null;
      }
    });
  }

  onAddUrl(urlInput: HTMLTextAreaElement){
    this.url = urlInput.value;
  }

  getEmbedUrl(){
    const splitted = this.url.split("=");
    this.urlId = splitted[1];
    const EmbededUrl = "http://www.youtube.com/embed/" + this.urlId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(EmbededUrl);
  }

  onSaveSong(){
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create'){
      this.songsService.addSong(this.form.value.title,this.form.value.content,this.form.value.url);
    }
    else{
      this.songsService.updateSong(this.songId, this.form.value.title, this.form.value.content,this.form.value.url);
    }
    this.form.reset();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
