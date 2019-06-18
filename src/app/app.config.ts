import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface FirebaseConfig {
	apiKey: string,
	authDomain: string,
	databaseURL: string,
	projectId: string,
	storageBucket: string,
	messagingSenderId: string,
	webApplicationId: string
}

export interface AppConfig {
	appName: string;
	apiBase: string;
	perPage: string;
	consumerKey: string;
	consumerSecret: string;
	adminUsername: string;
	adminPassword: string;
	oneSignalAppId: string;
	oneSignalGPSenderId: string;
	paypalSandbox: string;
	paypalProduction: string;
	payuSalt: string;
	payuKey: string;
	availableLanguages: Array<any>;
	firebaseConfig: FirebaseConfig;
}

export const BaseAppConfig: AppConfig = {
	appName: "Easy Vizag",
    apiBase: "http://www.easyvizag.com/wp-json/",
    perPage: "5",
    consumerKey: "",
    consumerSecret: "",
    adminUsername: "admin",
    adminPassword: "Advanced@18",
    oneSignalAppId: "c8cbfa46-b86f-4d0f-80d0-080cbc1b46ba",
    oneSignalGPSenderId: "456795605868",
    paypalSandbox: "",
    paypalProduction: "",
    payuSalt: "LO5RWu0GnC",
    payuKey: "phiDc9hv",
    availableLanguages: [{
            code: 'en',
            name: 'English'
		}],	
		firebaseConfig: {
			webApplicationId: "456795605868-bb5o0l9f8fd9o30cueb1eloi5tcb2034.apps.googleusercontent.com",
			apiKey: "AIzaSyAUR5saDnUnGXlZpTBsGmgsNNMkwnlZYqs",
			authDomain: "easy-vizag.firebaseapp.com",
			databaseURL: "https://easy-vizag.firebaseio.com",
			projectId: "easy-vizag",
			storageBucket: "easy-vizag.appspot.com",
			messagingSenderId: "456795605868"
		}
};