import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { of, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { Especeoiseau } from "../../../common/tables/Especeoiseau";
import { EspeceoiseauPK } from "../../../common/tables/EspeceoiseauPK";

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

  public getEspeceoiseaus(): Observable<Especeoiseau[]> {
    return this.http
      .get<Especeoiseau[]>(this.BASE_URL + "/especeoiseaux")
      .pipe(catchError(this.handleError<Especeoiseau[]>("getEspeceoiseaus")));
  }

  public insertEspeceoiseau(especeoiseau: Especeoiseau): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/especeoiseaux/insert", especeoiseau)
      .pipe(catchError(this.handleError<number>("insertEspeceoiseau")));
  }

  public updateEspeceoiseau(especeoiseau: Especeoiseau): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + "/especeoiseaux/update", especeoiseau)
      .pipe(catchError(this.handleError<number>("updateEspeceoiseau")));
  }

  public deleteEspeceoiseau(nomscientifique: string): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + "/especeoiseaux/delete/" + nomscientifique, {})
      .pipe(catchError(this.handleError<number>("deleteEspeceoiseau")));
  }

  public getEspeceoiseauPKs(): Observable<EspeceoiseauPK[]> {
    return this.http
      .get<EspeceoiseauPK[]>(this.BASE_URL + "/especeoiseaux/nomscientifique")
      .pipe(
        catchError(this.handleError<EspeceoiseauPK[]>("getEspeceoiseauPKs"))
      );
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
