import { Component, Inject } from '@angular/core';
import { Events, App, Platform, NavController, NavParams, AlertController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";
import { HomePage } from '../../pages/home/home';
import { OtpPage } from '../../pages/otp/otp';
import { AuthCredential } from "../../models/auth-credential.models";
import { AuthResponse } from "../../models/auth-response.models";
import { Address } from '../../models/address.models';
import { RegisterRequest } from "../../models/register-request.models";
import { RegisterResponse } from "../../models/register-response.models";

import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { AppConfig, APP_CONFIG } from '../../app/app.config';
/**
 * Generated class for the PhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/*@IonicPage()*/
@Component({
  selector: 'page-phone',
  templateUrl: 'phone.html',
  providers: [Firebase, WordpressClient]
})

export class PhonePage {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  phoneNumber: any;
  loading: any;
  loadingShown: boolean = false;
  captchanotvarified: boolean = true;
  result: any;
  buttonDisabled: any = true;
  verfificationId: any;
  otpNotsent: boolean = false;
  countries: any;
  countryCode: string = '';
  private registerRequest: RegisterRequest = new RegisterRequest('', '', '', '', '');
  private subscriptions: Array<Subscription> = [];
  private registerResponse: RegisterResponse;

  constructor(@Inject(APP_CONFIG) public config: AppConfig, public navCtrl: NavController, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public view: ViewController, private firebase: Firebase, public platform: Platform,
    public events: Events, public service: WordpressClient) {
    // this.platform.registerBackButtonAction(() => {
    //   this.makeExitAlert();
    // },1);
  }

  ionViewDidLoad() {
    console.log("Phone Page");
    this.registerRequest = JSON.parse(window.localStorage.getItem('userCreateData'));
    console.log("Previous data is:--" + JSON.stringify(this.registerRequest));
    this.checkNumber();
    this.getCountries();
  }

  getCountries() {
    this.service.getCountries().subscribe(data => {
      console.log("Countries fetched");
      this.countries = data;
      // console.log(data);
    }, err => {
      console.log(err);
    })
  }

  checkNumber() {
    if (!this.countryCode || this.countryCode == '') {
      this.buttonDisabled = true;
      this.showToast("Please select a your country first");
      this.registerRequest.username = '';
      return
    }
    this.phoneNumber = JSON.parse(JSON.stringify(this.registerRequest.username));
    if (isNaN(this.phoneNumber)) {
      this.buttonDisabled = true;
      this.showToast("Phone number is not valid");
      return
    } else if (this.phoneNumber.length > 10) {
      this.buttonDisabled = true;
      setTimeout(() => {
        this.phoneNumber = this.phoneNumber.slice(0, 10);
      }, 100);
      return
    } else if (this.phoneNumber.length == 10 && this.phoneNumber != '' && !isNaN(this.phoneNumber)) {
      this.buttonDisabled = false;
      return false;
    } else {
      this.buttonDisabled = true;
      return false;
    }
  }

  createUser() {
    if (!this.phoneNumber || this.phoneNumber == '') {
      this.buttonDisabled = true;
      this.showToast("Please enter your phone number");
      return
    }
    this.presentLoading("Checking mobile no.")
    this.registerRequest.password = Math.random().toString(36).slice(-6);
    console.log(JSON.stringify(this.registerRequest));
    let subscription: Subscription = this.service.createUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.registerRequest)
      .subscribe(data => {
        this.dismissLoading();
        this.registerResponse = data;
        this.verifyOtp();
        //user not found now we can send the sms on this number
      }, err => {
        this.showToast("Mobile no. already registered");
        this.dismissLoading();
      });
    this.subscriptions.push(subscription);
  }

  verifyOtp() {
    console.log("COuntry code is ", this.countryCode);
    window.localStorage.setItem('userCreateData', JSON.stringify(this.registerRequest));
    // this.navCtrl.setRoot(OtpPage,{})
    this.navCtrl.setRoot(OtpPage, { userId: this.registerResponse.id, dialCode: this.countryCode });
  }

  makeExitAlert() {
    const alert = this.alertCtrl.create({
      title: 'App termination',
      message: 'Do you want to close the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Close App',
        handler: () => {
          this.platform.exitApp(); // Close this application
        }
      }]
    });
    alert.present();
  }

  private presentLoading(message: string) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.onDidDismiss(() => { });

    this.loading.present();
    this.loadingShown = true;
  }

  private dismissLoading() {
    if (this.loadingShown) {
      this.loadingShown = false;
      this.loading.dismiss();
    }
  }

  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}