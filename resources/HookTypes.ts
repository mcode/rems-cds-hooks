import { Bundle, FhirResource } from "fhir/r4";

export enum SupportedHooks {
  ORDER_SIGN = "order-sign",
}

export interface FhirAuthorization {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  scope: string;
  subject: string;
}

export interface HookContext {
  [key: string]: string | Bundle | undefined;
}

export interface HookPrefetch {
  [key: string]: FhirResource | object | undefined;
}
export interface Hook {
  hook: SupportedHooks;
  hookInstance: string;
  fhirServer?: URL;
  fhirAuthorization?: FhirAuthorization;
  context: HookContext;
  prefetch?: HookPrefetch;
}

// https://cds-hooks.org/hooks/order-sign/#context
export interface OrderSignContext extends HookContext {
  userId: string;
  patientId: string;
  encounterId?: string;
  draftOrders: Bundle;
}
// https://cds-hooks.hl7.org/1.0/#calling-a-cds-service
export interface OrderSignHook extends Hook {
  hook: SupportedHooks.ORDER_SIGN;
  context: OrderSignContext;
}

export interface Coding {
  /**
   * The code for what is being represented
   */
  code: string;

  /**
   * The codesystem for this code.
   */
  system: string;

  /**
   * A short, human-readable label to display. REQUIRED for Override Reasons 
   * provided by the CDS Service, OPTIONAL for Topic.
   */
  display?: string;
}

export interface Source {
  /**
   * A short, human-readable label to display for the source of the information 
   * displayed on this card. If a url is also specified, this MAY be the text for 
   * the hyperlink.
   */
  label: string;

  /**
   * An optional absolute URL to load (via GET, in a browser context) when a user 
   * clicks on this link to learn more about the organization or data set that 
   * provided the information on this card. Note that this URL should not be used 
   * to supply a context-specific "drill-down" view of the information on this card. 
   * For that, use card.link.url instead.
   */
  url?: string; 

  /**
   * An absolute URL to an icon for the source of this card. The icon returned by 
   * this URL SHOULD be a 100x100 pixel PNG image without any transparent regions. 
   * The CDS Client may ignore or scale the image during display as appropriate for 
   * user experience.
   */
  icon?: string; 

  /**
   * A topic describes the content of the card by providing a high-level 
   * categorization that can be useful for filtering, searching or ordered display 
   * of related cards in the CDS client's UI. This specification does not prescribe 
   * a standard set of topics.
   */
  topic?: Coding;
}

export interface Link {
  /**
   * Human-readable label to display for this link (e.g. the CDS Client might render 
   * this as the underlined text of a clickable link).
   */
  label: string;

  /**
   * URL to load (via GET, in a browser context) when a user clicks on this link. 
   * Note that this MAY be a "deep link" with context embedded in path segments, 
   * query parameters, or a hash.
   */
  url: string;

  /**
   * The type of the given URL. There are two possible values for this field. A 
   * type of absolute indicates that the URL is absolute and should be treated as-is. 
   * A type of smart indicates that the URL is a SMART app launch URL and the CDS Client 
   * should ensure the SMART app launch URL is populated with the appropriate SMART 
   * launch parameters. 
   */
  type: "absolute" | "smart";

  /**
   * An optional field that allows the CDS Service to share information from the CDS 
   * card with a subsequently launched SMART app. The appContext field should only be 
   * valued if the link type is smart and is not valid for absolute links. The 
   * appContext field and value will be sent to the SMART app as part of the OAuth 2.0 
   * access token response, alongside the other SMART launch parameters when the SMART 
   * app is launched. Note that appContext could be escaped JSON, base64 encoded XML, 
   * or even a simple string, so long as the SMART app can recognize it. CDS Client 
   * support for appContext requires additional coordination with the authorization 
   * server that is not described or specified in CDS Hooks nor SMART.
   */
  appContext?: string;
}

export interface Action {
  /**
   * The type of action being performed. Allowed values are: create, update, delete.
   */
  type: "create" | "update" | "delete";

  /**
   * Human-readable description of the suggested action MAY be presented to the end-user.
   */
  description: string;

