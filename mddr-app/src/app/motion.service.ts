import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http' 

@Injectable()
export class MotionService {

  constructor(private _http: HttpClient) { }

}
