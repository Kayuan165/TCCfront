import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance } from '../Interfaces/attendance.interface';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  apiUrl = 'http://localhost:3000/attendance';

  constructor(private http: HttpClient) {}

  getAllAttendaces(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/all`);
  }
}
