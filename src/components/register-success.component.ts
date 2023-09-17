import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-register-success',
  template: ` <h2>register successfully</h2> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterSuccessComponent {}
