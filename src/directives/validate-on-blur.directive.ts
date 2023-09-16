import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[validateOnblur]',
  host: {
    '(focus)': 'onFocus($event)',
    '(blur)': 'onBlur($event)',
  },
  standalone: true,
})
export class ValidateOnBlurDirective {
  private validators: any;
  private asyncValidators: any;
  constructor(public formControl: NgControl) {}
  onFocus($event: any) {
    this.validators = this.formControl?.control?.validator;
    this.asyncValidators = this.formControl?.control?.asyncValidator;
    this.formControl?.control?.clearAsyncValidators();
    this.formControl?.control?.clearValidators();
  }

  onBlur($event: any) {
    this.formControl?.control?.markAllAsTouched();
    this.formControl?.control?.updateValueAndValidity({ onlySelf: true });
  }
}
