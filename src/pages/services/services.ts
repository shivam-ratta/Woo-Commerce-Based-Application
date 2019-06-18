import { Component, Inject } from '@angular/core';
import { NavController, ModalController, MenuController, Events, Platform, NavParams, ToastController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';

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
import { Camera } from '@ionic-native/camera';
/**
 * Generated class for the ServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-services',
    templateUrl: 'services.html',
})
export class ServicesPage {
    ttypes: any[];
    ifVehicle: any;
    vactivated: any;
    dtime: any;
    directDrive: any;
    fileName: any;
    dlabel: any;
    ptype: any;
    title: any;
    serviceType: any;
    banners: any;
    HouseHoldBanners = [
        {
            image: "assets/imgs/House Hold Services/1.jpg"
        },
        {
            image: "assets/imgs/House Hold Services/2.jpg"
        }
    ];
    RealEstatebanners = [
        {
            image: "assets/imgs/RealEstate/1.jpg"
        },
        {
            image: "assets/imgs/RealEstate/2.jpg"
        }
    ];

    SelfDriveVehiclesBanners = [
        {
            image: "assets/imgs/Self Drive Vehicles/1.jpg"
        },
        {
            image: "assets/imgs/Self Drive Vehicles/2.jpg"
        }
    ];
    WeddingEventsBanners = [
        {
            image: "assets/imgs/Wedding & Events/1.jpg"
        },
        {
            image: "assets/imgs/Wedding & Events/2.jpg"
        }
    ];

    CarServiceBanners = [
        {
            image: "assets/imgs/Car Servicing & repairs/1.jpg"
        },
        {
            image: "assets/imgs/Car Servicing & repairs/2.jpg"
        }
    ];
    dlabel2: any;
    ExtraService: any;
    constructor(@Inject(APP_CONFIG) private config: AppConfig, public translate: TranslateService,
        private events: Events, private service: WordpressClient, public modalCtrl: ModalController, public navCtrl: NavController, public menu: MenuController,
        private navParams: NavParams, private http: HttpClient, private toastCtrl: ToastController,
        private iab: InAppBrowser, private loadingCtrl: LoadingController,
        private alertCtrl: AlertController, private appCtrl: App,
        private fileChooser: FileChooser, private transfer: FileTransfer,
        private filePath: FilePath, private file2: File, private actionSheetCtrl: ActionSheetController, private camera: Camera) {
        var _this = this;
        this.config = config;
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.toastCtrl = toastCtrl;
        this.fileChooser = fileChooser;
        this.transfer = transfer;
        this.loadingCtrl = loadingCtrl;
        this.filePath = filePath;
        this.file2 = file2;
        this.ttypes = [];
        this.ifVehicle = false;
        this.vactivated = 'NO';
        this.dtime = '';
        this.directDrive = false;
        this.fileName = '';
        this.dlabel = 'Driving License Copy';
        this.ptype = this.navParams.get('type');
        this.carServices = false;
        this.dlabel2 = 'Delivery Date & Time';
        if (this.ptype == 'drive') {
            this.title = 'Self Drive Vehicles';
            this.ifVehicle = true;
            this.vactivated = 'YES';
            this.serviceType = 'Self Drive Vehicles';
            this.http.get('http://www.easyvizag.com/mail/slider/_api2.php?id=' + this.ptype, {})
                .subscribe(function (res) {
                    console.log("success " + res);
                    _this.banners = res;
                    _this.directDrive = true;
                }, function (err) {
                    //alert("failed");
                    console.log(err);
                });
            this.ttypes = [];
            this.ttypes = [
                { name: 'Maruthi Swift' }, { name: 'Maruthi Swift AT' }, { name: 'E2O plus' }, { name: 'Nexon AT' },
                { name: 'Ford Figo' }, { name: 'Hyundai Creta' }, { name: 'Creta Veteran' }, { name: 'Ford Eco Sport' }, { name: 'Verna' }, { name: 'Baleno' }, { name: ' Brezza' }, { name: 'Brezza veteran' }, { name: 'Hyundai i20 Elite' }, { name: ' i20 Veteran' },
                { name: 'figo veteran' }, { name: 'Tata tiago' }, { name: 'Tiago veteran' }, { name: 'Mahindra XUV' }, { name: 'Mahindra XUV AT' }
            ];
            this.household = false;
        } else if (this.ptype == 'Real Estate') {
            this.ttypes = [];
            this.ifVehicle = false;
            this.serviceType = 'Real Estate';
            this.household = false;
            this.carServices = false;
            this.realEstate = true;
            this.dlabel = 'Upload or take picture';
            this.dlabel2 = 'Visit Date & Time';
            this.ttypes = [
                {
                    name: '1 BHK'
                }, {
                    name: '2BHK'
                }, {
                    name: '3BHK'
                }, {
                    name: 'Individual houses'
                }, {
                    name: 'Villas'
                }, {
                    name: 'Duplex Houses'
                }
            ];
        }
        else if (this.ptype == 'wedding') {
            this.ttypes = [];
            this.ifVehicle = false;
            this.serviceType = 'wedding';
            this.ttypes = [
                {
                    name: 'Makeup and Hairstyling'
                },
                {
                    name: 'Wedding & Event Photography'
                },
                {
                    name: 'Pre-wedding shoot'
                },
                {
                    name: 'Wedding & Functions Venues'
                },
                {
                    name: 'Events & Party Decorations'
                },
                {
                    name: 'Food & Catering'
                },
                {
                    name: 'Mehindi Artists'
                },
                {
                    name: 'Astrologer or pandit services'
                },
                {
                    name: 'Party Organisers'
                }
            ];
            this.household = false;
        }
        else if (this.ptype == 'House Hold Services') {
            this.ttypes = [];
            this.ifVehicle = false;
            this.serviceType = 'House Hold Services';
            this.household = true;
            this.dlabel = "Upload or take photo"
            this.ttypes = [
                {
                    name: 'Mobile & Computer Services'
                },
                {
                    name: 'Appliances Services & Repair'
                },
                {
                    name: 'Plumber'
                },
                {
                    name: 'Carpenter'
                },
                {
                    name: 'Electrician'
                },
                {
                    name: 'Home Cleaning'
                },
                {
                    name: 'Pest Control'
                },
                {
                    name: 'Painting & Renovations'
                },
                {
                    name: 'Packers & Moovers'
                },
                {
                    name: 'Home Tutions'
                }
            ];
        }
        else if (this.ptype == 'Car Services & Repairs') {
            this.ttypes = [];
            this.ifVehicle = false;
            this.serviceType = 'Car Services & Repairs';
            this.household = false;
            this.carServices = true;
            this.dlabel = 'Upload or take picture';
            this.ttypes = [
                {
                    name: 'Painting & Denting'
                },
                {
                    name: '360 Checkup'
                },
                {
                    name: 'Engine Oil Change'
                },
                {
                    name: 'Car Cleaning'
                },
                {
                    name: 'Mechaninc Work'
                },
                {
                    name: 'Water Wash'
                },
                {
                    name: 'Wheel Allignment'
                },
                {
                    name: 'Car Electrical Work'
                },
                {
                    name: 'AC Repair '
                },
                {
                    name: 'Car Accessories'
                },
                {
                    name: 'Other Works'
                }
            ];
        }
    }
    carServices: any;
    ionViewDidLoad() {
        console.log('ionViewDidLoad ServicesPage');
        if (this.navParams.get('type') !== 'drive' && this.navParams.get('type') !== 'wedding' && this.ptype !== 'House Hold Services' && !this.carServices && !this.realEstate) {

            this.ttypes = [
                {
                    name: 'Events & Catering'
                },
                {
                    name: 'Laundry & Home Cleaning'
                },
                {
                    name: 'Electrical Services'
                },
                {
                    name: 'Painting & Renovations'
                },
                {
                    name: 'Construction Services'
                },
                {
                    name: 'Plumbing'
                },
                {
                    name: 'Medical Assistance'
                }
            ];
        }
    };
    household: any;
    onSelectChange(selectedValue) {
        console.log('Selected', selectedValue);
        this.carServices = false;
        this.household = false;
        this.ttypes = [];
        if (selectedValue == 'Self Drive Vehicles') {
            this.ifVehicle = true;
            this.vactivated = 'YES';
            this.ttypes = [];
            this.household = false;
            this.ttypes = [

                {
                    name: 'Maruthi Swift'
                },
                {
                    name: 'Maruthi Swift AT'
                }, {
                    name: 'E2O plus'
                }, {
                    name: 'Nexon AT'
                }, {
                    name: 'Ford Figo'
                }, {
                    name: 'Hyundai Creta'
                }, {
                    name: 'Creta Veteran'
                }, {
                    name: 'Ford Eco Sport'
                }, {
                    name: 'Verna'
                }, {
                    name: 'Baleno'
                }, {
                    name: 'Brezza'
                }, {
                    name: 'Brezza veteran'
                }, {
                    name: 'Hyundai i20 Elite'
                }, {
                    name: 'i20 Veteran'
                }, {
                    name: 'figo'
                }, {
                    name: 'veteran'
                }, {
                    name: 'Tata tiago'
                }, {
                    name: 'Tiago veteran'
                }, {
                    name: 'Mahindra XUV'
                }, {
                    name: 'Mahindra XUV AT'

                }

            ];
        }
        else if (selectedValue == 'House Hold Services') {
            this.ttypes = [];
            this.ifVehicle = false;
            this.household = true;
            this.dlabel = 'Upload or take picture';
            this.serviceType = 'House Hold Services';
            this.ttypes = [
                {
                    name: 'Mobile & Computer Services'
                },
                {
                    name: 'Appliances Services & Repair'
                },
                {
                    name: 'Plumber'
                },
                {
                    name: 'Carpenter'
                },
                {
                    name: 'Electrician'
                },
                {
                    name: 'Home Cleaning'
                },
                {
                    name: 'Pest Control'
                },
                {
                    name: 'Painting & Renovations'
                },
                {
                    name: 'Packers & Moovers'
                },
                {
                    name: 'Home Tutions'
                }
            ];

        }
        else if (selectedValue == 'Real Estate') {
            this.ttypes = [];
            this.ifVehicle = false;
            this.serviceType = 'Real Estate';
            this.household = false;
            this.carServices = false;
            this.realEstate = true;
            this.dlabel = 'Upload or take picture';
            this.ttypes = [
                {
                    name: '1 BHK'
                }, {
                    name: '2BHK'
                }, {
                    name: '3BHK'
                }, {
                    name: 'Individual houses'
                }, {
                    name: 'Villas'
                }, {
                    name: 'Duplex Houses'
                }
            ];
        }
        else if (selectedValue == 'Car Services & Repairs') {
            this.ttypes = [];
            this.ifVehicle = false;
            this.serviceType = 'Car Services & Repairs';
            this.household = false;
            this.carServices = true;
            this.dlabel = 'Upload or take picture';
            this.ttypes = [
                {
                    name: 'Painting & Denting'
                },
                {
                    name: '360 Checkup'
                },
                {
                    name: 'Engine Oil Change'
                },
                {
                    name: 'Car Cleaning'
                },
                {
                    name: 'Mechaninc Work'
                },
                {
                    name: 'Water Wash'
                },
                {
                    name: 'Wheel Allignment'
                },
                {
                    name: 'Car Electrical Work'
                },
                {
                    name: 'AC Repair '
                },
                {
                    name: 'Car Accessories'
                },
                {
                    name: 'Other Works'
                }
            ];
        }

        else {
            this.ifVehicle = false;
            this.household = false;
            this.vactivated = 'NO';
            this.ttypes = [];
            this.ttypes = [
                {
                    name: 'Events & Catering'
                },
                {
                    name: 'Laundry & Home Cleaning'
                },
                {
                    name: 'Electrical Services'
                },
                {
                    name: 'Painting & Renovations'
                },
                {
                    name: 'Construction Services'
                },
                {
                    name: 'Plumbing'
                },
                {
                    name: 'Medical Assistance'
                }
            ];
        }
    };
    realEstate: any;
    attach: any;
    fileType: any;

    types: any;
    name: string = '';
    email: any;
    phone: string = '';
    address: any;
    desc: any;
    vpickup: any;
    vdrop: any;
    send() {
        var _this = this;

        if (this.name.length == 0 || this.phone.length != 10) {
            var toast = this.toastCtrl.create({
                message: 'Please enter valid name & phone number',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
            return;
        }
        if (!this.attach && this.ptype != 'wedding' && this.ptype != 'Real Estate') {
            var toast = this.toastCtrl.create({
                message: 'Please attach your driving license',
                duration: 3000,
                position: 'bottom'
            });
            toast.onDidDismiss(function () {
                console.log('Dismissed toast');
            });
            toast.present();
        }
        else {
            if (this.ptype == 'wedding' || this.ptype == 'Real Estate') {
                console.log('working');
                 
                var httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                    })
                };
                _this.http.post('http://www.easyvizag.com/mail/send.php', { serviceType: _this.serviceType, type: _this.types, name: _this.name, email: _this.email, phone: _this.phone, address: _this.address, desc: _this.desc, vactivated: _this.vactivated, vpickup: _this.vpickup, vdrop: _this.vdrop, dtime: _this.dtime, file: _this.fileName }, httpOptions)
                    .subscribe(function (res) {

                        console.log("success ", res);
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
                    }, function (err) { });
                //alert("failed");

            } else {
                console.log('working');
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
                        var httpOptions = {
                            headers: new HttpHeaders({
                                'Content-Type': 'application/json',
                            })
                        };
                        //this.http.post('http://www.easyvizag.com/mail/send.php', { serviceType: this.serviceType, tye: this.types, name: this.name, email: this.email, phone: this.phone, address: this.address, desc: this.desc }, httpOptions);
                        _this.http.post('http://www.easyvizag.com/mail/send.php', { serviceType: _this.serviceType, type: _this.types, name: _this.name, email: _this.email, phone: _this.phone, address: _this.address, desc: _this.desc, vactivated: _this.vactivated, vpickup: _this.vpickup, vdrop: _this.vdrop, dtime: _this.dtime, file: _this.fileName }, httpOptions)
                            .subscribe(function (res) {
                                loader2.dismiss();
                                console.log("success ", res);
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
                                loader2.dismiss();
                                console.log(err);
                            });
                    });

            }

        }
    };
    filesPath: any;
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
                        _this.camera.getPicture(options).then(function (imageData) {
                            _this.fileType = 'image/jpeg';
                            _this.fileName = Date.now() + '_image.jpeg';
                            _this.dlabel = Date.now() + '_image.jpeg';
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
                                    _this.file2.resolveLocalFilesystemUrl(filePath).then(function (fileInfo: any) {
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
