import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
} from 'rxjs';
import { Parentcomponent } from 'src/components/parent.component';
import { SessionStorage } from 'src/services/sersion.service';
import { TestService } from 'src/services/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    Parentcomponent,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    NgIf,
  ],
})
export class AppComponent implements OnInit {
  private _fb = inject(FormBuilder);
  readonly coreForm = this._fb.nonNullable.group({});
  private _test = inject(TestService);
  private readonly _ss = inject(SessionStorage);
  restart$ = new Subject<void>();

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

  ngOnInit(): void {}
}
