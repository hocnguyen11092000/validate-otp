import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  TemplateRef,
  ContentChild,
  OnInit,
  AfterContentInit,
  ChangeDetectorRef,
  inject,
  OnChanges,
  SimpleChanges,
  HostBinding,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel,
} from '@angular/forms';
import * as _ from 'lodash';
import { debounceTime, startWith, tap } from 'rxjs';
import { StringTemplateOutlet } from 'src/directives/string-template.directive';
@Component({
  selector: '<app-control-helper/>',
  template: `
    <style>
      .show-warning-message {
        color: #ff9b50;
      }
    </style>
    <div class="show-warning-container">
      <ng-content></ng-content>

      <div class="show-warning-message" *ngIf="innerTip">
        <ng-container
          *stringTemplateOutlet="
            innerTip;
            context: { $implicit: validateControl }
          "
          >{{ innerTip }}</ng-container
        >
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StringTemplateOutlet, CommonModule],
})
export class ControlHelper implements OnInit, AfterContentInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);
  @Input() validateOnBlur = true;

  @Input() warningTip!:
    | string
    | TemplateRef<{ $implicit: AbstractControl | NgModel }>;

  @ContentChild(NgControl, { static: false }) defaultValidateControl?:
    | FormControlName
    | FormControlDirective;

  validateControl: AbstractControl | NgModel | null = null;
  innerTip:
    | string
    | TemplateRef<{ $implicit: AbstractControl | NgModel }>
    | null = null;

  ngOnInit(): void {
    this.cdr.markForCheck();
  }

  ngAfterContentInit(): void {
    if (this.defaultValidateControl instanceof FormControlName) {
      this.validateControl = this.defaultValidateControl.control;
      if (this.validateOnBlur) {
        if (this.validateControl.touched) {
          this.innerTip = this.warningTip;
        }
      }

      this.validateControl.valueChanges
        .pipe(
          tap(() => {
            if (this.validateControl instanceof FormControl) {
              this.innerTip = _.size(this.validateControl?.errors)
                ? this.warningTip
                : null;
            }

            this.cdr.markForCheck();
          })
        )
        .subscribe();

      this.cdr.markForCheck();
    }

    // if (this.validateControl instanceof FormControl) {
    //   this.validateControl.statusChanges.subscribe(console.log);
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {}
}
