import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { IClip } from '../models/clip.model';
import { Auth } from '@angular/fire/auth';
import { Storage, ref, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  #firestore = inject(Firestore);
  #clipsCollection = collection(this.#firestore, 'clips');
  #auth = inject(Auth);
  storage = inject(Storage);

  constructor() {}

  async createClip(data: IClip) {
    return await addDoc(this.#clipsCollection, data);
  }

  async getUserClips() {
    const q = query(
      this.#clipsCollection,
      where('uid', '==', this.#auth.currentUser?.uid)
    );

    return await getDocs(q);
  }

  async updateClip(id: string, title: string) {
    const clipRef = doc(this.#firestore, 'clips', id);

    return await updateDoc(clipRef, {
      title,
    });
  }

  async deleteClip(clip: IClip) {
    const fileRef = ref(this.storage, `clips/${clip.fileName}`);

    await deleteObject(fileRef);

    const docRef = doc(this.#firestore, 'clips', clip.docID as string);

    await deleteDoc(docRef);
  }
}
