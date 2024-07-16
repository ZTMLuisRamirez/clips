import {
  Component,
  inject,
  input,
  effect,
  signal,
  output,
} from '@angular/core';
import { ModalComponent } from '../../shared/modal/modal.component';
import { IClip } from '../../models/clip.model';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgClass } from '@angular/common';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    AlertComponent,
    NgClass,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  activeClip = input<IClip | null>(null);
  fb = inject(FormBuilder);
  clipService = inject(ClipService);

  form = this.fb.nonNullable.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  inSubmission = signal(false);
  showAlert = signal(false);
  alertColor = signal('blue');
  alertMsg = signal('Please wait! Updating clip');

  update = output<IClip>();

  constructor() {
    effect(
      () => {
        this.form.controls.id.setValue(this.activeClip()?.docID ?? '');
        this.form.controls.title.setValue(this.activeClip()?.title ?? '');

        this.inSubmission.set(false);
        this.showAlert.set(false);
      },
      { allowSignalWrites: true }
    );
  }

  async submit() {
    this.inSubmission.set(true);
    this.showAlert.set(true);
    this.alertColor.set('blue');
    this.alertMsg.set('Please wait! Updating clip');

    try {
      await this.clipService.updateClip(
        this.form.controls.id.value,
        this.form.controls.title.value
      );
    } catch (e) {
      this.inSubmission.set(false);
      this.alertColor.set('red');
      this.alertMsg.set('Something went wrong! Try again later.');
      return;
    }

    const updatedClip = this.activeClip();

    if (updatedClip) {
      updatedClip.title = this.form.controls.title.value;
      this.update.emit(updatedClip);
    }

    this.inSubmission.set(false);
    this.alertColor.set('green');
    this.alertMsg.set('Success!');
  }
}
