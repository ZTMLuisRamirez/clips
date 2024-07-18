import { Injectable, inject, signal } from '@angular/core';
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
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  QueryDocumentSnapshot,
  getDoc,
} from '@angular/fire/firestore';
import { IClip } from '../models/clip.model';
import { Auth } from '@angular/fire/auth';
import { Storage, ref, deleteObject } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  #firestore = inject(Firestore);
  #clipsCollection = collection(this.#firestore, 'clips');
  #auth = inject(Auth);
  storage = inject(Storage);
  router = inject(Router);

  pageClips = signal<IClip[]>([]);
  lastDoc: QueryDocumentSnapshot | null = null;
  pendingReq = false;

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

    const screenshotRef = ref(
      this.storage,
      `screenshots/${clip.screenshotFilename}`
    );

    await deleteObject(screenshotRef);
  }

  async getClips() {
    if (this.pendingReq) return;

    this.pendingReq = true;

    const queryParams: QueryConstraint[] = [
      orderBy('timestamp', 'desc'),
      limit(6),
    ];

    if (this.pageClips().length) {
      queryParams.push(startAfter(this.lastDoc));
    }

    const q = query(this.#clipsCollection, ...queryParams);
    const snapshots = await getDocs(q);

    this.pendingReq = false;

    if (!snapshots.docs.length) return;

    this.lastDoc = snapshots.docs[snapshots.docs.length - 1];

    snapshots.docs.forEach((doc) => {
      this.pageClips.set([
        ...this.pageClips(),
        {
          docID: doc.id,
          uid: doc.get('uid'),
          displayName: doc.get('displayName'),
          title: doc.get('title'),
          timestamp: doc.get('timestamp'),
          fileName: doc.get('fileName'),
          clipURL: doc.get('clipURL'),
          screenshotURL: doc.get('screenshotURL'),
          screenshotFilename: doc.get('screenshotFilename'),
        },
      ]);
    });
  }

  async resolve(id: string) {
    const snapshot = await getDoc(doc(this.#firestore, 'clips', id));

    if (!snapshot.exists()) {
      this.router.navigate(['/']);

      return null;
    }

    return snapshot.data() as IClip;
  }
}
