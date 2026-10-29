// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare global {
  interface ImportMeta {
    webpackContext(
      path: string,
      options: { recursive: boolean; regExp: RegExp },
    ): {
      <T>(id: string): T;
      keys(): string[];
    };
  }
}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Then we find all the tests.
const context = import.meta.webpackContext('./', {
  recursive: true,
  regExp: /\.spec\.ts$/,
});
// And load the modules.
context.keys().map(context);
