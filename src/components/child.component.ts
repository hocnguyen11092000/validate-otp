import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-child[form]',
  template: ` <h3>hello form child component</h3> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class ChildComponent implements OnInit {
  private _fb = inject(FormBuilder);

  @Input() form!: FormGroup;

  ngOnInit(): void {
    if (this.form) {
      // this.addFormGroup();
    }
  }

  addFormGroup(): void {
    this.form.addControl(
      'child',
      this._fb.group({
        child: [''],
      })
    );
  }
}
