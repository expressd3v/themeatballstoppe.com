import { makeAutoObservable } from 'mobx';
import ItemStore from './item-store';
import { getNextAvailableFulfillmentDateAndTime } from './date-utils';
import FulfillmentStore from './fulfillment-store';
import RegisterStore from './register-store';

export type ActiveTab = 'Full menu' | 'Vegetarian' | 'Vegan' | 'Gluten Free' | 'Catering Menu' | 'Checkout';

export type OrderType = 'normal' | 'catering';

class OrderStore {
  activeTab: ActiveTab = 'Full menu';
  orderType: OrderType = 'normal';
  shoppingCart: ItemStore[];
  fulfillment: FulfillmentStore;
  registerStore: RegisterStore;

  constructor() {
    makeAutoObservable(this);
    this.shoppingCart = [];
    this.fulfillment = new FulfillmentStore();
    this.registerStore = new RegisterStore(this.fulfillment, this.shoppingCart);
  }

  setActiveTab(tab: ActiveTab): void {
    this.activeTab = tab;
  }

  setOrderType(type: OrderType) {
    this.orderType = type;
  }

  initializeModule(catering: boolean | undefined) {
    if ((catering && this.orderType !== 'catering') || (!catering && this.orderType !== 'normal')) {
      this.shoppingCart.length = 0; // clear cart
    }
    if (catering) {
      this.setOrderType('catering');
      this.fulfillment.setFulfillmentOption('delivery');
      this.setActiveTab('Catering Menu');
    } else {
      this.setOrderType('normal');
      this.fulfillment.setFulfillmentOption('pickup');
      this.setActiveTab('Full menu');
    }
    this.fulfillment.dateStore.fulfillmentTimeAndDate = getNextAvailableFulfillmentDateAndTime();
  }

  addToCart(itemStore: ItemStore) {
    this.shoppingCart.push(itemStore);
  }

  get inputFieldsReady() {
    const baseQualificationsSatisfied =
      Boolean(this.fulfillment.contactName) &&
      Boolean(this.fulfillment.contactNumber) &&
      Boolean(this.fulfillment.dateStore.fulfillmentTimeAndDate) &&
      !this.fulfillment.dateStore.fulfillmentTimeAndDateError;
    if (this.orderType === 'normal' || (this.orderType === 'catering' && this.fulfillment.option === 'pickup')) {
      return baseQualificationsSatisfied;
    } else {
      return (
        baseQualificationsSatisfied &&
        Boolean(this.fulfillment.deliveryLocation) &&
        typeof this.registerStore.deliveryFee === 'number' &&
        Number(this.fulfillment.numberOfGuests) > 0
      );
    }
  }
}

export default new OrderStore();
