import { AddApplianceComponent } from './components/add-appliance/add-appliance.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl='http://localhost:3000/addAppliance';
  private apiUrl2='http://localhost:3000/addCentre';
 private apiUrl3='http://localhost:3000/getAppliance';
 constructor(private http: HttpClient) { }

  storeAppliance(data:any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  addCentre(data:any): Observable<any> {
    console.log(data);
    return this.http.post(this.apiUrl2, data);
  }
  getApplicance(data:any): Observable<any> {
  const apiUrl4=`${this.apiUrl3}/${data}`;
  console.log(apiUrl4);
    return this.http.get(apiUrl4);
  }

}
