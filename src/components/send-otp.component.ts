import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import * as _ from 'lodash';
import {
  Subject,
  finalize,
  map,
  switchMap,
  take,
  timer,
  startWith,
} from 'rxjs';

@Component({
  selector: 'app-send-otp',
  template: `
    <div class="otp-group">
      <div class="form-group">
        <label for="otp">text</label>
        <input
          type="text"
          class="form-control"
          placeholder="input..."
          [ngModel]="controlValue"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
        />
      </div>
      <ng-container
        *ngIf="countdonwn$ | async as countdonwn; else noCountTempl"
      >
        {{ countdonwn }}
      </ng-container>
      <ng-template #noCountTempl>
        <button
          [disabled]="!disableBtn"
          (click)="resendOtp()"
          type="button"
          class="btn btn-primary"
        >
          Resend
        </button>
      </ng-template>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SendOptcomponent),
      multi: true,
    },
  ],
  imports: [FormsModule, CommonModule],
})
export class SendOptcomponent implements ControlValueAccessor {
  private _disableBtnResend = true;
  private _startDefault = 10;

  //#region defaut register for custom control
  protected controlValue = '';
  onChange!: (value: string) => void;
  onTouched!: () => void;
  isDisabled!: boolean;
  //#endregion default  register for custom control

  @Input() set disableBtn(value: boolean) {
    this._disableBtnResend = value;
  }
  get disableBtn() {
    return this._disableBtnResend;
  }

  @Input() start: number = this._startDefault;

  //#region default function for custom comtrol
  writeValue(value: string): void {
    this.controlValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  //#endregion default function for custom comtrol

  //#region handle input change
  restart$ = new Subject<void>();
  countdonwn$ = this.restart$.pipe(
    // startWith('init start'),
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
  //#endregion handle input change

  resendOtp() {
    this.restart$.next();
  }
}
