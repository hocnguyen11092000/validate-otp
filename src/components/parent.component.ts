import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ChildComponent } from './child.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-parent[form][test]',
  template: `
    <h3>Hello form parent component</h3>
    <app-child [form]="getCurrentControl"></app-child>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChildComponent, ReactiveFormsModule],
})
export class Parentcomponent implements OnInit {
  private _fb = inject(FormBuilder);
  _config: any;

  @Input() form!: FormGroup;
  @Input() test!: Boolean;

  get config(): any {
    return this._config;
  }
  @Input() set config(value: any) {
    this._config = value;
  }

  configDefault = [
    {
      name: 'a',
      age: '123',
      isAdults: true,
      someField: true,
    },
    {
      name: 'b',
      age: '1234',
      someField: false,
    },
  ];

  ngOnInit(): void {
    this.addFormGroupItem();

    if (_.size(this.config)) {
      this.config = _.chain(this.config)
        .filter((c) => c.active)
        .map((c) => {
          const _foundItems = _.find(
            this.configDefault,
            (d) => d.name === c.name
          );

          if (_foundItems) {
            c = {
              ...c,
              ..._foundItems,
            };
          }

          return c;
        })
        .value();
    }

    console.log(this.config);
  }

  addFormGroupItem(): void {
    this.form.addControl('parent', this._fb.group(this.addControlName()));
  }

  get getCurrentControl(): FormGroup {
    return this.form.get('parent')! as FormGroup;
  }

  addControlName() {
    // {
    //   a: [''],
    //   b: ['']
    // }
    let result: any = {};
    _.forEach(this.config, (c) => {
      result[c.name] = ['', Validators.maxLength(3)];
    });

    return result;
  }
}
