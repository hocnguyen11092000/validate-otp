import { enableProdMode } from '@angular/core';

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';
import { Parentcomponent } from './components/parent.component';
import { ChildComponent } from './components/child.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: 'parent',
        loadComponent: async () =>
          (await import('./components/parent.component')).Parentcomponent,
      },
      {
        path: 'child',
        loadComponent: async () =>
          (await import('./components/child.component')).ChildComponent,
      },
    ]),
  ],
}).catch((err) => console.error(err));
