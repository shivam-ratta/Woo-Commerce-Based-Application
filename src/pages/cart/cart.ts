import { Component } from '@angular/core';
import { NavController, ViewController, ToastController, App } from 'ionic-angular';
import { Global } from '../../providers/global';
import { CartItem } from "../../models/cart-item.models";
import { ShippiningPage } from '../shippining/shippining';
import { Constants } from '../../models/constants.models';
import { UserResponse } from '../../models/user-response.models';
import { LoginPage } from '../login/login';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from '../../models/currency.models';

@Component({
	selector: 'page-cart ',
	templateUrl: 'cart.html',
	providers: [Global]
})

export class CartPage {
	private cartItems = new Array<CartItem>();
	private total: number = 0;
	private checkoutText = 'Proceed to checkout';
	private currencyIcon: string;
	private currencyText: string;
	private total_html: string;

	constructor(public translate: TranslateService, private global: Global, public navCtrl: NavController, public viewCtrl: ViewController, private toastCtrl: ToastController, public appCtrl: App) {
		let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
		if (currency) {
			this.currencyText = currency.value;
			let iconText = currency.options[currency.value];
			this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
		}
		let cartItems: Array<CartItem> = global.getCartItems();
		if (cartItems != null) {
			this.cartItems = this.cartItems.concat(cartItems);
		}
		this.calculateTotal();
	}

	removeItem(product) {
		this.global.removeCartItem(product);
		this.cartItems = this.global.getCartItems();
		this.calculateTotal();
	}

	decrementItem(product) {
		var decremented: boolean = this.global.decrementCartItem(product);
		if (!decremented) {
			this.cartItems = this.global.getCartItems();
			this.calculateTotal();
		} else {
			this.total = this.total - Number(product.sale_price);
			this.setPriceHtml();
		}
		this.translate.get(decremented ? 'item_updated' : 'item_removed').subscribe(value => {
			this.showToast(value);
		});
	}

	incrementItem(product) {
		var incremented: boolean = this.global.incrementCartItem(product);
		if (incremented) {
			this.total = this.total + Number(product.sale_price);
			this.setPriceHtml();
		}
		this.translate.get(incremented ? 'item_updated' : 'item_maxed_out').subscribe(value => {
			this.showToast(value);
		});
	}

	calculateTotal() {
		let sum: number = 0;
		for (let item of this.cartItems) {
			sum = sum + Number(item.product.sale_price) * item.quantity;
		}
		this.total = sum;
		this.total = Math.round(this.total * 100 + Number.EPSILON) / 100;
		this.translate.get(!this.cartItems || !this.cartItems.length ? 'cart_empty' : 'cart_proceed').subscribe(value => {
			this.checkoutText = value;
		});
		this.setPriceHtml();
	}

	setPriceHtml() {
		if (this.currencyIcon) {
			this.total_html = this.currencyIcon + ' ' + this.total;
		} else if (this.currencyText) {
			this.total_html = this.currencyText + ' ' + this.total;
		}
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

	proceedCheckout() {
		if (this.cartItems != null && this.cartItems.length > 0) {
			let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
			if (user != null) {
				this.viewCtrl.dismiss();
				this.appCtrl.getRootNav().push(ShippiningPage);
			} else {
				window.localStorage.setItem(Constants.TEMP_OPEN, Constants.TEMP_OPEN_CART);
				this.translate.get('auth_required').subscribe(value => {
					this.showToast(value);
				});
				this.viewCtrl.dismiss();
				this.appCtrl.getRootNav().push(LoginPage);
			}
		}
	}


	dismiss() {
		this.viewCtrl.dismiss();
	}
}
