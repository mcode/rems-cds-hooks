import CdsHook from './CdsHook';
import { PatientViewContext, PatientViewHook, SupportedHooks } from './HookTypes';

export default class PatientView extends CdsHook {
  patientId: string;
  userId: string;

  constructor(patientId: string, userId: string) {
    super(SupportedHooks.PATIENT_VIEW);
    this.patientId = patientId;
    this.userId = userId;
  }

  generate(): PatientViewHook {
    return {
      hook: this.hookType,
      hookInstance: this.hookInstance,
      context: this.generateContext(),
      prefetch: {}
    };
  }
  generateContext(): PatientViewContext {
    return {
      userId: this.userId,
      patientId: this.patientId
    };
  }
}
