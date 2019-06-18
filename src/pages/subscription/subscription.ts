import { Component, Inject } from '@angular/core';
import { NavController, ModalController, MenuController, Events, Platform, NavParams, ToastController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';

import { Global } from '../../providers/global';
import { App } from 'ionic-angular';

import { CategoryPage } from '../category/category';
import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { WishlistPage } from '../wishlist/wishlist';
import { ShirtsPage } from '../shirts/shirts';
import { Category } from "../../models/category.models";
import { Constants } from "../../models/constants.models";
import { CartItem } from "../../models/cart-item.models";
import { AppConfig, APP_CONFIG } from '../../app/app.config';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Banner } from '../../models/banner.models';
import { Product } from '../../models/product.models';
import { TranslateService } from '@ngx-translate/core';
import { ShippiningPage } from '../shippining/shippining';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { HomePage } from '../home/home';
import { PlacedPage } from '../placed/placed';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import {AtomPaynetz} from '../../service/AtomPaynetz';

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
  providers: [Global, WordpressClient,AtomPaynetz]
})
export class SubscriptionPage {

  loadingShown : any;
  placedPagePushed : any;
  paymentDone : any;
  paymentFailAlerted : any;
  subscriptions : any [];
  paymentGateways : any [];
  totalItems : any;
  total  : any;
  couponApplied : any;
  fileName : any;
  dlabel : any;
  ptype : any;

