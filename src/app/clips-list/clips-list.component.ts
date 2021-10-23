import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true

  constructor(public clipService: ClipService) { 
    this.clipService.getClips()
  }

  ngOnInit(): void {
    if(this.scrollable) {
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  ngOnDestroy() {
    if(this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll)
    }

    this.clipService.pageClips = []
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement
    const { innerHeight } = window

    const bottomOfWindow = Math.round(scrollTop) + innerHeight < offsetHeight - 100

    if(bottomOfWindow) {
      this.clipService.getClips()
    }
  }

}
