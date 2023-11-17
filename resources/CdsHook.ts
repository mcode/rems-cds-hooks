import Client from 'fhirclient/lib/Client';
import { Hook, HookContext, SupportedHooks } from './HookTypes';
import { v4 } from 'uuid';
export default abstract class CdsHook {
  hookType: SupportedHooks;
  hookInstance: string;
  constructor(hookType: SupportedHooks) {
    this.hookType = hookType;
    this.hookInstance = v4();
  }
  abstract generate(): Hook;
  abstract generateContext(): HookContext;
  fillAuth(client: Client, hook: Hook) {
    if (client.state?.tokenResponse) {
      const tokenResponse = client.state.tokenResponse;
      if (
        tokenResponse.access_token &&
        tokenResponse.token_type &&
        tokenResponse.expires_in &&
        tokenResponse.scope &&
        client.state.clientId
      ) {
        hook.fhirAuthorization = {
          access_token: tokenResponse.access_token,
          token_type: tokenResponse.token_type,
          expires_in: tokenResponse.expires_in,
          scope: tokenResponse.scope,
          subject: client.state.clientId
        };
      }
    }
    hook.fhirServer = new URL(client.state.serverUrl);
    return hook;
  }
}
