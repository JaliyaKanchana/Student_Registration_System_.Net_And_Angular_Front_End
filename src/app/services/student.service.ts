import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiURL = 'https://localhost:7211/api/students';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('Something went wrong:', error);
    return throwError(error);
  }

  getStudents(): Observable<any> {
    return this.http.get(this.apiURL).pipe(catchError(this.handleError));
  }

  getStudent(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`).pipe(catchError(this.handleError));
  }

  createStudent(data: any): Observable<any> {
    let headers = {};

    if (!(data instanceof FormData)) {
        headers = { 'Content-Type': 'application/json', ...headers }; // or any default content-type you'd prefer
    }

    return this.http.post(this.apiURL, data, { headers }).pipe(catchError(this.handleError));
}



updateStudent(id: number, data: any): Observable<any> {
  let headers = {};

  if (!(data instanceof FormData)) {
      headers = { 'Content-Type': 'application/json', ...headers }; 
  }

  return this.http.put(`${this.apiURL}/${id}`, data, { headers }).pipe(catchError(this.handleError));
}




  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`).pipe(catchError(this.handleError));
  }
}
