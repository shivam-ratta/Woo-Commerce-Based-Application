import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform, AlertController, Events, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal';

import { HomePage } from '../pages/home/home';
import { CreateaccountPage } from '../pages/createaccount/createaccount';
import { LoginPage } from '../pages/login/login';
import { CategoryPage } from '../pages/category/category';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { My_accountPage } from '../pages/my_account/my_account';
import { Myorder_1Page } from '../pages/myorder_1/myorder_1';
import { Myorder_2Page } from '../pages/myorder_2/myorder_2';
import { AddressSelectPage } from '../pages/addressselect/addressselect';
import { HelpPage } from '../pages/help/help';
import { CartPage } from '../pages/cart/cart';
import { ReviewPage } from '../pages/review/review';

import { WordpressClient } from '../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { AuthResponse } from "../models/auth-response.models";
import { AuthCredential } from "../models/auth-credential.models";
import { Constants } from "../models/constants.models";
import { Category } from "../models/category.models";
import { PaymentGateway } from "../models/payment-gateway.models";
import { ShippingLine } from "../models/shipping-line.models";
import { UserResponse } from "../models/user-response.models";
import { Currency } from "../models/currency.models";
import { APP_CONFIG, AppConfig } from './app.config';
import { MySplashPage } from '../pages/mysplash/mysplash';
import { TranslateService } from '../../node_modules/@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import firebase from 'firebase';

import { SubscriptionPage } from '../pages/subscription/subscription';
import { ServicesPage } from '../pages/services/services';

@Component({
	templateUrl: 'app.html',
	providers: [WordpressClient]
})
export class MyApp {
	deviceModel = "";
	@ViewChild(Nav) nav: Nav; 

	private subscriptions: Array<Subscription> = [];

	rootPage: any = MySplashPage;
	pages: Array<{ title: string, component: any }>;
	pageCategory: number = 1;
	categoriesAll = new Array<Category>();
	user: UserResponse;

