import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { SortRequest } from '../../models/SortRequest';
import { AppError } from './../../utils/errorHandler/app-error';
import { BadRequestError } from './../../utils/errorHandler/bad-request-error';
import { ForbiddenError } from './../../utils/errorHandler/forbidden-error.handler';
import { MethodNotAllowedError } from './../../utils/errorHandler/method-not-allowed-error.handler';
import { NotFoundError } from './../../utils/errorHandler/not-found-error';
import { UnauthorizedError } from './../../utils/errorHandler/unauthorized-error';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: Http, private router: Router) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', localStorage.getItem('token'));
  }

  _createRequestOptionsWithHeadersAndUrlParams(
    headers?: Headers,
    urlParams?: URLSearchParams
  ): RequestOptions {
    if (!headers) {
      headers = new Headers();
      this.createAuthorizationHeader(headers);
    }

    const requestOptions = new RequestOptions({
      headers: headers
    });

    if (urlParams) {
      requestOptions.params = urlParams;
    }

    return requestOptions;
  }

  doPost(url, body?, headers?: Headers, urlParams?: URLSearchParams) {
    const requestOptions = this._createRequestOptionsWithHeadersAndUrlParams(headers, urlParams);

    return this.http.post(url, body, requestOptions).pipe(
      map(response => response.json()),
      catchError(err => {
        return this.handleError(err);
      })
    );
  }

  doGet(url, headers?: Headers, urlParams?: URLSearchParams) {
    const requestOptions = this._createRequestOptionsWithHeadersAndUrlParams(headers, urlParams);
    return this.http.get(url, requestOptions).pipe(
      map(response => response.json()),
      catchError(this.handleError)
    );
  }

  doDelete(url, headers?: Headers) {
    const requestOptions = this._createRequestOptionsWithHeadersAndUrlParams(headers);
    return this.http.delete(url, requestOptions).pipe(
      map(response => response.json()),
      catchError(this.handleError)
    );
  }

  doPut(url, body?, headers?: Headers, urlParams?: URLSearchParams) {
    const requestOptions = this._createRequestOptionsWithHeadersAndUrlParams(headers, urlParams);

    return this.http.put(url, body, requestOptions).pipe(
      map(response => response.json()),
      catchError(err => err)
    );
  }

  doPatch(url, body?, headers?: Headers, urlParams?: URLSearchParams) {
    const requestOptions = this._createRequestOptionsWithHeadersAndUrlParams(headers, urlParams);

    return this.http.patch(url, body, requestOptions).pipe(
      map(response => response.json()),
      catchError(err => err)
    );
  }

  doSort(sort: Array<SortRequest> = []) {
    let sortStr = '';
    if (sort.length > 0) {
      sort.forEach(s => {
        sortStr = `${sortStr}&$sort[${s.getId()}]=${s.getTypeOrder()}`;
      });
    }
    return sortStr;
  }
  private handleError(error: Response) {
    // return throwError(error.json());
    if (error.status === 400) {
      return throwError(new BadRequestError(error.json()));
      // return throwError(error.json());
    }
    if (error.status === 401) {
      return throwError(new UnauthorizedError(error.json()));
    }
    if (error.status === 403) {
      return throwError(new ForbiddenError(error.json()));
    }
    if (error.status === 404) {
      return throwError(new NotFoundError(error.json()));
    }
    if (error.status === 405) {
      return throwError(new MethodNotAllowedError(error.json()));
    }
    if (error.status === 409) {
      return throwError(error.json());
    }
    return throwError(new AppError(error.json()));
  }
}
