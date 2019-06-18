import { WordpressClient } from './../../providers/wordpress-client.service';
import { Component } from '@angular/core';
import { Events, App, Platform, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';

import { HomePage } from '../home/home';

import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";

import { Subscription } from "rxjs/Subscription";

import { AuthResponse } from "../../models/auth-response.models";
import { RegisterRequest } from "../../models/register-request.models";
import { AuthCredential } from "../../models/auth-credential.models";

@Component({
  selector: 'page-otp ',
  templateUrl: 'otp.html',
  providers: [Firebase, WordpressClient]
})

export class OtpPage {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  loading: any;
  loadingShown: boolean = false;
  captchanotvarified: boolean = true;
  result: any;
  buttonDisabled: any = true;
  otp: any = '';
  component: any;
  captchaVerified: boolean = false;
  verfificationId: any;
  timer: any;
  minutes: number = 0;
  seconds: number = 0;
  totalSeconds: number = 0;
  intervalCalled: boolean = false;
  private registerRequest: RegisterRequest = new RegisterRequest('', '', '', '', '');
  private subscriptions: Array<Subscription> = [];
  dialCode: string;
  resendCode: boolean = false;
  otpNotSent: boolean = true;
  constructor(public params: NavParams, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public navCtrl: NavController, private firebase: Firebase, public platform: Platform,
    public service: WordpressClient, public events: Events) {
    console.log('UserId is  ', params.get('userId'));
    console.log('Dial Code code is  ', params.get('dialCode'));
    // this.platform.registerBackButtonAction(() => {
    //   this.makeExitAlert();
    //   //sometimes the best thing you can do is not think, not wonder, not imagine, not obsess. 
    //   //just breathe, and have faith that everything will work out for the best.
    // },1);
  }

  ionViewDidLoad() {
    this.dialCode = this.params.get('dialCode');
    this.registerRequest = JSON.parse(window.localStorage.getItem('userCreateData'));
    console.log("Previous data is:--", JSON.stringify(this.registerRequest));
    if (!(this.platform.is('cordova'))) {
      this.makeCaptcha();
    }
    console.log("Country code is ", this.dialCode);
    console.log("Phone no. is " + this.registerRequest.username);
    this.sendOTP();
  }

  sendOTP() {
    this.resendCode = false;
    this.otpNotSent = true;
    const phoneNumberString = "+" + this.dialCode + this.registerRequest.username;
    console.log("phone no. is " + this.registerRequest.username);
    if (this.platform.is('cordova')) {
      this.sendOtpPhone(phoneNumberString);
    } else {
      this.sendOtpBrowser(phoneNumberString);
    }
    if (this.intervalCalled) {
      clearInterval(this.timer);
    }
  }

  createTimer() {
    this.intervalCalled = true;
    this.totalSeconds--;
    if (this.totalSeconds == 0) {
      this.otpNotSent = true;
      this.resendCode = true;
      clearInterval(this.timer);
    } else {
      this.seconds = (this.totalSeconds % 60);
      if (this.totalSeconds >= this.seconds) {
        this.minutes = (this.totalSeconds - this.seconds) / 60
      } else {
        this.minutes = 0;
      }
    }
  }

  createInterval() {
    this.totalSeconds = 120;
    this.createTimer();
    this.timer = setInterval(() => {
      this.createTimer();
    }, 1000);
  }

  sendOtpPhone(phone) {
    this.presentLoading("Sending OTP by SMS");
    console.log("In cordova");
    this.firebase.verifyPhoneNumber(phone, 60)
      .then((credential) => {
        console.log("credentials:-----");
        console.log(JSON.stringify(credential));
        this.verfificationId = credential.verificationId;
        this.showToast("OTP sent on your mobile");
        this.otpNotSent = false;
        this.dismissLoading();
        this.createInterval();
      });
  }

  sendOtpBrowser(phone) {
    this.dismissLoading();
    const component = this;
    component.presentLoading("Sending OTP by SMS");
    console.log("In not cordova");
    firebase.auth().signInWithPhoneNumber(phone, this.recaptchaVerifier)
      .then((confirmationResult) => {
        component.otpNotSent = false;
        component.result = confirmationResult;
        component.dismissLoading();
        component.showToast("OTP sent on your mobile");
        if (component.intervalCalled) {
          clearInterval(component.timer);
        }
        component.createInterval();
      })
      .catch(function (error) {
        component.resendCode = true;
        component.dismissLoading();
        if (error.message) {
          component.showToast(error.message);
        } else {
          component.showToast("SMS not sent");
        }
        console.log("SMS not sent " + JSON.stringify(error));
      });
  }

  verify() {
    this.otpNotSent = true;
    if (this.platform.is('cordova')) {
      this.verifyOtpPhone();
    } else {
      this.verifyOtpBrowser();
    }
  }

  verifyOtpPhone() {
    console.log("Verifying phone in cordova");
    const credential = firebase.auth.PhoneAuthProvider.credential(this.verfificationId, this.otp);
    console.log("Fetched the credential");
    this.presentLoading("Verifying OTP by SMS");
    firebase.auth().signInAndRetrieveDataWithCredential(credential)
      .then((info) => {
        console.log(JSON.stringify(info));
        this.dismissLoading();
        this.showToast("OTP verified");
        this.signIn();
      }, (error) => {
        if (error.message) {
          this.showToast(error.message);
        } else {
          this.showToast("Wrong OTP");
        }
        this.dismissLoading();
        console.log(JSON.stringify(error));
      })
  }

  verifyOtpBrowser() {
    const component = this;
    console.log("Confimation result:---" + JSON.stringify(component.result));
    component.presentLoading("Verifying OTP by SMS");
    this.result.confirm(this.otp)
      .then(function (response) {
        component.dismissLoading();
        component.showToast("OTP verified");
        component.signIn();
      }).catch(function (error) {
        if (error.message) {
          component.showToast(error.message);
        } else {
          component.showToast("Wrong OTP");
        }
        component.dismissLoading();
      });
  }

  makeCaptcha() {
    const component = this;
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      // 'size': 'normal',
      'size': 'invisible',
      'callback': function (response) {

        component.captchanotvarified = true;
        console.log("captchanotvarified:--" + component.captchanotvarified);
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    this.recaptchaVerifier.render();
  }

  private signIn() {
    console.log("User id ", this.params.get("userId"));
    console.log("username is ", this.registerRequest.username);
    console.log("Password is ", this.registerRequest.password);
    this.presentLoading("Please wait . . .");
    let credentials: AuthCredential = new AuthCredential(this.registerRequest.username, this.registerRequest.password);
    let subscription: Subscription = this.service.getAuthToken(credentials)
      .subscribe(data => {
        let authResponse: AuthResponse = data;
        window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
        this.getUser(this.params.get("userId"));
      }, err => {
        this.dismissLoading();
        this.presentErrorAlert("Unable to login with provided credentials");
      });
    this.subscriptions.push(subscription);
  }

  private getUser(userId: string) {
    let subscription: Subscription = this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId)
      .subscribe(data => {
        this.dismissLoading();
        let userResponse: UserResponse = data;
        window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
        window.localStorage.removeItem("userCreateData");
        this.navCtrl.setRoot(HomePage);
        this.events.publish('user:login');
      }, err => {
        this.dismissLoading();
        this.presentErrorAlert("Unable to login with provided credentials");
      });
    this.subscriptions.push(subscription);
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

  private presentErrorAlert(msg: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
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
}
