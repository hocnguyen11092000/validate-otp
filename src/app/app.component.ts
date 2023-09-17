import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  tap,
  timer,
  map,
  take,
  Observable,
  finalize,
  Subject,
  switchMap,
  startWith,
  debounceTime,
  count,
  withLatestFrom,
  interval,
  skipUntil,
  iif,
  of,
  defer,
  shareReplay,
  takeUntil,
  repeat,
  skipWhile,
  exhaustMap,
  from,
} from 'rxjs';
import { ControlHelper } from 'src/components/control-helper.component';
import { Parentcomponent } from 'src/components/parent.component';
import { SendOptcomponent } from 'src/components/send-otp.component';
import { SessionStorage } from 'src/services/sersion.service';
import { TestService } from 'src/services/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    Parentcomponent,
    SendOptcomponent,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    NgIf,
    JsonPipe,
    ControlHelper,
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  readonly coreForm = this._fb.nonNullable.group({});
  readonly otpForm = this._fb.nonNullable.group({
    phone: ['', Validators.required, []],
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  private _test = inject(TestService);
  private readonly _ss = inject(SessionStorage);
  restart$ = new Subject<void>();
  restart2$ = new Subject<void>();
  coutdownInSendOtpComponent: number = 10;

  start = 60;
  start2 = 60;
  countdonwn$ = this.restart$.pipe(
    startWith('init start'),
    switchMap(() => {
      // return timer(100, 1000).pipe(
      //   map((i) => this.start - i),
      //   take(this.start + 1),
      //   finalize(() => {
      //     this.start = 60;
      //   })
      // );
      return this.commonCoundown(0, 1000, this.start, () => {
        this.start = 60;
      });
    })
  );

  title = 'ngx-bootrap';
  config = [
    {
      name: 'a',
      age: '123',
      active: true,
      isAdults: true,
    },
    {
      name: 'b',
      age: '1234',
      active: true,
      isAdults: true,
    },
  ];

  optValue = '';

  public submitCoreForm() {
    if (this.coreForm.valid) {
      console.log(this.coreForm.getRawValue());
    }
  }

  protected emitSubject() {
    this._test.sub.next(Math.random());

    this._test.obs$
      .pipe(
        tap((val) => {
          console.log('app', val);
        })
      )
      .subscribe();
  }

  setItem() {
    this._ss.setItem('test', true);
  }

  getItem() {
    const a = this._ss.getItem('test');
  }

  countSendOtp$ = new BehaviorSubject(0);
  triggerIntervalOtp$ = new Subject<boolean>();

  restart() {
    this.countSendOtp$.next(this.countSendOtp$.getValue() + 1);

    console.log(this.countSendOtp$.getValue());

    if (this.countSendOtp$.getValue() >= 3) {
      this.maxSendOtp = 'Vui lòng thử lại sau 60p';
      this.triggerIntervalOtp$.next(true);
    } else {
      this.restart$.next();
      this.maxSendOtp = '';
    }
  }

  isDisable$ = new Observable<boolean>();

  count$ = new Subject<number>();
  ngOnInit(): void {
    this.triggerIntervalOtp$
      .pipe(
        exhaustMap(() => {
          return this.commonCoundown(0, 1000, 30).pipe(
            withLatestFrom(this.triggerIntervalOtp$),
            finalize(() => {
              console.log('final after send 3 times otp');
            })
          );
        })
      )
      .subscribe(console.log);

    this.otpForm.valueChanges
      .pipe(
        tap(() => {
          this.errorSubmitResponse = '';
        })
      )
      .subscribe();

    this.isDisable$ = this.otpForm.get('phone')!.statusChanges.pipe(
      // startWith(''),
      debounceTime(300),
      map((status) => status === 'VALID')
    );

    // this.isDisable$.subscribe(console.log);

    this.count$
      .pipe(
        tap((val) => {
          const countOpt = this.coutdownInSendOtpComponent;
          if (val >= 5 && countOpt > 0) {
            this.text = 'Vui lòng nhập sau 60s';
            this.restart2$.next();
          }
        })
      )
      .subscribe();

    // this.count$
    //   .pipe(
    //     exhaustMap(() => {
    //       return interval(1000).pipe(
    //         take(60),
    //         withLatestFrom(this.count$),
    //         takeUntil(this.restart2$)
    //       );
    //     }),
    //     tap(([timer, count]) => {
    //       if (count >= 5) {
    //         this.text = 'Vui lòng nhập sau 10s';
    //         console.log('runnn');

    //         // this.otpForm.disable();
    //         this.restart2$.next();
    //       }
    //     })
    //   )
    //   .subscribe();
  }

  text = '';
  maxSendOtp = '';

  // count2$ = interval(1000).pipe(skipUntil(this.count$));

  countafet60s$ = this.restart2$.pipe(
    switchMap(() => {
      // return timer(100, 1000).pipe(
      //   map((i) => this.start2 - i),
      //   take(this.start2 + 1),
      //   finalize(() => {
      //     this.start2 = 60;
      //     this.countSubmit = 1;
      //   })
      // );
      return this.commonCoundown(0, 1000, this.start2, () => {
        this.start2 = 60;
        this.countSubmit = 1;
      });
    })
    // shareReplay()
  );
  timerOut = new Subject();
  countSubmit = 1;
  errorSubmitResponse = '';

  submitOpt() {
    if (this.otpForm.valid) {
      this.checkRegisterSuccess(this.otpForm.getRawValue());
      // console.log(this.otpForm.getRawValue());
    }
  }

  ngAfterViewInit(): void {
    // this.commonCoundown(0, 1000, 3600).subscribe(console.log);
  }

  checkRegisterSuccess(data: any) {
    const validOtp = '123456';
    const submitOtp = _.get(data, 'otp');

    if (validOtp === submitOtp) {
      this._router.navigate(['register-success']);
    } else {
      this.count$.next(this.countSubmit++);
      this.errorSubmitResponse = 'error from submit response';
    }
  }

  onOtpChange(countDown: Observable<number>) {
    countDown.pipe(take(60 + 1)).subscribe((val) => {
      this.coutdownInSendOtpComponent = val;
    });
  }

  public commonCoundown(
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
