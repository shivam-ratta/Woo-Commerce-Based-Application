import { Component, Inject } from '@angular/core';
import { NavController, ModalController, MenuController, Events, Platform } from 'ionic-angular';

import { Global } from '../../providers/global';

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
import { SubscriptionPage } from '../subscription/subscription';
import { ServicesPage } from '../services/services';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Global, WordpressClient]
})

export class HomePage {
  private subscriptions: Array<Subscription> = [];
  private banners = new Array<Banner>();
  private categoriesAll = new Array<Category>();
  private cartTotal = 0;
  private appTitle;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, public translate: TranslateService, private events: Events, private service: WordpressClient, public modalCtrl: ModalController, public navCtrl: NavController, public menu: MenuController, private global: Global) {
     
    var _this = this;
    this.config = config;
    this.translate = translate;
    this.events = events;
    this.service = service;
    this.modalCtrl = modalCtrl;
    this.navCtrl = navCtrl;
    this.menu = menu;
    this.global = global;
    this.subscriptions = [];
    this.banners = new Array();
    this.categoriesAll = new Array();
    this.cartTotal = 0;
    this.slides = [
        {
            title: "20% Off",
            description: "Furits & Veggies",
            smalltext: "Fresh & healthy",
            image: "assets/imgs/slider-1.jpg",
        },
        {
            title: "20% Off",
            description: "Tops & Tunics",
            smalltext: "Fresh & healthy",
            image: "assets/imgs/slider-2.jpg",
        },
        {
            title: "20% Off",
            description: "Tops & Tunics",
            smalltext: "Fresh & healthy",
            image: "assets/imgs/slider-3.jpg",
        }
    ];
    this.homeicons = [
        {
            name: "Vegetables & Fruits",
            imag: "assets/imgs/1.png",
        },
        {
            name: "Bakery & Dairy Products",
            imag: "assets/imgs/bakery.png",
        },
        {
            name: "Foodgrains, oil & masaala",
            imag: "assets/imgs/foodgrains.png",
        },
        {
            name: "Bevrages & drinks",
            imag: "assets/imgs/beverages.png",
        },
        {
            name: "Branded foods products",
            imag: "assets/imgs/branded.png",
        },
        {
            name: "Beauty & hygiene",
            imag: "assets/imgs/beauty.png",
        },
        {
            name: "Fish, Meet & Eggs",
            imag: "assets/imgs/non-veg.png",
        },
        {
            name: "Household products",
            imag: "assets/imgs/hosehold.png",
        },
        {
            name: "Grument & world food",
            imag: "assets/imgs/gourmet.png",
        }
    ];
    this.appTitle = config.appName;
    events.subscribe('category:setup', function () {
        _this.setupCategories();
    });
    this.setupCategories();
    this.loadBanners();
    var toOpen = window.localStorage.getItem(Constants.TEMP_OPEN);
    var user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    if (user && toOpen && toOpen.length) {
        if (toOpen == Constants.TEMP_OPEN_CART) {
            this.navCtrl.push( ShippiningPage);
        }
        else if (toOpen == Constants.TEMP_OPEN_PRODUCT) {
            var product = JSON.parse(window.localStorage.getItem(Constants.TEMP_OPEN_PRODUCT));
            this.navCtrl.push(ShippiningPage, { pro: product });
        }
        window.localStorage.removeItem(Constants.TEMP_OPEN);
        window.localStorage.removeItem(Constants.TEMP_OPEN_CART);
        window.localStorage.removeItem(Constants.TEMP_OPEN_PRODUCT);
    }
}
setupCategories() {
    var _this = this;
    var categories = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
    var cats = new Array();
    console.log(categories);
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var cat = categories_1[_i];
        /*if (cats.length == 8) {
          break;
        }*/
        if (Number(cat.parent) == 0) {
            cats.push(cat);
        }
    }
    this.translate.get('more').subscribe(function (value) {
        var more = new Category();
        more.name = value;
        more.id = '-1';
        cats.push(more);
        _this.categoriesAll = cats;
    });
    this.categoriesAll = this.sortByKey(this.categoriesAll, 'menu_order');
};
sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 0 : 1));
    });
};
ionViewDidEnter() {
    this.cartTotal = Number(this.global.getCartItemsCount());
};
loadBanners() {
    var _this = this;
    var savedBanners = JSON.parse(window.localStorage.getItem('banners'));
    if (savedBanners && savedBanners.length) {
        this.banners = savedBanners;
    }
    var subscription = this.service.banners(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(function (data) {
        var banners = data;
        var categories = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES));
        for (var _i = 0, banners_1 = banners; _i < banners_1.length; _i++) {
            var ban = banners_1[_i];
            for (var _a = 0, categories_2 = categories; _a < categories_2.length; _a++) {
                var cat = categories_2[_a];
                if (cat.id == ban.category) {
                    ban.catObj = cat;
                     
                }
            }
        }
        _this.banners = banners;
        window.localStorage.setItem('banners', JSON.stringify(_this.banners));
    }, function (err) {
    });
    this.subscriptions.push(subscription);
};
menuToggle() {
    if (!this.menu.isEnabled()) {
        this.menu.enable(true);
        this.menu.swipeEnable(true);
    }
    if (this.menu.isOpen()) {
        this.menu.close();
    }
    else {
        this.menu.open();
    }
};
categoryPage(cat) {
    if (cat && cat.id != '-1') {
        this.navCtrl.push(ShirtsPage, { cat: cat });
    }
    else {
        this.navCtrl.push(CategoryPage);
    }
};
searchPage() {
    this.navCtrl.push(SearchPage);
    // let modal = this.modalCtrl.create(SearchPage);
    // modal.present();
};
cartPage() {
    var _this = this;
    /*this.navCtrl.push(CartPage);*/
    var modal = this.modalCtrl.create(CartPage);
    modal.onDidDismiss(function () {
        _this.cartTotal = Number(_this.global.getCartItemsCount());
    });
    modal.present();
};
subscriptionPage() {
    this.navCtrl.push(SubscriptionPage, { type: 'subscription' });
};
chitPage() {
    this.navCtrl.push(SubscriptionPage, { type: 'chit' });
};
drivePage() {
    this.navCtrl.push(ServicesPage, { type: 'drive' });
};
weddingPage() {
    
    this.navCtrl.push(ServicesPage, { type: 'wedding' });
}
houseHoldPage(){
    this.navCtrl.push(ServicesPage, { type: 'House Hold Services' });

}
realEstatePage(){
    this.navCtrl.push(ServicesPage, { type: 'Real Estate' });
    
}
carServicingRepairs()
{
    this.navCtrl.push(ServicesPage, { type: 'Car Services & Repairs' });
}
servicesPage()  {
  this.navCtrl.push(ServicesPage);

}

  slides = [
    {
      title: "20% Off",
      description: "Furits & Veggies",
      smalltext: "Fresh & healthy",
      image: "assets/imgs/slider-1.jpg",
    },
    {
      title: "20% Off",
      description: "Tops & Tunics",
      smalltext: "Fresh & healthy",
      image: "assets/imgs/slider-2.jpg",
    },
    {
      title: "20% Off",
      description: "Tops & Tunics",
      smalltext: "Fresh & healthy",
      image: "assets/imgs/slider-3.jpg",
    }
  ];

  homeicons = [
    {
        name: "Vegetables & Fruits",
        imag: "assets/imgs/1.png",
    },
    {
        name: "Bakery & Dairy Products",
        imag: "assets/imgs/bakery.png",
    },
    {
        name: "Foodgrains, oil & masaala",
        imag: "assets/imgs/foodgrains.png",
    },
    {
        name: "Bevrages & drinks",
        imag: "assets/imgs/beverages.png",
    },
    {
        name: "Branded foods products",
        imag: "assets/imgs/branded.png",
    },
    {
        name: "Beauty & hygiene",
        imag: "assets/imgs/beauty.png",
    },
    {
        name: "Fish, Meet & Eggs",
        imag: "assets/imgs/non-veg.png",
    },
    {
        name: "Household products",
        imag: "assets/imgs/hosehold.png",
    },
    {
        name: "Grument & world food",
        imag: "assets/imgs/gourmet.png",
    }]
}
