import { initUser } from './modules/user';
import { initAside } from './blocks/aside';
import { initCalculation } from './modules/calculation';
import { initLoaded } from './modules/loaded';
import { initOrders } from './modules/orders';

(function () {
  initUser();
  initAside();
  initCalculation();
  initLoaded();
  initOrders();
})();
