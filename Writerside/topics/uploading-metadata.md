# Uploading Metadata into Cafe Variome

To upload metadata into Cafe Variome, there are two different ways.

## Using the editing interface

The most straight forward way is to use the editing interface to (manually) create a new meta source. This is the
recommended approach when there are only several records to add.

> Document WIP.
> {style="warning"}

## Using the file uploader

If the metadata is large in quantity, or if the metadata is being exported from another system, it's better to use the file uploader to upload the metadata. It does, however, requires the metadata to be in a specific format to allow direct ingestion.

> The file uploader cannot override metadata entries. If you upload a new version of existing entry there will be duplications. **Please remove the old entries before uploading the new ones.**
> {style="warning"}

### Metadata file format

The metadata file to be uploaded should be in JSON format. It should be an array containing one or multiple objects, each object being a meta source. The structure of the meta-source should follow the [meta-source model](metadata-discovery-model.md), but some fields can be omitted or left empty. The following is an example of a metadata file:

<include from="library.md" element-id="json-meta_source_custom-minimum"></include>

### Fields and constraints

Some of the fields within the metadata model have constraints and/or formatting requirements. The following is a list of all of the fields, what they are, and their constraints. Fields **not** marked as optional are required, but may be left empty (as an empty string) or 0 (as a number) unless otherwise specified. All field names are case-sensitive.

Metadata entries cannot contain additional fields, except those allowed in **customFields** list or fields labeled as "custom." All other additional fields will be ignored and not stored or represented in any way.

<include from="metadata-discovery-model.md" element-id="section-internal_fields_and_manual_assignment"></include>

#### Common fields

These are the fields that are present in all types of meta-sources.

