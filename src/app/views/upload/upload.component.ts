import { Component, signal, inject, OnDestroy } from '@angular/core';
import { EventBlockerDirective } from '../../shared/directives/event-blocker.directive';
import { NgClass, PercentPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import {
  Storage,
  ref,
  uploadBytesResumable,
  fromTask,
  getDownloadURL,
  UploadTask,
} from '@angular/fire/storage';
import { v4 as uuid } from 'uuid';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Auth } from '@angular/fire/auth';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';
import { serverTimestamp, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    EventBlockerDirective,
    NgClass,
    ReactiveFormsModule,
    InputComponent,
    AlertComponent,
    PercentPipe,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent implements OnDestroy {
  isDragover = signal(false);
  file = signal<File | null>(null);
  nextStep = signal(false);
  showAlert = signal(false);
  alertColor = signal('blue');
  alertMsg = signal('Please wait! Your clip is being uploaded.');
  inSubmission = signal(false);
  percentage = signal(0);
  showPercentage = signal(false);
  #auth = inject(Auth);
  clipTask?: UploadTask;

  fb = inject(FormBuilder);
  #storage = inject(Storage);
  #clipService = inject(ClipService);
  #router = inject(Router);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  storeFile($event: Event) {
    this.isDragover.set(false);

    this.file.set(($event as DragEvent).dataTransfer?.files.item(0) ?? null);

    if (this.file()?.type !== 'video/mp4') return;

    this.form.controls.title.setValue(
      this.file()?.name.replace(/\.[^/.]+$/, '') ?? ''
    );

    this.nextStep.set(true);

    console.log(this.file());
  }

  uploadFile() {
    this.showAlert.set(true);
    this.alertColor.set('blue');
    this.alertMsg.set('Please wait! Your clip is being uploaded.');
    this.inSubmission.set(true);
    this.showPercentage.set(true);

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const clipRef = ref(this.#storage, clipPath);

    this.clipTask = uploadBytesResumable(clipRef, this.file() as File);

    fromTask(this.clipTask).subscribe({
      next: (snapshot: any) => {
        this.form.disable();

        const progress = snapshot.bytesTransferred / snapshot.totalBytes;

        this.percentage.set(progress);
      },
      error: (error: any) => {
        this.form.enable();

        this.alertColor.set('red');
        this.alertMsg.set('Upload failed! Please try again later.');
        this.inSubmission.set(false);
        this.showPercentage.set(false);

        console.error(error);
      },
      complete: async () => {
        const clipURL = await getDownloadURL(clipRef);

        const clip = {
          uid: this.#auth.currentUser?.uid as string,
          displayName: this.#auth.currentUser?.displayName as string,
          title: this.form.controls.title.value,
          fileName: `${clipFileName}.mp4`,
          clipURL,
          timestamp: serverTimestamp() as Timestamp,
        };

        const clipDocRef = await this.#clipService.createClip(clip);

        this.alertColor.set('green');
        this.alertMsg.set(
          'Success! Your clip is now ready to share with the world.'
        );
        this.showPercentage.set(false);

        setTimeout(() => {
          this.#router.navigate(['clip', clipDocRef.id]);
        }, 1000);
      },
    });
  }

  ngOnDestroy() {
    this.clipTask?.cancel();
  }
}
