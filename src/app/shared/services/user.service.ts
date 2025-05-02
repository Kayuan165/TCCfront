import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  interval,
  map,
  Observable,
  switchMap,
  takeWhile,
  throwError,
} from 'rxjs';
import { User } from '../Interfaces/user.interface';
import { error } from 'console';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  //inicia treinamento
  startFaceTraining(
    rg: string
  ): Observable<{ trainingId: number; status: string }> {
    return this.http
      .post<{
        trainingId: number;
        status: string;
        message?: string;
      }>(`${this.apiUrl}/init-training`, { rg })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage =
            error.error?.message ||
            error.error?.details?.internalError ||
            error.message ||
            'Erro desconhecido ao iniciar treinamento';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  checkTrainingStatus(
    rg: string
  ): Observable<{ status: string; ready: boolean }> {
    return this.http.get<{ status: string; ready: boolean }>(
      `${this.apiUrl}/training-status/${rg}`
    );
  }

  //pooling
  pollTrainingStatus(rg: string, intervalMs = 2000): Observable<boolean> {
    return interval(intervalMs).pipe(
      switchMap(() => this.checkTrainingStatus(rg)),
      map((response) => {
        if (response.status === 'failed') {
          throw new Error('O treinamento falhou');
        }
        return response.ready;
      }),
      takeWhile((ready) => !ready, true), // inclui o último valor (true)
      catchError((error) => {
        console.error('Erro no pooling:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  //registra
  completeRegistration(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, userData).pipe(
      catchError((error) => {
        throw this.handleError(error, 'Erro ao registrar usuário!');
      })
    );
  }

  getAllResident(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/resident`).pipe(
      catchError((error) => {
        throw this.handleError(error, 'Erro ao buscar moradores');
      })
    );
  }

  getAllVisitors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/visitors`).pipe(
      catchError((error) => {
        throw this.handleError(error, 'Erro ao buscar visitantes');
      })
    );
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        throw this.handleError(error, 'Erro ao buscar usuário');
      })
    );
  }

  update(id: number, data: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, data).pipe(
      catchError((error) => {
        throw this.handleError(error, 'Erro ao atualizar usuário');
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(
      catchError((error) => {
        throw this.handleError(error, 'Erro ao remover usuário');
      })
    );
  }

  private handleError(error: any, defaultMsg: string): Error {
    console.error('Erro no UserService:', error);

    if (error.error?.message) {
      throw new Error(error.error.message);
    }

    throw new Error(defaultMsg);
  }
}
