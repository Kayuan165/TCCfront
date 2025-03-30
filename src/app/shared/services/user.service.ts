import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  register(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  getAllResident(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/resident`);
  }

  getAllVisitors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/visitors`);
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  update(id: number, data: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
