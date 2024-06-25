# rems-cds-hooks
This repository is a submodule for the other REMS applications. These applications include:

* [REMS Admin](https://github.com/mcode/rems-admin) - acts as a REMS Administrator responding to CDS Hooks calls
* [REMS SMART on FHIR App](https://github.com/mcode/rems-smart-on-fhir) - can be used by an EHR system to make CDS Hooks calls to the REMS adminstrator when the EHR does not support CDS Hooks.

The submodule's directories contain the TypeScript bindings needed for CDS Hooks and an implementation of a prefetch mechanism. More information on CDS Hooks can be found [here](https://cds-hooks.org/specification/current/).

### resources
This folder contains all of the types needed to implement CDS Hooks with TypeScript. Hooks are triggers that will fire and send the request to the server at various points of the EHR workflow. The supported hooks include:

* [order-sign](https://cds-hooks.org/hooks/order-sign/) - fires when the clinician is ready to sign one or more orders for a patient
* [order-select](https://cds-hooks.org/hooks/order-select/) - fires when the clinician selects one or more orders before signing
* [patient-view](https://cds-hooks.org/hooks/patient-view/) - fires when the clinician has opened the patient's record
* [encounter-start](https://cds-hooks.org/hooks/encounter-start/) - fires when the clinician starts a new encounter with a patient, this could be as early as the time of admission

### prefetch
This folder contains a TypeScript implementation of the prefetch logic needed for CDS Hooks. Prefetch will query the FHIR server for resources needed by the CDS Hook server (REMS Administrator). These resources are specified in a prefetch template provided by the server. The prefetch data is optionally provided by the client. If not provided, the server must fetch the data it needs. This implementation can be used by the client or the server to use the prefetch templates to retrieve the necessary resources. More can be read about prefetch in the [CDS Hooks Specification](https://cds-hooks.org/specification/current/#providing-fhir-resources-to-a-cds-service).