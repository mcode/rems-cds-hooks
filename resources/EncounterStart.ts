import CdsHook from './CdsHook';
import { EncounterStartContext, EncounterStartHook, SupportedHooks } from './HookTypes';

export default class EncounterStart extends CdsHook {
  patientId: string;
  userId: string;
  encounterId: string;

  constructor(patientId: string, userId: string, encounterId: string) {
    super(SupportedHooks.ENCOUNTER_START);
    this.patientId = patientId;
    this.userId = userId;
    this.encounterId = encounterId;
  }

  generate(): EncounterStartHook {
    return {
      hook: this.hookType,
      hookInstance: this.hookInstance,
      context: this.generateContext(),
      prefetch: {}
    };
  }
  generateContext(): EncounterStartContext {
    return {
      userId: this.userId,
      patientId: this.patientId,
      encounterId: this.encounterId
    };
  }
}
