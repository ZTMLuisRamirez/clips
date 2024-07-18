import { Routes, ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AboutComponent } from './views/about/about.component';
import { ManageComponent } from './views/manage/manage.component';
import { UploadComponent } from './views/upload/upload.component';
import { ClipComponent } from './views/clip/clip.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ClipService } from './services/clip.service';
import { IClip } from './models/clip.model';
import { inject } from '@angular/core';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/');
const clipResolver: ResolveFn<IClip | null> = (
  route: ActivatedRouteSnapshot
) => {
  return inject(ClipService).resolve(route.paramMap.get('id')!);
};

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about', // example.com/about
    component: AboutComponent,
  },
  {
    path: 'manage',
    component: ManageComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
    resolve: {
      clip: clipResolver,
    },
  },
  {
    path: 'manage-clips',
    redirectTo: '/manage',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
