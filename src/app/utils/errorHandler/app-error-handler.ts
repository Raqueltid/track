import { ErrorHandler, Injectable} from '@angular/core';
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  // Handle Client Error (Angular Error, ReferenceError, etc. Server or connection error (HttpErrorResponse) is handled in AppError)
  handleError(error) {
    // console.error(error);
  }
}
