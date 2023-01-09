import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private http: HttpClient) { }

  private actualUpload(file: any, url: string, description: string, objectId: any) {
    const headers = new HttpHeaders({
      'Content-Type': ''
    });
    const options = {
      headers
    };

    if (!url) {
      url = `/attachments/upload`;
    }

    const fileName = file.name;
    const formData = new FormData();
    formData.append('files', file);
    // tslint:disable-next-line:no-string-literal
    formData.append('modelName', file[ 'objectKey' ]);
    formData.append('modelKey', objectId);
    // tslint:disable-next-line:no-string-literal
    formData.append('fieldName', file[ 'fieldName' ]);
    formData.append('fileName', fileName);
    formData.append('fileDesc', description || '');
    return this.http.post(
      url,
      formData
    );

  }

  // tslint:disable-next-line:variable-name
  uploadFile(file: File | any, url: string, description: string, objectId: any, form?: any): Observable<any> {

    if (file instanceof File) {

      return this.actualUpload(file, url, description, objectId);

    } else if (file instanceof Array) {

      const allFileUploadArray = [];
      for (const singleFile of file) {
        if (singleFile instanceof File || (singleFile.file && singleFile.file instanceof File)) {
          allFileUploadArray.push(this.actualUpload(singleFile, url, description, objectId));
        } else {
          allFileUploadArray.push(of(singleFile));
        }
      }
      if (allFileUploadArray.length === 0) {
        allFileUploadArray.push(of([]));
      }
      return forkJoin(allFileUploadArray);

    } else {
      return of([]);
    }
  }

  getData(url: string): Observable<any> {
    return this.http.get(url);
  }

  saveAddedFiles(splittedData:any, id:any, form:any) {
    //this.loader.show();
    return Observable.create((observer:any) => {
      // setTimeout(() => {
      //   this.loader.show();
      // });
      const dataToResend:any = {};
      if (splittedData.files) {
        // Skip fields with null values
        const totalFiles = Object.values(splittedData.files).filter(obj=>obj!=null).length;
        let index = 1;
        for (const file in splittedData.files) {
          // Skip fields with null values
          if (splittedData.files.hasOwnProperty(file) && splittedData.files[file]!=null) {
            let url = splittedData.files[ file ][ 'uploadUrl' ];
            if(!url && splittedData.cUrl){
              url = splittedData.cUrl;
            }
            delete splittedData.files[ file ][ 'uploadUrl' ];
            this.uploadFile(splittedData.files[ file ], url, '', id, form)
              .subscribe(res => {
                if (res !== 'Nil') {
                  const curFiles = splittedData.files[ file ];
                  let fieldName = '';
                  let fieldValue;

                  fieldName = file;
                  if (curFiles instanceof Array) {
                    fieldValue = res; // res.join(',').split(',');
                  } else if(!res){
                    fieldValue = [];
                  } else {
                    fieldValue = res[ 0 ];
                  }
                  dataToResend[ fieldName ] = fieldValue;
                  if (index === totalFiles) {
                    const finalData = { data: { ...splittedData.data, ...dataToResend } };
                    //this.loader.hide();
                    observer.next(dataToResend);
                    observer.complete();
                  }
                }
                index = index + 1;
              }, err => {
                console.log('Error == ', err);
                observer.error(err);
              });
          }
        }
      }
    });

  }
}
