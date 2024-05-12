import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { contacto } from '../interfaces/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  private baseUrl = 'http://localhost/capi/back-CAPI/public/';
  public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

  constructor(
    private _http: HttpClient,
  ) { }

  getContactos(page:number, type:number, search:string):Observable<any>{
    return this._http.get(this.baseUrl+'contactos/'+type+'/'+search+'?page='+page,{headers:this.headers});
  }

  getContacto(idContacto:number){
    return this._http.get(this.baseUrl+'contactos/'+idContacto,{headers:this.headers});
  }

  postContacto(contacto:contacto):Observable<any>{
    return this._http.post(this.baseUrl+'contactos',contacto);
  }

  putContacto(idContacto:number, contacto:contacto):Observable<any>{
    return this._http.put(this.baseUrl+'contactos/'+idContacto,contacto);
  }

  delContacto(idContacto:number):Observable<any>{
    return this._http.delete(this.baseUrl+'contactos/'+idContacto);
  }
}
