import { Bundle } from 'fhir/r4';
import CdsHook from './CdsHook';
import { OrderSelectContext, OrderSelectHook, SupportedHooks } from './HookTypes';
import Client from 'fhirclient/lib/Client';

export default class OrderSelect extends CdsHook {
  patientId: string;
  userId: string;
  draftOrders: Bundle;
  selections: string[];

  constructor(patientId: string, userId: string, draftOrders: Bundle, selections: string[]) {
    super(SupportedHooks.ORDER_SIGN);
    this.patientId = patientId;
    this.userId = userId;
    this.draftOrders = draftOrders;
    this.selections = selections;
  }

  generate(client?: Client): OrderSelectHook {
    const baseHook: OrderSelectHook = {
      hook: this.hookType,
      hookInstance: this.hookInstance,
      context: this.generateContext(),
      prefetch: {}
    };
    if(client) {
      this.fillAuth(client, baseHook);
    }

    return baseHook;
  }
  generateContext(): OrderSelectContext {
    return {
      userId: this.userId,
      patientId: this.patientId,
      draftOrders: this.draftOrders,
      selections: this.selections
    };
  }
}
