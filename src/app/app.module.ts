import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Globalization } from '@ionic-native/globalization';
import { Device } from '@ionic-native/device';

import { APP_CONFIG, BaseAppConfig } from "./app.config";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PhonenumberPage } from '../pages/phonenumber/phonenumber';
import { PasswordPage } from '../pages/password/password';
import { VerificationPage } from '../pages/verification/verification';
import { CreateaccountPage } from '../pages/createaccount/createaccount';
import { CategoryPage } from '../pages/category/category';
import { VegetablePage } from '../pages/vegetable/vegetable';
import { ItemdetailPage } from '../pages/itemdetail/itemdetail';
import { ShippiningPage } from '../pages/shippining/shippining';
import { PaymentPage } from '../pages/payment/payment';
import { CodePage } from '../pages/code/code';
import { PlacedPage } from '../pages/placed/placed';
import { WishlistPage } from '../pages/wishlist/wishlist';
import { My_accountPage } from '../pages/my_account/my_account';
import { Myorder_1Page } from '../pages/myorder_1/myorder_1';
import { HelpPage } from '../pages/help/help';
import { CartPage } from '../pages/cart/cart';
import { ReviewPage } from '../pages/review/review';
import { ShortPage } from '../pages/short/short';
import { SearchPage } from '../pages/search/search';
import { FilterPage } from '../pages/filter/filter';
import { LocationPage } from '../pages/location/location';
import { Myorder_2Page } from '../pages/myorder_2/myorder_2';
import { ListPage } from '../pages/list/list';
import { ShirtsPage } from '../pages/shirts/shirts';
import { LoginPage } from '../pages/login/login';
import { AddressPage } from '../pages/address/address';
import { PayPal } from '@ionic-native/paypal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AddressSelectPage } from '../pages/addressselect/addressselect';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MySplashPage } from '../pages/mysplash/mysplash';
import { OtpPage } from '../pages/otp/otp';
import { PhonePage } from '../pages/phone/phone';
import { OneSignal } from '@ionic-native/onesignal';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Firebase } from '@ionic-native/firebase';

import { Camera } from '@ionic-native/camera';

import { File } from '@ionic-native/file';
import { SubscriptionPage } from '../pages/subscription/subscription';
import { ServicesPage } from '../pages/services/services';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PhonenumberPage,
    PasswordPage,
    VerificationPage,
    CreateaccountPage,
    CategoryPage,
    VegetablePage,
    ItemdetailPage,
    ShippiningPage,
    PaymentPage,
    PlacedPage,
    WishlistPage,
    My_accountPage,
    CodePage,
    Myorder_1Page,
    HelpPage,
    CartPage,
    ReviewPage,
    ShortPage,
    SearchPage,
    FilterPage,
    LocationPage,
    Myorder_2Page,
    ListPage,
    ShirtsPage,
    LoginPage,
    AddressPage,
    AddressSelectPage,
    MySplashPage,
    PhonePage,
    OtpPage,
    SubscriptionPage,
    ServicesPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PhonenumberPage,
    PasswordPage,
    VerificationPage,
    CreateaccountPage,
    CategoryPage,
    VegetablePage,
    ItemdetailPage,
    ShippiningPage,
    PaymentPage,
    PlacedPage,
    WishlistPage,
    My_accountPage,
    CodePage,
    Myorder_1Page,
    HelpPage,
    CartPage,
    ReviewPage,
    ShortPage,
    SearchPage,
    FilterPage,
    LocationPage,
    Myorder_2Page,
    ListPage,
    ShirtsPage,
    LoginPage,
    AddressPage,
    AddressSelectPage,
    MySplashPage,
    PhonePage,
    OtpPage,
    SubscriptionPage,
    ServicesPage

  ],
  providers: [
    Device,
    StatusBar,
    SplashScreen,
    PayPal,
    InAppBrowser,
    SocialSharing,
    Globalization,
    OneSignal,
    FileChooser,
    FileTransfer,
    FileTransferObject,
    FilePath, File, Firebase, Camera, GooglePlus, Facebook,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }