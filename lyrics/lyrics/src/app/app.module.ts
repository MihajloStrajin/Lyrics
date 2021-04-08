import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatExpansionModule} from "@angular/material/expansion";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from '@angular/material/icon';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppComponent } from "./app.component";
import { SongCreateComponent } from "./songs/song-create/song-create.component";
import {HeaderComponent} from "./header/header.component";
import { SongListComponent } from "./songs/song-list/song-list.component";
import {SongsService} from "./songs/songs.service";
import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import {ErrorInterceptor} from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { FavoriteSongsListComponent } from './songs/favoriteSongs-list/favoriteSongs-list.component';


@NgModule({
  declarations: [
    AppComponent,
    SongCreateComponent,
    HeaderComponent,
    SongListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    FavoriteSongsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    SongsService,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    Ng2SearchPipeModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
