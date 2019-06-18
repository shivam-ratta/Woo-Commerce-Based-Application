import { Component, Inject } from '@angular/core';
import { NavController, AlertController, Loading, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { Global } from '../../providers/global';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";

import { SearchPage } from '../search/search';
import { CartPage } from '../cart/cart';
import { ShippiningPage } from '../shippining/shippining';
import { Product } from "../../models/product.models";
import { Review } from "../../models/review.models";
import { Currency } from "../../models/currency.models";
import { Constants } from "../../models/constants.models";
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoginPage } from '../login/login';
import { UserResponse } from '../../models/user-response.models';
import { Image } from '../../models/image.models';
import { AppConfig, APP_CONFIG } from '../../app/app.config';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-itemdetail ',
	templateUrl: 'itemdetail.html',
	providers: [WordpressClient, Global]
})

export class ItemdetailPage {
	private loading: Loading;
	private loadingShown: Boolean = false;

	private related :any[];
	private subscriptions: Array<Subscription> = [];
	private product: Product;
	private details: boolean = false;
	private reviews: Array<Review>;
	private productsResponse = new Array<Product>();
	private productVariations = new Array<Product>();
	private imageToDisplay: string;
	private currencyIcon: string;
	private currencyText: string;
	private cartTotal = 0;

	constructor(@Inject(APP_CONFIG) private config: AppConfig, public translate: TranslateService, private socialSharing: SocialSharing, public navCtrl: NavController, private toastCtrl: ToastController, public modalCtrl: ModalController, private global: Global, private navParams: NavParams, private service: WordpressClient, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
		let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
		if (currency) {
			this.currencyText = currency.value;
			let iconText = currency.options[currency.value];
			this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
		}
		this.product = this.navParams.get('pro');
		if (this.product) {
			this.product.favorite = global.isFavorite(this.product);
			let productsResponse: Array<Product> = this.navParams.get('pros');
			for (let pro of productsResponse) {
				if (pro.id != this.product.id) {
					pro.favorite = global.isFavorite(pro);
					this.productsResponse.push(pro);
				}
			}
			if (this.product.images && this.product.images.length) {
				this.imageToDisplay = this.product.images[0].src;
			}
			if (this.product.type == 'variable') {
				this.loadVariations();
			}
			this.loadReviews();
			this.loadProducts();
		} else {
			this.loadProductById(this.navParams.get('pro_id'));
		}
	}

	ionViewWillLeave() {
		this.subscriptions.forEach((subscription: Subscription) => {
			subscription.unsubscribe();
		});
		this.dismissLoading();
	}