  name:string= '';
  phone:string = '';
  
SubscriptionBanner = [
    {
        image: "assets/imgs/Family Subscription/1.jpg"
    },
    {
        image: "assets/imgs/Family Subscription/2.jpg"
    }

];

SectionBanner = [
    {
        image: "assets/imgs/Anual family chit/1.jpg"
    },
    {
        image: "assets/imgs/Anual family chit/2.jpg"
    }
];
  constructor(@Inject(APP_CONFIG) private config: AppConfig, public translate: TranslateService,
   private events: Events, private service: WordpressClient, public modalCtrl: ModalController, public navCtrl: NavController, public menu: MenuController, private global: Global,
   private navParams:NavParams,private http:HttpClient,private toastCtrl:ToastController,
   private iab:InAppBrowser, private loadingCtrl : LoadingController, 
   private alertCtrl: AlertController,private appCtrl: App,
   private fileChooser:FileChooser,private transfer:FileTransfer,
   private filePath:FilePath,private file2:File,private actionSheetCtrl: ActionSheetController,
   private camera:Camera, private paynetz: AtomPaynetz) {
    var _this = this;
    this.config = config;
    this.translate = translate;
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.http = http;
    this.toastCtrl = toastCtrl;
    this.iab = iab;
    this.service = service;
    this.loadingCtrl = loadingCtrl;
    this.alertCtrl = alertCtrl;
    this.appCtrl = appCtrl;
    this.fileChooser = fileChooser;
    this.transfer = transfer;
    this.filePath = filePath;
    this.file2 = file2;
    this.loadingShown = false;
    this.placedPagePushed = false;
    this.paymentDone = false;
    this.paymentFailAlerted = false;
    this.subscriptions = [];
    this.paymentGateways = new Array();
    this.totalItems = 0;
    this.total = 0;
    this.couponApplied = false;
    this.fileName = '';
    this.dlabel = 'Or Upload List';
    this.ptype = this.navParams.get('type');
    if (this.ptype == 'subscription') {
        this.title = 'Family Subscription';
    }
    else {
        this.title = 'Annual Family Chit Subscription';
    }
    this.http.get('http://www.easyvizag.com/mail/slider/_api2.php?id=' + this.ptype, {})
        .subscribe(function (res) {
        console.log("success " + res);
        _this.banners = res;
    }, function (err) {
        //alert("failed");
        console.log(err);
    });
}
title:any;
banners:any;
ionViewDidLoad () {
    console.log('ionViewDidLoad ServicesPage');
};
attach:any;
fileType:any;
serviceType:any; 
email:any;
address:any;
desc :any;
dtime: any;
  
callAtom() {
    if(this.name.length == 0 || this.phone.length != 10 )
    {
        var toast = this.toastCtrl.create({
            message: 'Please enter valid name & phone number',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
        return;
    }
    let config = {
      "login": "84854",
      "pass":"c74de3f2",
      "prodid":"TAJ",
      "mode":"live",
      "reqHashKey":"bc0387a3ff92120378",
      "resHashKey":"87c54b59aa2db5032b"
    };

    let data = {
      "txnid":"4123456",
      "amt":"300",
      "txncurr":"INR",
      "udf1": this.name,
      "udf2": this.email,
      "udf3":this.phone,
      "ttype":"NBFundTransfer",
      "clientcode":"dummy",
      "date": new Date().toDateString()
    };

    this.paynetz.pay(config, data, this.send); 
  }
  chitnumber:any;
send (callbackresponse) {
    var _this = this; 
    if(this.name.length == 0 || this.phone.length != 10 )
    {
        var toast = this.toastCtrl.create({
            message: 'Please enter valid name & phone number',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
        return;
    }
    if (!this.attach) {
        console.log('working');
          
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        //this.http.post('http://www.easyvizag.com/mail/send.php', { serviceType: this.serviceType, tye: this.types, name: this.name, email: this.email, phone: this.phone, address: this.address, desc: this.desc }, httpOptions);
        this.http
        .post('http://www.easyvizag.com/mail/send2.php', 
        { serviceType: this.serviceType, name: this.name, email: this.email, phone: this.phone, address: this.address, desc: 'ChitNumber:'+ _this.chitnumber + '::::::' +  _this.desc, dtime: this.dtime, ptype: this.ptype, file: this.fileName },
        httpOptions 
        ).subscribe(function (res) {
            console.log("success " + res);
            var toast = _this.toastCtrl.create({
                message: 'Thankyou, our team will get back to you',
                duration: 3000,
                position: 'bottom'
            });
            toast.onDidDismiss(function () {
                console.log('Dismissed toast');
            });
            toast.present();
            _this.navCtrl.pop();
        }, function (err) {
            //alert("failed");
            console.log(err);
        });
    }
    else {
        var loader_1 = this.loadingCtrl.create({
            content: "Uploading attachment"
        });
        loader_1.present();
        var fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'file',
            fileName: this.fileName,
            mimeType: this.fileType
        };
        fileTransfer.upload(this.attach, 'http://www.easyvizag.com/mail/upload.php', options)
            .then(function (data) {
            loader_1.dismiss();
            console.log(data);
            var loader2 = _this.loadingCtrl.create({
                content: "Sending Data..."
            });
            loader2.present();
            console.log('working');
 
            var httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            };
             _this.http.post('http://www.easyvizag.com/mail/send2.php', { serviceType: _this.serviceType, name: _this.name, email: _this.email, phone: _this.phone, address: _this.address, desc: 'ChitNumber:'+ _this.chitnumber + ':::::: desc' +  _this.desc, dtime: _this.dtime, ptype: _this.ptype, file: _this.fileName }, httpOptions)
                .subscribe(function (res) {
                console.log("success " + res);
                var toast = _this.toastCtrl.create({
                    message: 'Thankyou, our team will get back to you',
                    duration: 3000,
                    position: 'bottom'
                });
                toast.onDidDismiss(function () {
                    console.log('Dismissed toast');
                });
                toast.present();
                loader2.dismiss();
                _this.navCtrl.pop();
            }, function (err) {
                //alert("failed");
                console.log(err);
            });
        });
    }
    
};
  paymentResCallback:any;
user:any;
initPayUMoney () {
    var _this = this;
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    var name = this.user.first_name && this.user.first_name.length ? this.user.first_name : this.user.username;
    var mobile = this.user.username;
    var email = this.user.email;
    var bookingId = String(Math.floor(Math.random() * (99 - 10 + 1) + 10));
    var productinfo = 'Family Chit Subscription';
    var salt = this.config.payuSalt;
    var key = this.config.payuKey;
    var amt = 300;
    var string = key + '|' + bookingId + '|' + amt + '|' + productinfo + '|' + name + '|' + email + '|||||||||||' + salt;
    var encrypttext = 'Object( CryptoJS.SHA512["sha512"])(string)';
    var url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&hash=" + encrypttext + "&salt=" + salt + "&key=" + key;
   // var options_2 = "{location: 'yes', clearcache: 'yes', zoom: 'yes', toolbar: 'no', closebuttoncaption: 'back' }";
    var browser = this.iab.create(url, '_blank', {location: 'yes', clearcache: 'yes', zoom: 'yes', toolbar: 'no', closebuttoncaption: 'back' });
    browser.on('loadstop').subscribe(function (event) {
        browser.executeScript({
            file: "payumoney/payumoneyPaymentGateway.js"
        });
        if (event.url == "http://localhost/success.php") {
            _this.paymentSuccess();
            browser.close();
        }
        if (event.url == "http://localhost/failure.php") {
            _this.paymentFailure();
            browser.close();
        }
    });
    browser.on('exit').subscribe(function (event) {
        if (!_this.paymentDone && !_this.paymentFailAlerted) {
            _this.paymentFailure();
        }
    });
    browser.on('loaderror').subscribe(function (event) {
        _this.translate.get('something_went_wrong').subscribe(function (value) {
            _this.showToast(value);
        });
    });
};
showToast (message) {
    var toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom'
    });
    toast.onDidDismiss(function () {
        console.log('Dismissed toast');
    });
    toast.present();
};
paymentFailure () {
    var alert = this.alertCtrl.create({
        title: 'Payment Failed',
        message: 'Your payment for family annual chit subscription failed. You can try again later.',
        buttons: [{
                text: 'Ok',
                role: 'cancel',
                handler: function () {
                    console.log('Okay clicked');
                }
            }]
    });
    alert.present();
};
loading:any;
presentLoading (message) {
    this.loading = this.loadingCtrl.create({
        content: message
    });
    this.loading.onDidDismiss(function () { });
    this.loading.present();
    this.loadingShown = true;
};
paymentSuccess () {
    this.send('d');
};
done () {
    if (!this.placedPagePushed) {
        this.placedPagePushed = true;
        this.dismissLoading();
        this.appCtrl.getRootNav().setRoot(
          this.paymentFailAlerted ? HomePage: PlacedPage);
    }
};
dismissLoading () {
    if (this.loadingShown) {
        this.loadingShown = false;
        this.loading.dismiss();
    }
};
filesPath:any;
file() {
    var _this = this;
    var actionSheet = this.actionSheetCtrl.create({
        title: 'Options',
        buttons: [
            {
                text: 'Open Camera',
                icon: 'camera',
                handler: function () {
                    var options = {
                        quality: 100,
                        destinationType: _this.camera.DestinationType.FILE_URI,
                        encodingType: _this.camera.EncodingType.JPEG,
                        mediaType: _this.camera.MediaType.PICTURE
                    };
                    var dst = Date.now();
                    _this.camera.getPicture(options).then(function (imageData) {
                        _this.fileType = 'image/jpeg';
                        _this.fileName = dst + '_image.jpeg';
                        _this.dlabel = dst + '_image.jpeg';
                        _this.attach = imageData;
                        console.log(_this.attach);
                    }, function (err) {
                        // Handle error
                    });
                }
            }, {
                text: 'Choose a File',
                icon: 'document',
                handler: function () {
                    _this.fileChooser.open()
                        .then(function (uri) {
                        console.log(uri);
                        _this.filePath.resolveNativePath(uri).then(function (filePath) {
                            _this.filesPath = filePath;
                            _this.file2.resolveLocalFilesystemUrl(filePath).then(function (fileInfo:any) {
                                var files = fileInfo;
                                files.file(function (success) {
                                    _this.fileType = success.type;
                                    _this.fileName = success.name;
                                    _this.dlabel = success.name;
                                    _this.attach = uri;
                                    console.log(_this.fileName);
                                    console.log(_this.fileType);
                                });
                            }, function (err) {
                                console.log(err);
                                throw err;
                            });
                        }, function (err) {
                            console.log(err);
                            throw err;
                        });
                    })
                        .catch(function (e) { return console.log(e); });
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
                icon: 'exit',
                handler: function () {
                    console.log('Cancel clicked');
                }
            }
        ]
    });
    actionSheet.present();
};
}
