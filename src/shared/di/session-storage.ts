import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';
import * as _ from 'lodash';

export const SESSION_STORAGE = new InjectionToken<Storage | null>(
  'session-storage',
  {
    factory: () => {
      const document = inject(DOCUMENT, { optional: true });

      if (_.get(document, 'defaultView')) {
        return _.get(document, 'defaultView.sessionStorage')!;
      }

      return null;
    },
  }
);
