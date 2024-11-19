import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Media} from "../models/media.models";

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private apiUrl = 'http://localhost:3000/producto';

  constructor(private http: HttpClient) { }

  getMedia(): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}`);
  }

  getMediaById(id: string) {
    return this.http.get<Media>(`${this.apiUrl}/${id}`);
  }

  addMedia(media: Media): Observable<Media> {
    return this.http.post<Media>(`${this.apiUrl}`, media);
  }

  updateMedia(media: Media) {
    return this.http.patch(`${this.apiUrl}/${media.id}`, media);
  }
}