<deflist collapsible="true">
    <def title="sourceName">
        <code>string</code> <b>Cannot be empty</b>.
    </def>
    <def title="sourceType">
        <code>string</code> <b>Cannot be empty</b>. Constrained vocabulary values:
        <list type="bullet">
            <li>custom</li>
            <li>cohort</li>
            <li>catalog</li>
            <li>biobank</li>
            <li>registry</li>
            <li>guideline</li>
            <li>dataset</li>
            <li>dataCollection</li>
        </list>
    </def>
    <def title="resourceUrls">
        <code>array[string]</code> <code>optional</code> Full URI format with schema.
    </def>
    <def title="publisher">
        <code>object</code> Nested JSON object.
        <deflist collapsible="true">
            <def title="publisherType">
                <code>string</code> <b>Cannot be empty</b>. Constrained vocabulary values:
                <list type="bullet">
                    <li>individual</li>
                    <li>organization</li>
                    <li>agency</li>
                    <li>other</li>
                </list>
            </def>
            <def title="name">
                <code>string</code> <b>Cannot be empty</b>.
            </def>
            <def title="contactEmail">
                <code>string</code> <b>Cannot be empty</b>.
            </def>
            <def title="contactName">
                <code>string</code> <code>optional</code>.
            </def>
            <def title="url">
                <code>string</code> <code>optional</code> Full URI format with schema.
            </def>
            <def title="location">
                <code>string</code> <code>optional</code>.
            </def>
        </deflist>
    </def>
    <def title="description">
        <code>string</code> <code>optional</code> Can be empty but not recommended.
    </def>
    <def title="themes">
        <code>array[string]</code> <code>optional</code> URI format.
    </def>
    <def title="releaseLicense">
        <code>string</code> <code>optional</code> Full URI format with schema.
    </def>
    <def title="language">
        <code>string</code> <code>optional</code> Two-character code adhering to ISO639-1 standard, lower case.
    </def>
    <def title="customFields">
        <code>object</code> <code>optional</code> Key-value or key[values] pairs. Constraints:
        <list type="bullet">
            <li>Key must be a string and cannot contain special characters: `.`, `$`, `/`, or `\`.</li>
            <li>If a key is present, the value cannot be `null` but can be an empty string or an empty array.</li>
        </list>
    </def>
</deflist>

#### Cohort specific fields

These are the fields specific to the cohort type.

<deflist collapsible="true">
    <def title="cohortDetails">
        <code>object</code> Nested JSON object.
        <deflist collapsible="true">
            <def title="siteType">
                <code>string</code> <b>Cannot be empty</b>. Constrained vocabulary values:
                <list type="bullet">
                    <li>singleSite</li>
                    <li>multiSite</li>
                    <li>multiCountry</li>
                </list>
            </def>
            <def title="country">
                <code>string</code> <b>Cannot be empty</b>. Two-character code adhering to ISO3166-1 standard, upper case.
            </def>
            <def title="yearStart">
                <code>integer</code> <b>Cannot be empty</b>. Four-digit integer.
            </def>
        </deflist>
    </def>
    <def title="collectedTypes">
        <code>object</code> <code>optional</code> Nested JSON object.
        <deflist collapsible="true">
            <def title="participants">
                <code>object</code> <code>optional</code> Nested JSON object.
                <deflist collapsible="true">
                    <def title="diseases">
                        <code>array[string]</code> <b>Cannot be empty</b>. Constrained vocabulary values:
                        <list type="bullet">
                            <li>controlGroup</li>
                            <li>ad</li>
                            <li>pd</li>
                            <li>irbd</li>
                            <li>dlb</li>
                            <li>caa</li>
                            <li>ftd</li>
                            <li>als</li>
                            <li>psp</li>
                            <li>cbd</li>
                            <li>msa</li>
                            <li>hd</li>
                            <li>ataxia</li>
                            <li>other</li>
                        </list>
                        <b>Note:</b> An empty array will cause the entire <code>participants</code> object to be ignored.
                    </def>
                    <def title="numberOfSubjects">
                        <code>integer</code> <b>Must be greater than 0</b>. If 0, the entire <code>participants</code> object will be ignored.
                    </def>
                </deflist>
            </def>
            <def title="bioSamples">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>csf</li>
                    <li>serum</li>
                    <li>plasma</li>
                    <li>dna</li>
                    <li>saliva</li>
                    <li>urine</li>
                    <li>stool</li>
                </list>
            </def>
            <def title="images">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>mri</li>
                    <li>petAmyloid</li>
                    <li>petTau</li>
                    <li>spect</li>
                    <li>ocular</li>
                </list>
            </def>
            <def title="cognitiveData">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>crossSectional</li>
                    <li>longitudinal</li>
                </list>
            </def>
        </deflist>
    </def>
    <def title="datasetIds">
        <code>array[string]</code> <code>optional</code> UUID format. Datasets must be either present in the same file or already uploaded to the system.
    </def>
</deflist>


#### Dataset Specific fields

These are the fields specific to the dataset type.

<deflist collapsible="true">
    <def title="datasetVersions">
        <code>array[object]</code> Nested array of JSON objects.
        <deflist collapsible="true">
            <def title="datasetDetails">
                <code>object</code> Nested JSON object.
                <deflist collapsible="true">
                    <def title="versionId">
                        <code>string</code> <code>optional</code> Valid UUID 4 string. If omitted, a UUID will be automatically assigned.
                    </def>
                    <def title="versionName">
                        <code>string</code> <code>optional</code> Semantic versioning recommended. Non-semantic versions will disable version parsing, comparison, and sorting.
                    </def>
                    <def title="keywords">
                        <code>array[string]</code> <code>optional</code> Array of keyword strings.
                    </def>
                    <def title="publishedDate">
                        <code>string</code> <code>optional</code> Date string in the format of `YYYY-MM-DD`.
                    </def>
                    <def title="updateDate">
                        <code>string</code> <code>optional</code> Date string in the format of `YYYY-MM-DD`.
                    </def>
                </deflist>
            </def>
            <def title="datasetContent">
                <code>object</code> Nested JSON object.
                <deflist collapsible="true">
                    <def title="numberOfSubjects">
                        <code>integer</code> <b>Must be greater than 0</b>. May be an approximate number if exact count is confidential.
                    </def>
                    <def title="minAge">
                        <code>integer</code> <code>optional</code> Must be greater than 0.
                    </def>
                    <def title="maxAge">
                        <code>integer</code> <code>optional</code> Must be greater than 0.
                    </def>
                    <def title="countries">
                        <code>array[string]</code> <code>optional</code> Array of two-character codes adhering to ISO3166-1 standard, upper case.
                    </def>
                    <def title="diseases">
                        <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                        <list type="bullet">
                            <li>controlGroup</li>
                            <li>ad</li>
                            <li>pd</li>
                            <li>irbd</li>
                            <li>dlb</li>
                            <li>caa</li>
                            <li>ftd</li>
                            <li>als</li>
                            <li>psp</li>
                            <li>cbd</li>
                            <li>msa</li>
                            <li>hd</li>
                            <li>ataxia</li>
                            <li>other</li>
                        </list>
                    </def>
                    <def title="sex">
                        <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                        <list type="bullet">
                            <li>male</li>
                            <li>female</li>
                            <li>other</li>
                            <li>undifferential</li>
                            <li>unknown</li>
                        </list>
                    </def>
                    <def title="clinical">
                        <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                        <list type="bullet">
                            <li>comorbidities</li>
                            <li>medicationUse</li>
                            <li>familyHistory</li>
                            <li>ageOfSymptomOnset</li>
                            <li>clinicalDiagnosis</li>
                            <li>exposure</li>
                            <li>lifeStyleInfo</li>
                            <li>vitalSigns</li>
                        </list>
                    </def>
                    <def title="markers">
                        <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                        <list type="bullet">
                            <li>amyloid</li>
                            <li>tau</li>
                            <li>neurofilamentLightChain</li>
                            <li>alphaSynuclein</li>
                            <li>dat</li>
                        </list>
                    </def>
                    <def title="images">
                        <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                        <list type="bullet">
                            <li>mri</li>
                            <li>petAmyloid</li>
                            <li>petTau</li>
                            <li>spect</li>
                            <li>ocular</li>
                        </list>
                    </def>
                    <def title="electrophysiology">
                        <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                        <list type="bullet">
                            <li>eeg</li>
                            <li>meg</li>
                            <li>erp</li>
                        </list>
                    </def>
                    <def title="dataTypes">
                        <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                        <list type="bullet">
                            <li>demographics</li>
                            <li>clinical</li>
                            <li>lifestyle</li>
                            <li>functionalRatings</li>
                            <li>motor</li>
                            <li>neuropsychiatric</li>
                            <li>neuropsychological</li>
                            <li>qualityOfLife</li>
                            <li>sleepScales</li>
                            <li>digitalData</li>
                            <li>imaging</li>
                            <li>electrophysiology</li>
                            <li>neuroPathology</li>
                            <li>other</li>
                        </list>
                    </def>
                </deflist>
            </def>
        </deflist>
    </def>
</deflist>


#### Data collection Specific fields

These are the fields specific to the data collection type.

<deflist collapsible="true">
    <def title="dataCollectionDetails">
        <code>object</code> <code>optional</code> Nested JSON object.
        <deflist collapsible="true">
            <def title="keywords">
                <code>array[string]</code> <code>optional</code> Array of keyword strings.
            </def>
            <def title="publishedDate">
                <code>string</code> <code>optional</code> Date string in the format of `YYYY-MM-DD`.
            </def>
            <def title="updateDate">
                <code>string</code> <code>optional</code> Date string in the format of `YYYY-MM-DD`.
            </def>
        </deflist>
    </def>
    <def title="dataCollectionContent">
        <code>object</code> <code>optional</code> Nested JSON object.
        <deflist collapsible="true">
            <def title="numberOfSubjects">
                <code>integer</code> <b>Must be greater than 0</b>. May be an approximate number if exact count is confidential.
            </def>
            <def title="minAge">
                <code>integer</code> <code>optional</code> Must be greater than 0.
            </def>
            <def title="maxAge">
                <code>integer</code> <code>optional</code> Must be greater than 0.
            </def>
            <def title="countries">
                <code>array[string]</code> <code>optional</code> Array of two-character codes adhering to ISO3166-1 standard, upper case.
            </def>
            <def title="diseases">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>controlGroup</li>
                    <li>ad</li>
                    <li>pd</li>
                    <li>irbd</li>
                    <li>dlb</li>
                    <li>caa</li>
                    <li>ftd</li>
                    <li>als</li>
                    <li>psp</li>
                    <li>cbd</li>
                    <li>msa</li>
                    <li>hd</li>
                    <li>ataxia</li>
                    <li>other</li>
                </list>
            </def>
            <def title="sex">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>male</li>
                    <li>female</li>
                    <li>other</li>
                    <li>undifferential</li>
                    <li>unknown</li>
                </list>
            </def>
            <def title="clinical">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>comorbidities</li>
                    <li>medicationUse</li>
                    <li>familyHistory</li>
                    <li>ageOfSymptomOnset</li>
                    <li>clinicalDiagnosis</li>
                    <li>exposure</li>
                    <li>lifeStyleInfo</li>
                    <li>vitalSigns</li>
                </list>
            </def>
            <def title="markers">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>amyloid</li>
                    <li>tau</li>
                    <li>neurofilamentLightChain</li>
                    <li>alphaSynuclein</li>
                    <li>dat</li>
                </list>
            </def>
            <def title="images">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>mri</li>
                    <li>petAmyloid</li>
                    <li>petTau</li>
                    <li>spect</li>
                    <li>ocular</li>
                </list>
            </def>
            <def title="electrophysiology">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>eeg</li>
                    <li>meg</li>
                    <li>erp</li>
                </list>
            </def>
            <def title="dataTypes">
                <code>array[string]</code> <code>optional</code> Constrained vocabulary values:
                <list type="bullet">
                    <li>demographics</li>
                    <li>clinical</li>
                    <li>lifestyle</li>
                    <li>functionalRatings</li>
                    <li>motor</li>
                    <li>neuropsychiatric</li>
                    <li>neuropsychological</li>
                    <li>qualityOfLife</li>
                    <li>sleepScales</li>
                    <li>digitalData</li>
                    <li>imaging</li>
                    <li>electrophysiology</li>
                    <li>neuroPathology</li>
                    <li>other</li>
                </list>
            </def>
        </deflist>
    </def>
</deflist>


### Metadata model examples

Here are some minimum and maximum examples of metadata models for different source types.

Minimum example for `custom` type:

<include from="library.md" element-id="json-meta_source_custom-minimum"></include>

Maximum example for `custom` type:

<include from="library.md" element-id="json-meta_source_custom-maximum"></include>

Minimum example for `cohort` type:

<include from="library.md" element-id="json-meta_source_cohort-minimum"></include>

Maximum example for `cohort` type:

<include from="library.md" element-id="json-meta_source_cohort-maximum"></include>

Minimum example for `dataset` type:

<include from="library.md" element-id="json-meta_source_dataset-minimum"></include>

Maximum example for `dataset` type:

<include from="library.md" element-id="json-meta_source_dataset-maximum"></include>

Minimum example for `dataCollection` type:

<include from="library.md" element-id="json-meta_source_data_collection-minimum"></include>

Maximum example for `dataCollection` type:

<include from="library.md" element-id="json-meta_source_data_collection-maximum"></include>

### Uploading the metadata file

To upload the metadata file, go to the admin interface, and click on the "Create Meta Source" button.

![interface-landing_page_dashboard.png](interface-landing_page_dashboard.png)

![interface-meta_source_upload.png](interface-meta_source_upload.png)

Then, set the meta source type to "all" to use the file uploader. Multiple files can be selected, and selected files can
be removed before finalising the upload.

![interface-file_pick_multiple.png](interface-file_pick_multiple.png)

![interface-meta_source_file_selected.png](interface-meta_source_file_selected.png)

Once the files are decided, click the "Process" button to start reading and processing the files. All of the metadata
entries will be read in the front end, sanitized and validated, and then sent to the server for storage. After
processing, you will be prompted with the number of metadata entries it read in, and to confirm the upload. Once
confirmed, the metadata entries will be stored in the database, and will be available for search and discovery.
