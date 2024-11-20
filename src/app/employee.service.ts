import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeModel } from './model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<EmployeeModel[]> {
      return this.http.get<EmployeeModel[]>(this.apiUrl);
  }

  addEmployee(employee: Omit<EmployeeModel, 'id'>): Observable<EmployeeModel> {
      return this.http.post<EmployeeModel>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: EmployeeModel): Observable<EmployeeModel> {
      return this.http.put<EmployeeModel>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
