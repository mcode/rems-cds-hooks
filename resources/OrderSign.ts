import { Bundle } from 'fhir/r4';
import CdsHook from './CdsHook';
import { OrderSignContext, OrderSignHook, SupportedHooks } from './HookTypes';
import Client from 'fhirclient/lib/Client';

export default class OrderSign extends CdsHook {
  patientId: string;
  userId: string;
  draftOrders: any;

  constructor(patientId: string, userId: string, draftOrders: Bundle) {
    super(SupportedHooks.ORDER_SIGN);
    this.patientId = patientId;
    this.userId = userId;
    this.draftOrders = draftOrders;
  }

  generate(client?: Client): OrderSignHook {
    const baseHook: OrderSignHook = {
      hook: this.hookType,
      hookInstance: this.hookInstance,
      context: this.generateContext(),
      prefetch: {}
    };
    if (client) {
      this.fillAuth(client, baseHook);
    }

    return baseHook;
  }
  generateContext(): OrderSignContext {
    return {
      userId: this.userId,
      patientId: this.patientId,
      draftOrders: this.draftOrders
    };
  }
}
