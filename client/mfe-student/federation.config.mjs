import {
  withNativeFederation,
  shareAll,
} from '@angular-architects/native-federation/config';

console.log(
  '>>> LOADING MFE-STUDENT FEDERATION CONFIG <<<',
);

export default withNativeFederation({
  name: 'mfe-student',

  exposes: {
    './routes':
      './src/app/remote/student.routes.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],
});