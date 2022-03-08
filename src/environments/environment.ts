// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  localStoragePrefix: 'afiye-front',
  //apiUrl: "https://cors-anywhere.herokuapp.com/http://staging.afiyegroup.com/api/",
  // apiUrl: "https://staging.afiye.net/api/",
   //apiUrl: "http://192.168.0.30/afiye/api/",
    //apiUrl: "http://localhost:8000/property/api/",
    // apiUrl: "https://api.afiyegroup.com/api/",
    // apiUrl: "http://stag.afiyegroup.com/api/",
    apiUrl: 'http://api.staging.afiye.net/api/',
  whitelistedDomains: ['staging.afiyegroup.com', 'trhov.com', "cors-anywhere.herokuapp.com"],
  debugging: true,
    mapKey: 'AIzaSyBfQHaWlwCvpCBpeaB8SJG--WjxlF568sE',
  googleId: '882494021969-ko4fi25gp7fj5546jjmh9e9u9gfijus9.apps.googleusercontent.com',
  facebookId: '677391662861545',
  linkedInId: "78whmhu8glprqk",
  instagramId: '3376315992400294',
  stripeKey: "pk_test_51Gv3l8HKel3X2VALjnvvVbqACrENgkmhmmafVE4aZzUrAPP8a3teJDJndgPrwXcl06nbamLp5nooh46YXHXPCOvc00fpbKAuEW",
  playstoreUrl:"https://play.google.com/store/apps/details?id=com.afiye.app",
    appstoreUrl:"https://apps.apple.com/pk/app/afiye/id1539867707"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
