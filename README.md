# rems-cds-hooks
This repository is a submodule for the other REMS applications. These applications include:

* [REMS Admin](https://github.com/mcode/rems-admin) - acts as a REMS Administrator responding to CDS Hooks calls
* [REMS SMART on FHIR App](https://github.com/mcode/rems-smart-on-fhir) - can be used by an EHR system to make CDS Hooks calls to the REMS administrator when the EHR does not support CDS Hooks.

The submodule's directories contain the TypeScript bindings needed for CDS Hooks and an implementation of a prefetch mechanism. More information on CDS Hooks can be found [here](https://cds-hooks.org/specification/current/).

### resources
This folder contains all of the types needed to implement CDS Hooks with TypeScript. Hooks are triggers that will fire and send the request to the server at various points of the EHR workflow. The supported hooks include:

* [order-sign](https://cds-hooks.org/hooks/order-sign/) - fires when the clinician is ready to sign one or more orders for a patient
* [order-select](https://cds-hooks.org/hooks/order-select/) - fires when the clinician selects one or more orders before signing
* [patient-view](https://cds-hooks.org/hooks/patient-view/) - fires when the clinician has opened the patient's record
* [encounter-start](https://cds-hooks.org/hooks/encounter-start/) - fires when the clinician starts a new encounter with a patient, this could be as early as the time of admission

### prefetch
This folder contains a TypeScript implementation of the prefetch logic needed for CDS Hooks. Prefetch will query the FHIR server for resources needed by the CDS Hook server (REMS Administrator). These resources are specified in a prefetch template provided by the server. The prefetch data is optionally provided by the client. If not provided, the server must fetch the data it needs. This implementation can be used by the client or the server to use the prefetch templates to retrieve the necessary resources. More can be read about prefetch in the [CDS Hooks Specification](https://cds-hooks.org/specification/current/#providing-fhir-resources-to-a-cds-service).

# Data Rights

<div style="text-align:center">
<b>NOTICE</b>
</div>

This (software/technical data) was produced for the U. S. Government under Contract Number 75FCMC18D0047/75FCMC23D0004, and is subject to Federal Acquisition Regulation Clause 52.227-14, Rights in Data-General.


No other use other than that granted to the U. S. Government, or to those acting on behalf of the U. S. Government under that Clause is authorized without the express written permission of The MITRE Corporation.


For further information, please contact The MITRE Corporation, Contracts Management Office, 7515 Colshire Drive, McLean, VA 22102-7539, (703) 983-6000.

<div style="text-align:center">
<b>&copy;2025 The MITRE Corporation.</b>
</div>

<br />

Licensed under the Apache License, Version 2.0 (the "License"); use of this repository is permitted in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
