import { Observable, timer, map, take, finalize } from 'rxjs';

export class CommonUtils {
  public static commonCoundown(
    startDue: number = 0,
    intervalDuration: number = 1000,
    time: number = 60,
    callbackAfterStreamFinal: Function | null = null
  ): Observable<number> {
    return timer(startDue, intervalDuration).pipe(
      map((i) => time - i),
      take(time + 1),
      finalize(callbackAfterStreamFinal?.())
      // finalize(() => {
      //   this.start2 = 60;
      //   this.countSubmit = 1;
      // }),
    );
  }
}
