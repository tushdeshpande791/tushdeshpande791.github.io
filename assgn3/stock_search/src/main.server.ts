import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import * as fs from 'fs';
import * as path from 'path';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);
// const domino = require('domino');

// const template = fs
//   .readFileSync(
//     path.join('dist/browser', 'index.html')
//   )
//   .toString();

// const window = domino.createWindow(template);
// (global as any).window = window;
// (global as any).document = window.document;
export default bootstrap;
