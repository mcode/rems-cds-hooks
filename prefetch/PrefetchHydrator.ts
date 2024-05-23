import { Hook, HookPrefetch, TypedRequestBody } from '../resources/HookTypes';
import { ServicePrefetch } from '../resources/CdsService';
import { Resource } from 'fhir/r4';
import { flatten } from 'flat';

function jsonPath(hook: Hook, path: string) {
  // Use a regular expression to find array accessors in the form of "[i]"
  const arrayRegex = /\[(\d+)\]/g;

  // Use the regex to find all the array accessors in the path
  let match;
  while ((match = arrayRegex.exec(path)) !== null) {
    // Get the index of the array element to access
    const index = match[1];

    // Use the index to replace the array accessor in the path with the corresponding property accessor
    path = path.replace(match[0], `.${index}`);
  }

  // Need to cast, otherwise TypeScript will complain
  const flattenedHook = flatten(hook) as Record<string, string>;
  return flattenedHook[path];
}

function replaceTokens(str: string, json: Hook): string {
  // Use a regular expression to find tokens in the form of "{{token}}"
  const tokenRegex = /{{([\w.]+)}}/g;

  // Use the regex to find all the tokens in the string
  let match;
  while ((match = tokenRegex.exec(str)) !== null) {
    // Get the token from the match
    const token = match[1];

    // Use the token to get the corresponding value from the JSON object
    const value = jsonPath(json, token);

    // Replace the token in the original string with the value
    str = str.replace(match[0], value);
  }

  // Return the modified string
  return str;
}

function resolveToken(
  token: string,
  callback: (token: string, req: TypedRequestBody) => Promise<Resource>,
  hook: Hook
) {
  const fulfilledToken = replaceTokens(token, hook);
  return callback(fulfilledToken, { body: hook });
}

async function hydrate(
  callback: (token: string, req: TypedRequestBody) => Promise<Resource>,
  template: ServicePrefetch,
  hook: Hook
) {
  // Generally the EHR should define the prefetch requests it will/won't
  // fulfill, but in this case we can just attempt to fill everything
  // we can.
  let prefetch: HookPrefetch = {};
  if (hook.prefetch) {
    prefetch = hook.prefetch;
  }
  const promises = Object.keys(template).map(key => {
    if (!Object.prototype.hasOwnProperty.call(prefetch, key)) {
      // prefetch was not fulfilled
      return resolveToken(template[key], callback, hook).then((data: Resource) => {
        Object.assign(prefetch, { [key]: data });
      });
    } else {
      return undefined;
    }
  });

  return Promise.all(promises).then(() => prefetch);
}
export { hydrate };
