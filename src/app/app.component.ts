import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
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
  readonly coreForm = this._fb.nonNullable.group({});
  readonly otpForm = this._fb.nonNullable.group({
    phone: ['', Validators.required, []],
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  private _test = inject(TestService);
  private readonly _ss = inject(SessionStorage);
  restart$ = new Subject<void>();
  restart2$ = new Subject<void>();

  start = 10;
  countdonwn$ = this.restart$.pipe(
    startWith('init start'),
    switchMap(() => {
      return timer(100, 1000).pipe(
        map((i) => this.start - i),
        take(this.start + 1),
        finalize(() => {
          this.start = 10;
        })
      );
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

  restart() {
    this.restart$.next();
  }

  isDisable$ = new Observable<boolean>();

  count$ = new Subject<number>();

  ngOnInit(): void {
    this.isDisable$ = this.otpForm.get('phone')!.statusChanges.pipe(
      // startWith(''),
      debounceTime(300),
      map((status) => status === 'VALID')
    );

    // this.isDisable$.subscribe(console.log);

    this.count$
      .pipe(
        withLatestFrom(this.count2$),
        tap(([number, timer]) => {
          console.log(number, timer);

          if (+number > 5 && timer > 10) {
            this.text = 'Vui lòng nhập lại sau 60 phút';
            this.restart2$.next();
          } else {
            this.text = '';
          }
        })
      )
      .subscribe(console.log);
  }

  text = '';

  count2$ = interval(1000).pipe(
    skipUntil(this.count$),
    takeUntil(this.restart2$)
    //  repeat({ delay: () => this.count$ })
  );

  countafet60s$ = this.restart2$.pipe(
    switchMap(() => {
      return timer(100, 1000).pipe(
        map((i) => this.start - i),
        take(this.start + 1),
        finalize(() => {
          this.start = 10;
          this.coutSubmit = 1;
        })
      );
    }),
    shareReplay()
  );
  timerOut = new Subject();
  coutSubmit = 1;

  submitOpt() {
    if (this.otpForm.valid) {
      this.count$.next(this.coutSubmit++);
      console.log(this.otpForm.getRawValue());
    }
  }

  ngAfterViewInit(): void {}
}
