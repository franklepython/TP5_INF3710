import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { of, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { Espece } from "../../../common/tables/Espece";
import { EspecePK } from "../../../common/tables/EspecePK";

@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private http: HttpClient) {}

  private _listners: any = new Subject<any>();

  public listen(): Observable<any> {
    return this._listners.asObservable();
  }

  public filter(filterBy: string): void {
    this._listners.next(filterBy);
  }

  public getEspeces(): Observable<Espece[]> {
    return this.http
      .get<Espece[]>(this.BASE_URL + "/especes")
      .pipe(catchError(this.handleError<Espece[]>("getEspeces")));
  }

  public insertEspece(espece: Espece): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/especes/insert", espece)
      .pipe(catchError(this.handleError<number>("insertEspece")));
  }

  public updateEspece(espece: Espece): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + "/especes/update", espece)
      .pipe(catchError(this.handleError<number>("updateEspece")));
  }

  public deleteEspece(nomScientifique: string): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/especes/delete/" + nomScientifique, {})
      .pipe(catchError(this.handleError<number>("deleteEspece")));
  }

  public getEspecePKs(): Observable<EspecePK[]> {
    return this.http
      .get<EspecePK[]>(this.BASE_URL + "/especes/nomScientifique")
      .pipe(catchError(this.handleError<EspecePK[]>("getEspecePKs")));
  }

  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
