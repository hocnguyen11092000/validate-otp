import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Parentcomponent } from 'src/components/parent.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [Parentcomponent, ReactiveFormsModule],
})
export class AppComponent {
  private _fb = inject(FormBuilder);
  readonly coreForm = this._fb.nonNullable.group({});

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
}
