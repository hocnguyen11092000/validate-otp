import { ChangeDetectorRef, ViewRef, inject } from '@angular/core';
import { Subject } from 'rxjs';

export const onDestroy = () => {
  const detroy$ = new Subject<void>();
  const viewRef = inject(ChangeDetectorRef) as ViewRef;

  viewRef.onDestroy(() => {
    detroy$.next();
    detroy$.complete();
  });

  return detroy$;
};
