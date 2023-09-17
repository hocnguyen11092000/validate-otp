import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  forwardRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import {
  BehaviorSubject,
  Subject,
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { StringTemplateOutlet } from 'src/directives/string-template.directive';
import { ValidateOnBlurDirective } from 'src/directives/validate-on-blur.directive';
import { CommonUtils } from 'src/shared/utils/common.utils';
import { Destroy } from 'src/shared/utils/detroy.utils';

@Component({
  selector: 'app-send-otp',
  template: `
    <div class="otp-group">
      <div class="form-group">
        <label for="otp">text</label>
        <input
          #otp="ngModel"
          type="text"
          class="form-control"
          placeholder="input..."
          [ngModel]="controlValue"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
          validateOnblur
        />
        <!-- <div class="show-error">
          <ng-container
            *stringTemplateOutlet="errorTempl; context: { $implicit: context }"
            >{{ errorTempl }}</ng-container
          >
        </div> -->
        <ng-content [select]="[errorTemp]"></ng-content>
      </div>
      <ng-container
        *ngIf="countdonwn$ | async as countdonwn; else noCountTempl"
      >
        {{ countdonwn }}
      </ng-container>
      <ng-template #noCountTempl>
        <ng-container *ngIf="(countSendOtp | async)! > 3; else resetTemp">
          Vui lòng thử lại sao 60 phút
        </ng-container>

        <ng-template #resetTemp>
          <button
            [disabled]="!disableBtn"
            (click)="resendOtp()"
            type="button"
            class="btn btn-primary"
          >
            Resend
          </button>
        </ng-template>
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
    Destroy,
  ],
  imports: [
    FormsModule,
    CommonModule,
    StringTemplateOutlet,
    ValidateOnBlurDirective,
  ],
})
export class SendOptcomponent
  implements ControlValueAccessor, AfterViewInit, OnInit
{
  private _disableBtnResend = true;
  private _startDefault = 5;

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
  @Input() errorTempl!: TemplateRef<unknown>;
  @Input() context!: AbstractControl;
  @Output() onOtpChange = new EventEmitter();

  //#region inject service
  // private _ngControl = inject(NgControl);
  destroy$ = inject(Destroy);

  constructor() {
    // this._ngControl.valueAccessor = this;
  }
  //#endregion inject service

  //#region viewChild, viewChildren
  @ViewChild('otp') otp!: NgControl;
  //#endregion viewChild, viewChildren

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
  commonUtils = CommonUtils;
  restart$ = new Subject<void>();
  countSendOtp = new BehaviorSubject(0);
  triggerCountdownSendOtp$ = new Subject<void>();

  countdonwn$ = this.restart$.pipe(
    // startWith('init start'),
    switchMap(() => {
      return timer(100, 1000).pipe(
        map((i) => this.start - i),
        take(this.start + 1),
        finalize(() => {
          this.start = 5;
        })
      );
    }),
    takeUntil(this.destroy$),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  //#endregion handle input change

  resendOtp() {
    this.countSendOtp.next(this.countSendOtp.getValue() + 1);

    if (!(this.countSendOtp.getValue() > 3)) {
      this.restart$.next();

      this.onOtpChange.emit(this.countdonwn$);
    } else {
      this.triggerCountdownSendOtp$.next();
    }
  }

  ngAfterViewInit(): void {
    // console.log(this.errorTempl, this.context);
  }

  ngOnInit(): void {
    this.triggerCountdownSendOtp$
      .pipe(
        switchMap(() => {
          return this.commonUtils.commonCoundown(0, 1000, 3).pipe(
            finalize(() => {
              console.log('finalize');

              this.countSendOtp.next(1);
              console.log(this.countSendOtp.getValue());
            })
          );
        })
      )
      .subscribe(console.log);
  }
}