	ionViewDidEnter() {
		this.cartTotal = Number(this.global.getCartItemsCount());
	}
	loadProducts = function () {
        var _this = this;
        console.log(this.product.categories[0]['id']);
		var subscription = this.service.
		productsByCategory(window.localStorage.getItem(Constants.ADMIN_API_KEY), 
		this.product.categories[0]['id'], 
		String(this.productsAllPage)).subscribe(function (data) {
            //this.dismissLoading();
            console.log(_this.product.categories[0]['id']);
            var products = data;
            _this.productsResponse = products;
            var proSplit = new Array();
            for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
                var pro = products_1[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (proSplit.length == 2) {
                    _this.related.push(proSplit);
                    proSplit = new Array();
                }
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + ' ' + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + ' ' + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + ' ' + pro.sale_price;
                }
                pro.favorite = _this.global.isFavorite(pro);
                proSplit.push(pro);
            }
            if (proSplit.length > 0) {
                _this.related.push(proSplit);
            }
            _this.related = _this.related;
            console.log(_this.related);
        }, function (err) {
            //this.dismissLoading();
        });
        //this.subscriptions.push(subscription);
    };
	loadProductById(proId) {
		this.translate.get('loading_product').subscribe(value => {
			this.presentLoading(value);
		});
		let subscription: Subscription = this.service.productById(window.localStorage.getItem(Constants.ADMIN_API_KEY), proId).subscribe(data => {
			this.product = data;
			this.product.favorite = this.global.isFavorite(this.product);
			if (this.product.images && this.product.images.length) {
				this.imageToDisplay = this.product.images[0].src;
			}
			if (this.currencyIcon) {
				this.product.regular_price_html = this.currencyIcon + ' ' + this.product.regular_price;
				this.product.sale_price_html = this.currencyIcon + ' ' + this.product.sale_price;
			} else if (this.currencyText) {
				this.product.regular_price_html = this.currencyText + ' ' + this.product.regular_price;
				this.product.sale_price_html = this.currencyText + ' ' + this.product.sale_price;
			}
			if (this.product.sale_price_html.length == 0) {
				this.product.sale_price_html = this.product.regular_price_html;
			}
			this.loadReviews();
			this.dismissLoading();
			if (this.product.type == 'variable') {
				this.loadVariations();
			}
		}, err => {
			this.dismissLoading();
		});
		this.subscriptions.push(subscription);
	}

	loadVariations() {
		this.translate.get('loading_variations').subscribe(value => {
			this.presentLoading(value);
		});
		let subscription: Subscription = this.service.productVariations(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.product.id).subscribe(data => {
			let variations: Array<Product> = data;
			for (let vari of variations) {
				let variAttris = '';
				for (let i = 0; i < vari.attributes.length; i++) {
					let attri = vari.attributes[i].name + ' ' + vari.attributes[i].option + (i < vari.attributes.length - 1 ? ', ' : '');
					variAttris = variAttris + attri;
				}

				vari.name = this.product.name + ' - ' + variAttris;
				vari.type = 'variable';
				vari.images = new Array<Image>();
				vari.images.push(vari.image);

				if (!vari.sale_price) {
					vari.sale_price = vari.regular_price;
				}
				if (this.currencyIcon) {
					vari.regular_price_html = this.currencyIcon + ' ' + vari.regular_price;
					vari.sale_price_html = this.currencyIcon + ' ' + vari.sale_price;
				} else if (this.currencyText) {
					vari.regular_price_html = this.currencyText + ' ' + vari.regular_price;
					vari.sale_price_html = this.currencyText + ' ' + vari.sale_price;
				}
			}
			this.productVariations = variations;
			this.dismissLoading();
		}, err => {
		});
		this.subscriptions.push(subscription);
	}

	showImage(src) {
		this.imageToDisplay = src;
	}

	loadReviews() {
		let subscription: Subscription = this.service.productsReviews(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.product.id).subscribe(data => {
			let reviews: Array<Review> = data;
			let approved = new Array<Review>();
			for (let rev of reviews) {
				if (rev.verified) {
					approved.push(rev);
				}
			}
			this.reviews = approved;
		}, err => {
		});
		this.subscriptions.push(subscription);
	}

	itemdetailPage(pro) {
		this.navCtrl.push(ItemdetailPage, { pro: pro, pros: this.productsResponse });
	}

	viewMore() {
		this.details = true;
	}

	viewLess() {
		this.details = false;
	}

	toggleFavorite(pro) {
		pro.favorite = this.global.toggleFavorite(pro);
	}

	shareProduct(pro) {
		this.socialSharing.share('Found this product on ' + this.config.appName, pro.name, null, pro.permalink).then((data) => {
			console.log(data);
		}).catch((err) => {
			console.log(err);
		});
	}

	addToCart() {
		if (this.product.in_stock && this.product.purchasable) {
			let added: boolean = this.global.addCartItem(this.product);
			if (added) {
				this.cartTotal = this.cartTotal + 1;
			}
			this.translate.get(added ? 'item_added' : 'item_updated').subscribe(value => {
				this.showToast(value);
			});
		} else {
			this.translate.get('item_unavailable').subscribe(value => {
				this.showToast(value);
			});
		}
	}

	buyNow() {
		let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		if (user != null) {
			this.navCtrl.push(ShippiningPage, { pro: this.product });
		} else {
			window.localStorage.setItem(Constants.TEMP_OPEN, Constants.TEMP_OPEN_PRODUCT);
			window.localStorage.setItem(Constants.TEMP_OPEN_PRODUCT, JSON.stringify(this.product));
			this.translate.get('auth_required').subscribe(value => {
				this.showToast(value);
			});
			this.navCtrl.push(LoginPage);
		}
	}

	buyVariation(variation) {
		let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
		if (user != null) {
			this.navCtrl.push(ShippiningPage, { pro: variation });
		} else {
			window.localStorage.setItem(Constants.TEMP_OPEN, Constants.TEMP_OPEN_PRODUCT);
			window.localStorage.setItem(Constants.TEMP_OPEN_PRODUCT, JSON.stringify(variation));
			this.translate.get('auth_required').subscribe(value => {
				this.showToast(value);
			});
			this.navCtrl.push(LoginPage);
		}
	}

	addVariation(variation) {
		if (variation.in_stock && variation.purchasable) {
			let added: boolean = this.global.addCartItem(variation);
			if (added) {
				this.cartTotal = this.cartTotal + 1;
			}
			this.translate.get(added ? 'item_added' : 'item_updated').subscribe(value => {
				this.showToast(value);
			});
		} else {
			this.translate.get('item_unavailable').subscribe(value => {
				this.showToast(value);
			});
		}
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

	private presentErrorAlert(msg: string) {
		let alert = this.alertCtrl.create({
			title: 'Error',
			subTitle: msg,
			buttons: ['Dismiss']
		});
		alert.present();
	}

	showToast(message: string) {
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

	cartPage() {
		let modal = this.modalCtrl.create(CartPage);
		modal.onDidDismiss(() => {
			this.cartTotal = Number(this.global.getCartItemsCount());
		});
		modal.present();
	}

	searchPage() {
		let modal = this.modalCtrl.create(SearchPage);
		modal.present();
	}
}