  /**
   * A FHIR resource. When the type attribute is create, the resource attribute SHALL 
   * contain a new FHIR resource to be created. For update, this holds the updated 
   * resource in its entirety and not just the changed fields. Use of this field to 
   * communicate a string of a FHIR id for delete suggestions is DEPRECATED and 
   * resourceId SHOULD be used instead.
   */
  resource: FhirResource;

  /**
   * A relative reference to the relevant resource. SHOULD be provided when the type 
   * attribute is delete.
   */
  resourceId: string;
}

export interface Suggestion {
  /**
   * Human-readable label to display for this suggestion (e.g. the CDS Client might 
   * render this as the text on a button tied to this suggestion).
   */
  label: string;

  /**
   * Unique identifier, used for auditing and logging suggestions.
   */
  uuid?: string;

  /**
   * When there are multiple suggestions, allows a service to indicate that a specific 
   * suggestion is recommended from all the available suggestions on the card. CDS Hooks 
   * clients may choose to influence their UI based on this value, such as pre-selecting, 
   * or highlighting recommended suggestions. Multiple suggestions MAY be recommended, if 
   * card.selectionBehavior is any.
   */
  isRecommended?: boolean;

  /**
   * Array of objects, each defining a suggested action. Within a suggestion, all actions 
   * are logically AND'd together, such that a user selecting a suggestion selects all of 
   * the actions within it. When a suggestion contains multiple actions, the actions 
   * SHOULD be processed as per FHIR's rules for processing transactions with the CDS 
   * Client's fhirServer as the base url for the inferred full URL of the transaction 
   * bundle entries. (Specifically, deletes happen first, then creates, then updates).
   */
  actions?: Action[];
}

export interface Card {
  /**
   * Unique identifier of the card. MAY be used for auditing and logging cards and 
   * SHALL be included in any subsequent calls to the CDS service's feedback endpoint.
   */
  uuid?: string;

  /**
   * One-sentence, <140-character summary message for display to the user inside of 
   * this card.
   */
  summary: string;

  /**
   * Optional detailed information to display; if provided MUST be represented in 
   * (GitHub Flavored) Markdown. (For non-urgent cards, the CDS Client MAY hide these 
   * details until the user clicks a link like "view more details...").
   */
  detail?: string;

  /**
   * Urgency/importance of what this card conveys. Allowed values, in order of 
   * increasing urgency, are: info, warning, critical. The CDS Client MAY use this 
   * field to help make UI display decisions such as sort order or coloring.
   */
  indicator: "info" | "warning" | "critical";

  /**
   * Grouping structure for the Source of the information displayed on this card. 
   * The source should be the primary source of guidance for the decision support 
   * the card represents.
   */
  source: Source;

  /**
   * Allows a service to suggest a set of changes in the context of the current 
   * activity (e.g. changing the dose of a medication currently being prescribed, 
   * for the order-sign activity). If suggestions are present, selectionBehavior 
   * MUST also be provided.
   */
  suggestions?: Suggestion[];

  /**
   * Describes the intended selection behavior of the suggestions in the card. 
   * Allowed values are: at-most-one, indicating that the user may choose none or 
   * at most one of the suggestions; any, indicating that the end user may choose 
   * any number of suggestions including none of them and all of them. CDS Clients 
   * that do not understand the value MUST treat the card as an error.
   */
  selectionBehavior?: "at-most-one" | "any";

  /**
   * Override reasons can be selected by the end user when overriding a card without 
   * taking the suggested recommendations. The CDS service MAY return a list of 
   * override reasons to the CDS client. If override reasons are present, the CDS 
   * Service MUST populate a display value for each reason's Coding. The CDS Client 
   * SHOULD present these reasons to the clinician when they dismiss a card. A CDS 
   * Client MAY augment the override reasons presented to the user with its own 
   * reasons.
   */
  overrideReasons?: Coding[];

  /**
   * Allows a service to suggest a link to an app that the user might want to run 
   * for additional information or to help guide a decision.
   */
  links?: Link[];
}
