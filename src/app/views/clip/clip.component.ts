import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.css',
})
export class ClipComponent implements OnInit {
  route = inject(ActivatedRoute);
  id = signal('');

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id.set(params['id']);
    });
  }
}
