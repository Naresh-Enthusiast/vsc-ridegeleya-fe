import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private LocaionUrl = 'http://localhost:5205/api/GeoLocation?query=';

  constructor(private http: HttpClient) {}

  getLocations(query: string): Observable<any> {
    if (!query || query.trim().length === 0) {
      return new Observable(observer => {
        observer.next({ geonames: [] });
        observer.complete();
      });
    }
    return this.http.get<any>(`${this.LocaionUrl}${encodeURIComponent(query.trim())}`);
  }
}
