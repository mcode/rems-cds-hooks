import { Bundle } from 'fhir/r4';
import CdsHook from './CdsHook';
import { OrderSelectContext, OrderSelectHook, SupportedHooks } from './HookTypes';

export default class OrderSelect extends CdsHook {
  patientId: string;
  userId: string;
  draftOrders: Bundle;
  selections: string[]

  constructor(patientId: string, userId: string, draftOrders: Bundle, selections: string[]) {
    super(SupportedHooks.ORDER_SIGN);
    this.patientId = patientId;
    this.userId = userId;
    this.draftOrders = draftOrders;
    this.selections = selections
  }

  generate(): OrderSelectHook {
    return {
      hook: this.hookType,
      hookInstance: this.hookInstance,
      context: this.generateContext(),
      prefetch: {}
    };
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
