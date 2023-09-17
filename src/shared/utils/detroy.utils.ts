import { Subject } from 'rxjs';
import { OnDestroy, Injectable } from '@angular/core';

@Injectable()
export class Destroy extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
