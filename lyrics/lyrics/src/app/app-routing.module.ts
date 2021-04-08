import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SongListComponent} from "./songs/song-list/song-list.component";
import { SongCreateComponent } from './songs/song-create/song-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import {FavoriteSongsListComponent} from "./songs/favoriteSongs-list/favoriteSongs-list.component";

const routes: Routes = [
  {path: '', component: SongListComponent},
  {path: 'create', component: SongCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:songId', component: SongCreateComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'favoriteSongs', component: FavoriteSongsListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
