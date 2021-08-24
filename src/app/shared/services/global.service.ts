import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public countries$ = new BehaviorSubject<any[]>([]);
  public userUpdate$ = new BehaviorSubject<any>({});
  public userUpdateProfile$ = new BehaviorSubject<any>(null);
  public searchLanding$ = new BehaviorSubject<any>({});
  public routePage$ = new BehaviorSubject<any>('');
  public mapData$ = new BehaviorSubject<any>(null);
  public currentUserMessage$ = new BehaviorSubject<any>(null);
  constructor() { }
}
