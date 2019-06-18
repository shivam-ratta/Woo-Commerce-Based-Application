import { Component } from '@angular/core';
import { NavController, Loading, ToastController, LoadingController } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'page-password ',
	templateUrl: 'password.html',
	providers: [WordpressClient]
})
export class PasswordPage {
	private userLogin: string;
	private loading: Loading;
	private loadingShown: Boolean = false;
	private subscriptions: Array<Subscription> = [];

	constructor(public translate: TranslateService, private toastCtrl: ToastController, public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController) {

	}

	resetPassword() {
		if (this.userLogin && this.userLogin.length) {
			this.translate.get('loading_password_reset').subscribe(value => {
				this.presentLoading(value);
			});
			let subscription: Subscription = this.service.resetPassword(this.userLogin).subscribe(data => {
				this.dismissLoading();
				this.navCtrl.pop();
			}, err => {
				this.dismissLoading();
				this.navCtrl.pop();
			});
			this.subscriptions.push(subscription);
		} else {
			this.translate.get('field_error_valid_username').subscribe(value => {
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
}
