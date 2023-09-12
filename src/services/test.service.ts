import { BehaviorSubject, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TestService {
  sub = new BehaviorSubject(0);
  obs$ = this.sub.asObservable().pipe(shareReplay(3));
}