	constructor(@Inject(APP_CONFIG) private config: AppConfig, private globalization: Globalization, private device: Device, public translate: TranslateService, private events: Events, private alertCtrl: AlertController, private service: WordpressClient, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private oneSignal: OneSignal) {
		 
		let superAuth = "";
		if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
			superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
			window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
			this.onSuperAuthSetup(superAuth);
		} else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
			let subscription: Subscription = service.getAuthToken(new AuthCredential(config.adminUsername, config.adminPassword)).subscribe(data => {
				let authResponse: AuthResponse = data;
				superAuth = ("Bearer " + authResponse.token);
				window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
				this.onSuperAuthSetup(superAuth);
			}, err => {
				console.log('auth setup error');
			});
			this.subscriptions.push(subscription);
		} else {
			console.log('auth setup error');
		}

		this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		platform.ready().then(() => {
			this.splashScreen.hide();
		  });
		this.initializeApp();
		this.listenToLoginEvents();
		platform.registerBackButtonAction(() => {
			if (this.nav.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
				this.nav.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
			} else {
			  platform.exitApp(); // IF IT'S THE ROOT, EXIT THE APP.
			}
		  });
		
	}

	listenToLoginEvents() {
		this.events.subscribe('user:login', () => {
			this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		});
	}

	onSuperAuthSetup(superAuth) {
		console.log('auth setup success: ' + superAuth);
		this.loadCategories();
		this.loadCurrency();
		this.loadPaymentGateways();
		//this.loadShippingLines();
	}

	loadCurrency() {
		let savedCurrency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
		// if (!savedCurrency) {
		let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let currency: Currency = data;
			window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
			console.log('currency setup success');
		}, err => {
			console.log('currency setup error');
		});
		this.subscriptions.push(subscription);
		// }

		// let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
		// 	let currency: Currency = data;
		// 	window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
		// 	console.log('currency setup success');
		// }, err => {
		// 	console.log('currency setup error');
		// });
		// this.subscriptions.push(subscription);
	}
	subscriptionPage () {
        if (this.nav.getActive().name != 'SubscriptionPage')
            this.nav.push(SubscriptionPage, { type: 'subscription' });
	};
	servicesPage (){
        if (this.nav.getActive().name != 'ServicesPage')
            this.nav.push(ServicesPage );

	}
    drivePage  () {
        if (this.nav.getActive().name != 'ServicesPage')
            this.nav.push(ServicesPage, { type: 'drive' });
	};
	
	houseHoldServices(){
		
        if (this.nav.getActive().name != 'ServicesPage')
            this.nav.push(ServicesPage, { type: 'House Hold Services' });
	}
    chitPage  () {
        if (this.nav.getActive().name != 'SubscriptionPage')
            this.nav.push(SubscriptionPage, { type: 'chit' });
    }; 

	loadShippingLines() {
		let subscription: Subscription = this.service.shippingLines(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let shippingLines: Array<ShippingLine> = data;
			window.localStorage.setItem(Constants.SHIPPING_LINES, JSON.stringify(shippingLines));
			console.log('shippingLines setup success');
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	loadPaymentGateways() {
		let subscription: Subscription = this.service.paymentGateways(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
			let paymentGateway: Array<PaymentGateway> = data;
			window.localStorage.setItem(Constants.PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
			console.log('payment-gateway setup success');
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);
	}

	loadCategories() {
		let subscription: Subscription = this.service.categories(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.pageCategory)).subscribe(data => {
			let categories: Array<Category> = data;
			this.categoriesAll = this.categoriesAll.concat(categories);
			window.localStorage.setItem(Constants.PRODUCT_CATEGORIES, JSON.stringify(this.categoriesAll));
			console.log('categories setup success');
			this.events.publish('category:setup');
		}, err => {
			console.log('categories setup error');
		});
		this.subscriptions.push(subscription);

		// let subscription: Subscription = this.service.categories(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.pageCategory)).subscribe(data => {
		// 	let categories: Array<Category> = data;
		// 	if (categories.length == 0) {
		// 		window.localStorage.setItem(Constants.PRODUCT_CATEGORIES, JSON.stringify(this.categoriesAll));
		// 		console.log('categories setup success');
		// 		this.events.publish('category:setup');
		// 	} else {
		// 		this.categoriesAll = this.categoriesAll.concat(categories);
		// 		this.pageCategory++;
		// 		this.loadCategories();
		// 	}
		// }, err => {
		// 	console.log('categories setup error');
		// });
		// this.subscriptions.push(subscription);
	}

	initializeApp() {
		// this language will be used as a fallback when a translation isn't found in the current language
		this.translate.setDefaultLang('en');

		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			firebase.initializeApp({
				apiKey: this.config.firebaseConfig.apiKey,
				authDomain: this.config.firebaseConfig.authDomain,
				databaseURL: this.config.firebaseConfig.databaseURL,
				projectId: this.config.firebaseConfig.projectId,
				storageBucket: this.config.firebaseConfig.storageBucket,
				messagingSenderId: this.config.firebaseConfig.messagingSenderId
			});

      try {
        if (this.device.model) {
          this.deviceModel = this.device.model.replace(/\s/g, '').replace(',', '').toLowerCase();
          
          if (this.deviceModel.indexOf("iphone103") != -1 || this.deviceModel.indexOf("iphone106") != -1 || this.deviceModel.indexOf("iphonex") != -1) {
            this.deviceModel = "iphonex";
          }
        }
      } catch (exception) {

      }

      if (this.platform.is('cordova')) {
			  this.initOneSignal();
				this.globalization.getPreferredLanguage().then(result => {
					console.log(result);
					let suitableLang = this.getSuitableLanguage(result.value);
					console.log(suitableLang);
					this.translate.use(suitableLang);
					this.setDirectionAccordingly(suitableLang);
				}).catch(e => {
					console.log(e);
					this.translate.use('en');
					this.platform.setDir('ltr', true);
				});
			} else {
				/*this.translate.use('en');
        this.setDirectionAccordingly('en');*/
					this.translate.use('en');
					this.platform.setDir('ltr', true);	
			}
		});
	}

	initOneSignal() {
		if (this.config.oneSignalAppId && this.config.oneSignalAppId.length && this.config.oneSignalGPSenderId && this.config.oneSignalGPSenderId.length) {
			this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
			this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
			this.oneSignal.handleNotificationReceived().subscribe((data) => {
				// do something when notification is received
				console.log(data);
			});
			this.oneSignal.handleNotificationOpened().subscribe((data) => {
				if (data.notification.payload
					&& data.notification.payload.additionalData) {
					this.myorder_1Page();
				}
			});
			this.oneSignal.endInit();

			this.oneSignal.getIds().then((id) => {
				if (id.userId) {
					window.localStorage.setItem(Constants.ONESIGNAL_PLAYER_ID, id.userId.toString());
				}
			});
		}
	}

	setDirectionAccordingly(lang: string) {
		switch (lang) {
			case 'ar': {
				this.platform.setDir('ltr', false);
				this.platform.setDir('rtl', true);
				break;
			}
			default: {
				this.platform.setDir('rtl', false);
				this.platform.setDir('ltr', true);
				break;
			}
		}
	}

	setDirection() {
		console.log('plat rtl: ' + this.platform.isRTL);
		if (this.platform.isRTL) {
			this.platform.setDir('rtl', true);
		} else {
			this.platform.setDir('ltr', true);
		}
	}

	getSideOfCurLang() {
		return this.platform.dir() === 'rtl' ? "right" : "left";
	}

	getSuitableLanguage(language) {
		language = language.substring(0, 2).toLowerCase();
		console.log('check for: ' + language);
		return this.config.availableLanguages.some(x => x.code == language) ? language : 'en';
	}

	actionNavHeader() {
		if (this.user) {
			if (this.nav.getActive().name != 'My_accountPage')
				this.nav.setRoot(My_accountPage);
		} else {
			if (this.nav.getActive().name != 'LoginPage')
				this.nav.push(LoginPage);
		}
	}

	addressPage() {
		if (this.nav.getActive().name != 'AddressSelectPage')
			this.nav.setRoot(AddressSelectPage);
	}

	myorder_1Page() {
		if (this.nav.getActive().name != 'Myorder_2Page')
			this.nav.setRoot(Myorder_2Page);
	}

	myorder_2Page() {
		if (this.nav.getActive().name != 'Myorder_2Page')
			this.nav.setRoot(Myorder_2Page);
	}

	my_accountPage() {
		if (this.nav.getActive().name != 'My_accountPage')
			this.nav.setRoot(My_accountPage);
	}

	categoryPage() {
		if (this.nav.getActive().name != 'CategoryPage')
			this.nav.setRoot(CategoryPage);
	}

	homePage() {
		if (this.nav.getActive().name != 'HomePage')
			this.nav.setRoot(HomePage);
	}

	reviewPage() {
		if (this.nav.getActive().name != 'ReviewPage')
			this.nav.setRoot(ReviewPage);
	}

	wishlistPage() {
		if (this.nav.getActive().name != 'WishlistPage')
			this.nav.setRoot(WishlistPage);
	}

	cartPage() {
		if (this.nav.getActive().name != 'CartPage')
			this.nav.setRoot(CartPage);
	}

	helpPage() {
		if (this.nav.getActive().name != 'HelpPage')
			this.nav.setRoot(HelpPage);
	}

	categoriesPage() {
		if (this.nav.getActive().name != 'CategoryPage')
			this.nav.setRoot(CategoryPage);
	}

	phonenumberPage() {
		this.translate.get(['logout_title', 'logout_message', 'yes', 'no']).subscribe(res => {
			let alert = this.alertCtrl.create({
				title: res.logout_title,
				message: res.logout_message,
				buttons: [{
					text: res.no,
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: res.yes,
					handler: () => {
						this.user = null;
						window.localStorage.setItem(Constants.USER_KEY, null);
						this.homePage();
					}
				}]
			});
			alert.present();
		});
	}
}
