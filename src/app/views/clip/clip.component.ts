import {
  Component,
  inject,
  signal,
  OnInit,
  viewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, RouterLink, Params } from '@angular/router';
import { ClipsListComponent } from '../../video/clips-list/clips-list.component';
import videojs from 'video.js';
import { IClip } from '../../models/clip.model';
import { FbTimestampPipe } from '../../shared/pipes/fb-timestamp.pipe';

@Component({
  selector: 'app-clip',
  standalone: true,
  imports: [RouterLink, ClipsListComponent, FbTimestampPipe],
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.css',
})
export class ClipComponent implements OnInit {
  route = inject(ActivatedRoute);
  target = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');
  clip = signal<IClip | null>(null);

  ngOnInit() {
    const player = videojs(this.target().nativeElement);

    this.route.data.subscribe((data) => {
      this.clip.set(data['clip']);
      player.src({
        src: this.clip()?.clipURL,
        type: 'video/mp4',
      });
    });
  }
}
