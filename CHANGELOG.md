
3.5.0 / 2021-04-28
==================

  * Add theme categories
  * Change readonly CSS selector because of Firefox bug

3.4.1 / 2021-04-27
==================

  * Upgrade terra-front to 1.27.4 to use pic comparison translation
  * Remove absolute position for picture comparison component
  * Use better styling for picture comparison title
  * Disable compare button when datas are loading

3.4.0 / 2021-04-27
==================

  * Remove filter for broken column
  * Fix related file management
  * Add City admin
  * Fix crash on document addition
  * Update layer's style related to mapbox-gl-path upgrade
  * Upgrade @terralego/core package to 1.27.3

3.3.7 / 2021-04-27
==================

  * Add compare picture modal to picture page
  * Fix picture sort
  * Add theme admin
  * Remove useless wrapper
  * Upgrade @blueprintjs/core package version 3.44.0
  * Fix importGeomFile for geometries not using pathControl

3.3.6 / 2021-04-24
==================

  * Add search for pictures
  * Add ordering to OPP views
  * Fix missing key

3.3.5 / 2021-04-22
==================

  * Add filter by date for viewpoint modal inside campaigns
  * Add id search when adding viewpoint to campaign
  * Allow picture state ordering
  * Add confirmation to picture actions
  * Fix undoable change
  * Fix ResetGeometry init if geom prop is equal to null
  * Reset Create feature form after submitting it
  * Change wording and ui for save feature button
  * Style reset GeometryField button
  * Improve wording to edit or reset geometries field

3.3.4 / 2021-04-19
==================

  * Enhance viewpoint filter
  * Remove get2Dcoordinate helper
  * Upgrade @terralego/core package version to 1.27.2

3.3.3 / 2021-04-16
==================

  * Add button to download all sheets
  * Enhance viewpoint modal For campaign
  * Add backend proxy
  * Move filters
  * Improve translation

3.3.2 / 2021-04-14
==================

  * Add sheet link
  * Fix datalayer form after RA upgrade
  * Avoid recursive render bug
  * Remove beta for campaigns
  * Fix close button style
  * Use useGeometryField hook instead of explicit useContext hook
  * Fix typo `hasDraw`
  * Add reset geometry feature
  * Refactor GeometryField by using context provider
  * Put a default placeholder for json schema string enum
  * Add 'Mapbox or style URL' in translation
  * Refacto GeometryField UI
  * Make one GeometryField UI for all geomtype
  * Invert order of fields in feature create view
  * Save always routingInformation coordinates in 2D format
  * Update routingInformation after the geometry import validation
  * Upgrade @terralego/core package to 1.27.1

3.3.1 / 2021-04-13
==================

  * Enhance viewpointgrid style
  * Enhance campaign grids style
  * Fix stats bar on creation
  * Fix default date
  * Remove resource as props in CustomToolbar
  * Fix translations

3.3.0 / 2021-04-12
==================

  * Create DeleteWithConfirmButton to display identifier
  * Enhance viewpoint modal
  * Add stats bar for campaign
  * Better image picture field
  * Default date today for input
  * Add photo link
  * Add validate required to city input
  * Manage isHTML render in array string type
  * Make isHTML function exportable
  * Manage mandatory fields for none group layers
  * Fix conditional display of secondaries geometries
  * Delete picture button only accessible by user with perms

3.2.2 / 2021-03-31
==================

  * Add beta flag for campaigns
  * display pic identfier in viewpoint pic list
  * Add "search location" in map control

3.2.1 / 2021-03-31
==================

  * Enable campaigns by default

3.2.0 / 2021-03-31
==================

  * Add feature flag for campaigns
  * Add campaign admin

# Breaking changes

  * Update react-admin version to latest
  * Use last npm version

3.1.8 / 2021-03-30
==================

  * Prevent user to go to another feature in detail page
  * Early return the function if an error ocurred
  * Reset header for Api.request just before uploading file
  * Avoid error to pick a category in an empty category list
  * Change Weather Input of viewpoint from textfield to select
  * Add redirection based on the previous page
  * Set a default placeholder for enum
  * Fix default value for schema enum
  * Refacto ui of GeometryField
  * Rework errors after editing or creating features
  * Make LayersControl self autonomous
  * Refacto Main component by using useContext hook
  * Rename `context` by `AppContext` in AppProvider
  * Upgrade  @terralego/core version to 1.26.5
  * Avoid app to crash after the delete of a feature
  * Flush tiles cache after the update of geometry's feature

3.1.7 / 2021-03-17
==================

  * Enhance translations
  * Allow to edit picture owner
  * Use auto generated identifier from back as index
  * Disabling viewpoint
  * Upgrade @terralego/core package to 1.26.4
  * Fix lnglat point GeometryField
  * Doesn't fit bound the map anymore for create view
  * Set the application of routing only for the main geometry
  * Fix default value for GeometryField
  * Fix geomType for multigeometries saving
  * Display error message for bad geometry POST
  * Viewpoint business id is now the id
  * Fix listing of required fields
  * Display error message from API when editing props
  * Refacto edit PropertyItem
  * Avoid app to crash when the formData is null
  * Store and use routing_information to describe routing to the UI
  * Manage toast message when the provider doesn't find a route
  * Check a following road by default
  * Overide translations from mapbox gl path package
  * Upgrade @terralego/core package to 1.26.3
  * Fix alignement CSS for routing control
  * Sync label with input for latitude/longitude fields

3.1.6 / 2021-03-10
==================

  * Avoid react-admin & final-form conflict

3.1.5 / 2021-03-08
==================

  * [LAYER] fix bad data persistance in form
  * [CRUD] Update feature list when the user creates or edits a feature
  * [CRUD] Display error to the user when creating feature fail
  * [CRUD] Clean props to send to Create component

3.1.4 / 2021-03-04
==================

  * Fix opp admin after upgrade
  * rework popup form & generation for layer admin

3.1.3 / 2021-03-04
==================

  * Rework minisheet to handle partial data retrieved from RA
  * Fix minisheet bug on initialisation
  * Fix initial OPP city creation problem

3.1.2 / 2021-02-23
==================

  * Fix regression of undefined value triggering template update

3.1.1 / 2021-02-23
==================

  * center color picker to avoid multiple ux issues

3.1.0 / 2021-02-22
==================

  * Start real version management
  * Add version management
  * Display info sign icon to "edit" generated properties
  * Review the fields to display in user list/detail admin
  * Display error message when routing doesn't success
  * Use a function to add geometry control to the map
  * Refacto and integrate PathControl to GeometryField
  * Upgrade @terralego/core package to 1.26.2
  * Set default padding when depending ref are equal to null
  * Clean the call of some useless map variables
  * Set color picker up when bottom outside of viewport
  * Prevent the user to edit generated properties
  * Set initialValue to zoom and force advanced mode as boolean
  * Change city data path
  * Force correct value on advanced value for minisheet
  * Legend is now forbidden for text size style
  * Default value to grey for no value
  * Fix z-index issue
  * Update translation
  * fix popup tab validation error showing incorrectly
  * Show technical field name in all style select.
  * Update src/modules/RA/DataLayer/components/DataLayerForm.js
  * Manage tab error state with reducer
  * Remove react-jsonschema-form package
  * Call components from @rjsf/core package instead of react-jsonschema-form
  * Install "@rjsf/core" package
  * Remove sanitize empty value for scene form
  * Add more tab validation
  * Make categorized values sortable
  * Fix picture basePath
  * Fix patch layer dataprovider
  * Use same field option everywhere
  * Add field name to style
  * Sort categories
  * Add table placeholder
  * Add empty state
  * Better ui and translation
  * Add legend admin
  * Move legend tab in proper dir
  * Remove broken fonts
  * Sort icon by name
  * Default title field is not required
  * Remove asterix from field in popup/minisheet
  * Update template only when advanced mode is set to false specificaly
  * Add user settings hook
  * Fix logout bug
  * Rename useSettings to useAppSettings
  * Allow only superuser to set superuser status
  * Handle text and icon style
  * Move Zoom input in common place
  * Call permission field to userGroup module
  * Add Permissions ressource to RA
  * Display only RA modules with List component included to the Menu config
  * Call module configuration by auth provider instead of app provider
  * fix read modules in user settings
  * modules can be read in user attributes with terra-accounts > 1.0
  * Do not force advanced mode when popup/minisheet exists
  * Add advanced mode in user form
  * Add new fields in user form for further infos
  * Add validate function to prevent bad submit
  * Add table & filter tab validation
  * Add some form validation for tab
  * Make popup fields sortable
  * Force empty string value for field label (instead of undefined)
  * Fix drag handle area disappearing
  * Fix some wording
  * Set advanced mode to true by default
  * Put some space between field inputs
  * Fix initial value of TreeInput
  * Fix default legend value
  * Fix bad json input init
  * Fix style for better width
  * Fix bad field for extra style
  * Add field validation
  * Fix translation
  * Default 3 values for gradutation
  * Help user on classes
  * Avoid render loop with nested spreading on useinput
  * Remove default value for label
  * Add space for future previsualization (popup/minisheet)
  * Export geom layer files feature
  * Allow configuration only if source is defined
  * Fix template update not triggering
  * Harmonize placeholder between popup minisheet & style
  * Add field name as helper text
  * Use ZoomInput component for popup
  * remove forced z-index on minisheet row
  * return all fields as available if none define in popup
  * Increase color picker z-index
  * Fix mini-sheet template
  * Fix minisheet translation
  * Fix template generation trigger issue
  * Init default value form  for popup config & use field label
  * Fix category bug on changing field
  * Remove broken things
  * Add a more precise label for color picker
  * use field value instead of copying it
  * Add field as possible root node in wizard tree
  * Add label for color input
  * Bump ini from 1.3.5 to 1.3.7
  * Force default for empty value
  * Avoid generating mini-sheet if advanced mode
  * Fix image handling in scene
  * Fix undetected source
  * Fix translation
  * Lint: style editing
  * Fix default title in template cannot be undefined
  * Use a more userfriendly color picker
  * Add label for title field select
  * Disable Field input so it doesn't look it can b modify
  * Section is expanded by default when field is added
  * Fix template generation issue
  * Fix color picker reset when adding section
  * Make Template more readable
  * Add minisheet template generation
  * Code formating & style editing
  * MainField is the default title if defined
  * Add draggable & sortable minisheet tree form
  * WIP - new minisheet form ui
  * Add mandatory fields mention on GeometryField
  * Replace computation by function in initial useState values
  * Add default value for onChange
  * Fix fieldType number opacity
  * Color picker now handle alpha value
  * Add translations and enhance UI
  * Move colorPicker
  * Can generate legend now
  * Remove some file
  * Add categorization
  * UX refactoring
  * First xchange with the server working
  * Add extra layers and patch data for now
  * Split monolithic file in multiple files
  * Change workflow for style creation
  * Add advanced editor
  * Fix layout to save space
  * Fix advanced mode wording and style
  * Reorg code
  * Optimize AddControl and RemoveControl functions
  * Optimize DataTable/Actions component
  * Rename "context" from UserSettingsProvider to "UserSettingsContext"
  * Upgrade @blueprintjs/core to 3.36.0 version
  * Unable to determine Type if schema is not filled
  * Create BaseLayerType input to manage form values
  * Base map module
  * Create react-admin/RangeInput component
  * Manage Enum default value
  * Optimize Type component with useMemo
  * handle numerical condition & rounding for template
  * Update public/locales/en/translation.json
  * Popup form has now a title field by default
  * Add better field ui
  * Add title to popup form

3.0.0 / 2020-09-30
==================

  * Disable JSONInput default value to avoid infinite error loop
  * Extract DataLayerDataTableField component to a dedicated file
  * Extract DataLayerSourceField component to a dedicated file
  * Rename main DataLayer form component from DataLayerTabbedForm to DataLayerForm
  * Remove now useless components
  * Disable advanced tabs for layer with "external" sources (WMTS)
  * Create local state for managing is current source is external or not
  * Remove useless wrapping Fragment
  * Allow `null` as DraggableFormIterator child
  * Add MUI as peerDep to avoid a bunch of linting exceptions
  * Update src/modules/RA/DataLayer/components/FieldUpdater.js
  * Remove TreeInput default value as it break initial loading of tree
  * Fix SceneForm by extracting Name field
  * Memoize enabledResources
  * Memoize i18nProvider
  * Extract static dataProvider variable from inside component rendering
  * Get router history from hook instead of HOC
  * Put FieldUpdater component inside form
  * Read field data from `useField` instead of Redux state
  * Extract LayerStyleField and memoize default value
  * Avoid forwarding useless dispatch prop
  * Extract and fix SourceField in DataLAyerTabbedForm
  * Use `theme.spacing()` instead of deprecated `theme.spacing.unit`
  * Add Fragment as wrapper to avoid accidental props forwarding
  * Replace Button variant that doesn't exist anymore
  * Replace Typography variant that doesn't exist anymore
  * Upgrade react-scripts from 3.4.1 to 3.4.3
  * Upgrade @terralego/core from 1.20.2 to 1.20.2 (upgrade sub-dependencies)
  * Upgrade enzyme-adapter-react-16 from 1.15.2 to 1.15.4
  * Upgrade react-i18next from 11.3.5 to 11.7.2
  * Upgrade node-sass from 4.13.1 to 4.14.1
  * Upgrade react-paginate from 6.3.2 to 6.5.0
  * Upgrade react-mapbox-gl from 4.8.3 to 4.8.6
  * Upgrade react-i18next from 11.3.4 to 11.3.5
  * Upgrade query-string from 6.12.0 to 6.13.2
  * Upgrade react-sortable-tree from 2.7.1 to 2.8.0
  * Upgrade react-router & react-router-dom from 5.1.2 to 5.2.0
  * Upgrade i18next from 19.4.0 to 19.7.0
  * Install ra-language-french@3.8.5
  * Use useForm hook instead of dispatch(change())
  * Install react-autosuggest@10.0.2
  * Install material-ui-chip-input@1.1.0
  * Upgrade to new i18nProvider signature
  * Use multiline TextInput instead of LongTextInput
  * Rename Admin prop from appLayout to layout
  * Rename CardActions to TopToolbar
  * Use disabled TextInput instead of DisabledInput
  * Add missing translation for ra.action.unselect
  * Upgrade all dependencies related to react-admin
  * Upgrade ra-data-drf to a dev release so it does not require react-admin v2 specifically

2.15.0 / 2020-09-30
==================

  * Fix boolean value to display combine/uncombine features
  * Display warning about geometry replacement by import only if a draw started
  * Use ImportGeomFile in the project
  * Create ImportGeomFile component
  * Install @tmcw/togeojson package
  * Display singular name (if available) for title/submit when adding feature
  * Improve FitBoundButton appearance
  * Remove useless condition
  * Put in a tooltip the text content of delete feature
  * Cut off dead legacy code from old OPP admin UI
  * Fix some regressions after the support of multi geometries
  * Add combine/uncombine buttons for Multi* features edition
  * Manage creation/edition/deletion of Multi* features
  * Merge pull request #275 from Terralego/add-date-type-to-field
  * Add date as field type
  * Merge pull request #273 from Terralego/wmts-layer-do-not-need-style
  * Allow dataLayer view to clone element
  * Don't set default style when geom type is not defined
  * Add stackedCircles choice for legends
  * Add layer style wizard field in admin
  * Merge pull request #269 from Terralego/layer-main-field-can-be-empty
  * Allow empty value for datalayer mainfield
  * Update logo
  * Deactivate Campaign list module
  * Fix getLocale for ImportFile component
  * Deactivation of langDropDown
  * Set the language driven by api/settings
  * Get locale for the Map driven by the current language
  * Update public/locales/en/translation.json
  * improve translations
  * Add language selector to the main menu
  * Create change language component
  * Prefer i18config with english first
  * Fix some typo
  * Add 'languages' locales
  * add en translation
  * Set filters list if `terraOppSearchableProperties` is defined
  * Get mapConfig from `mapConfig` and now `map` key as fallback
  * Bump websocket-extensions from 0.1.3 to 0.1.4
  * Accept and format NumberType from JSON schema
  * Fix typo in french locale
  * Display image url + a button to open it in Picture attachment
  * Rename field header to use_header
  * CSV options are now boolean inputs
  * Rename src in coordinate_reference_system
  * Correct labels and sources names
  * Fix SelectInput value is NaN after first clic
  * Add formDataConsumer
  * Translate choices and inputs
  * Use translate function
  * Fix translations linting issues
  * Add CSV source form
  * Change color of no value CRUD information
  * Use FitboundButton component in details header
  * Create FitBoundButton component
  * Sanitize CategoryList HOC props
  * Use PictureSelector in RTEField to load image
  * Create PictureSelector component
  * Add props to attachment to render it selectable or not
  * Add props to attachment to render it editable or not
  * Refacto DeleteAttachment to use ConfirmDeletion component
  * Refacto DeleteFeature to use ConfirmDeletion component
  * Create a generic component for confirmation of deletion
  * Improve some code comments
  * Display import file
  * Create ImportFile component
  * Install some @uppy package
  * Create createAttachmentCategories function
  * Add saveAttachmentCategories service
  * Upgrade eslint-config-makina from 2.1.0 to 3.0.0
  * Display a message when there are no attachments yet
  * Split AttachmentList into AttachmentList and AttachmentItem
  * Remove useless translation
  * Update Map only if coordinates update for real
  * Add Edit and delete attachment features
  * Create Figcaption component to display and edit attachment's label
  * Create DeleteAttachment component
  * Create a service to save and delete attachments
  * Display new category feature if there are no categories listed
  * Create a form to select or create an attachment Category
  * Define some defaultValue props to tablefield if undefined
  * Fix detail CSS for Safari
  * Re-activate Attachments in menu detail
  * Refacto AttachmentView to use CategoryList
  * Create Attachments/Pictures components
  * Fix TableField if the uiSchema.items is not set
  * Fix native geolayer selector value conversion
  * Fix security issue (minimist) through npm audit
  * Upgrade dependencies

2.14.1 / 2020-04-08
===================

  * Lock netlify-cli to version 2.40

2.14.0 / 2020-04-08
===================

  * Upgrade react-scripts from 3.2.0 to 3.4.1
  * Upgrade required nodejs version from v10 to v12

2.13.0 / 2020-04-07
===================

  * Upgrade react-scripts from 3.1.1 to 3.2.0

2.12.0 / 2020-04-07
===================

  Use command `git log --oneline 2.11.0..2.12.0` to list all changes.

  Package upgrades only:

  * Upgrade @terralego/core package to 1.20.0
  * Import `uuid` as recommended by the package
  * Remove Bootstrap from packages
  * Install uuid package
  * Upgrade react-jsonschema-form package to 1.8.1
  * Add @mapbox/geojson-extent to package dependencies list
  * Upgrade react-i18next package to 11.3.3
  * Upgrade @terralego/core package to 1.18.0
  * Update i18next package to 19.3.2
  * Install react-app-polyfill package to the project
  * Add lodash.debounce package to the list of dependencies
  * Update @terralego/core to 1.17.3
  * Update @terralego/core package to 1.17.2
  * Install query-string package
  * Update react-paginate package to 6.3.2

2.11.0 / 2020-01-08
===================

  * Add translation for scene type (category) values
  * Move scene category field higher
  * Put scene name & slug side by side
  * Avoid forwarding `formData` prop to DOM element
  * Remove DataLayer name parsing for list display
  * Set order field from view (scene) form as mandatory
  * Remove order input from DataLayer form
  * Remove view (scene) selection from DataLayer form
  * Avoid rendering TreeInput when given value is invalid
  * Bump handlebars from 4.2.0 to 4.5.3
  * Re-add missing url for package-lock resolved keys
  * Use layer map control in detail view
  * Create layers map Control
  * Better display of features on Edit view
  * Improve add/remove map controls actions
  * Upgrade @terralego/core package to 1.15.0
  * Add a border (Paper) around TreeInput
  * Remove a ternary operator for JSX render
  * Disable scene icon data alteration patch
  * Allow uploading a file for scene tree generation
  * Add a recursion to correctly display all nested formats
  * Activate relevant filters and search on sources and layers
  * Improve map's detail styles
  * Disable bulk actions for geolayer list
  * Do not display DeleteButton for layers owned by a view or a group
  * Use compose() function for DataLayerFormSelector HOCs
  * Add a custom wrapper to FormTab to avoid rendering hidden tabs
  * Update react-admin to latest patch release
  * Temporary change scene tree property position
  * Do not forward isGroup prop as full node is already forwared
  * Regroup TreeInput styles in same place
  * Add translation for scene tree field
  * Store scene tree data into config property (instead of root)
  * Use label instead of title for scene tree nodes
  * Manage list of removed and added ids to improve new layer choices
  * Prevent layers from current tree to be added twice
  * Disallow adding a layer already owned by a group
  * Do not allow changing title of layers
  * Create group settings modal
  * Rename new layer modal state variables
  * Rename some components to reflect better their roles
  * Improve style of scene tree popin buttons
  * Display geolayer selector properly
  * Adjust scene tree groups look & feel
  * Simplify process for adding layers to scene tree
  * Add ability to attach a geolayer to a layer node in scene tree
  * Use a modal window for editing scene tree nodes
  * Allow editing title only for groups
  * Add ability to change scene tree node titles
  * Push TreeInput node actions in NodeMenuButton component
  * Add TreeInput buttons for adding child items
  * Create basic TreeInput for scenes
  * Bypass react-dnd issue with Jest
  * Add dependency to react-sortable-tree
  * Prefer ordering by view name
  * Uncomment filter on list view
  * DraggableFormIterator for layer fields ordering
  * Upgrade @terralego/core package to 1.14.3
  * Prevent app to crash if the server render a 400 generic error
  * Synchronize name of the layer and columns/data of datable
  * Set interaction only on a layer view
  * Add info tooltip when clicking on layer
  * Fix test for Menu Details
  * Fix missing order field on scene creation
  * Disabled 'attachments' and 'images' tab link in detail view
  * Display extra feature in detail feature view
  * Set interaction to the map only if this is necessary
  * Give all available space to the columns of the DataTable
  * Upgrade @terralego/core package to 1.14.0
  * Make sure all data are loaded in the map before filtering it
  * Display count of feature in list
  * Improve add feature button in Nav for UX purpose

2.10.0 / 2019-12-03
===================

  * Add ordering field in scene
  * Display all control of the map into the map
  * Rename fr locale CRUD label
  * Load icons for POI of the map
  * Load sources and layers on demand
  * Update @terralego/core package to 1.13.0
  * Avoid to display a non existing column
  * Fix redirect on pictures
  * Fix format_type key for columns table
  * Get BASE_LAYER from api/crud/settings and not api/settings anymore
  * Call the custom file widget instead of the react-json-schemaForm
  * Create custom file widget with an additional remove file feature
  * Improve geolayer name column rendering
  * Try to removeHighlight only if the map is loaded
  * Improve login form FR wordings
  * Add default value for lat/lng fields
  * Use background styles for Map component
  * Provide backgroundStyle prop from appProvider to Map component
  * Avoid highlighting features if the map is not mounted yet
  * Hande view order

2.9.0 / 2019-11-19
==================

  * Upgrade Terra-front to 1.10.1
  * Redirect to the first menu item view if none is selected
  * Fix viewpoint pictures repeat coordinates

2.8.0 / 2019-11-12
==================

  * Fix params given to the queryString when fetching feature list
  * Change permissions for geoCrud
  * Display rephoto info for earliest picture
  * Add datalayer `active_by_default` option
  * Refacto nav component for CRUD
  * Create NavGroup component
  * Create NavItem component
  * Add a default Icon for NavIcon
  * Remove useless animation from collapsing menu
  * Improve position of downdButtons component in the layout
  * Display DownloadButtons as a dropdown
  * Fix fatal error due to PictureRephotography
  * Prevent img to break the layout
  * Improve Grid templating for schema form
  * Fix `this.isActionUpdate()` call method
  * Hotfix a GridList issue
  * Set rephotography properties as read-only from first picture
  * Improve related documents handling
  * Remove useless "my account" entry menu
  * Manage recursive field errors
  * Render an error more explicit when server can't save feature
  * Use maxLength prop for RTEField
  * Use placeholder props in RTEField
  * Remove useless componentDidUpdate method from RTEField component
  * Integrate Menu and Attachment view to Read component
  * Create AttachmentView component for details
  * Create a Menu component for details
  * Revert DataTable sorting driven by API endpoint
  * Display viewpoint index instead of technical id in list
  * Use history everywhere to navigate instead of hash
  * Separate Read's content from Read component
  * Isolate Metas buttons from details to a dedicated component
  * Isolate details Header to a dedicated component

2.7.0 / 2019-10-25
==================

  * Fix source in referenceInput to select view
  * Call fetchSettings with custom endpoint as parameter
  * Call getSettings method with settingsEndpoint parameter
  * Move sanitizeCustomEndpoint method to a separate file
  * Refacto HOC Details/Actions/index.js by using compose() method
  * Refacto HOC Details/Edit/index.js by using compose() method
  * Refacto HOC view/Map/index.js by using compose() method
  * Set mapConfig driven by API (no more mock)
  * Request the api for sorting columns in DataTable
  * Call getFeaturesList each times is necessary instead of store it
  * Display an Error message when the app cannot fetch api/settings
  * Move Message component from modules/CRUD/components to /src/components
  * Change source of input mainField
  * Refacto fetch viewlist
  * Update endpoint to fetch list of views
  * Add Edit and Create View
  * Re-enable picture owner name display on forms
  * Hide status from viewpoint picture list
  * Remove focal field from picture edit first tab
  * Add "Photographie" translation in picture list
  * Fix default value in setSchema method
  * Add view list of views
  * Change source managment for authorized groups
  * Move schemaForm logic from Detail to Edit component
  * Delete the font call which does not exist
  * Allow scrolling only of content of read component
  * Call features urls endpoint driven by views
  * Change geocrud permissions by the new ones
  * Do not display group name icon when minifying the menu
  * Call glyphicons needed to display bootstrap icons

2.6.0 / 2019-10-11
==================

  * Split DateTimeInput in two component DateInput & TimeInput
  * Add Table view in Read component
  * Change default redirect to list (show does not exist for now)
  * Override undoable prop for DeleteWithConfirmButton
  * Extract CancelButton component to avoid wrapping with fragment
  * Sanitize props forwarded to Toolbar (remove withRouter() props)
  * Replace Toolbar filler by an auto margin
  * Reorganize Toolbar component (indents & spacings)
  * Remove unrecognize showTime props
  * Remove Remarks input from Picture create/edit form
  * Disable owner/photographer management (comment out)
  * Improve CSS for detail component
  * Rise the page size of featureList
  * Add some documentation
  * Rewrite simplier default action
  * Add redirect on delete button with new toolbar
  * Fix error when owner is missing
  * Set interactions only on READ views
  * Rename referrer in redirect
  * Can save image from viewpoints
  * Add toMultipart dataprovider decorator
  * Add referrer info for picture edition
  * Add form tabs to Picture forms (Create & Edit)
  * Patch dataProvider for picture resource
  * Change some fields (owner & thumbnail) in Picture list view

2.5.0 / 2019-10-10
==================

  * Add widgets configuration field in geolayer edit form
  * Handle related documents
  * Remove OPP entry
  * Improve readability in GridPictureList
  * Change some viewpoint wording
  * Change pictures DataGrid into card ListGrid
  * Use early return when Map is not loaded
  * Change image thumbnail path
  * Create and use withMapConfig() HOC in place of connectAppProvider()
  * Remove an external dependency warning
  * Setup ReferenceField for picture photographer (disabled for now)
  * Display index instead of id, and point instead of geometry
  * Get app config for Map from AppProvider
  * Remove withViewpointIds detaProvider decorator as back-end api manage it properly
  * Add Create et Edit for picture
  * Remove export button from Picture list
  * Add EditButton for Picture list
  * Add missing 's' to resource views variable
  * Create list view for Picture resource

  * Improve READ component formatted props for arrays and object render values
  * Fix updateSchemaPropertiesValues with recursion objects
  * Use resource constant instead of raw string
  * Build schemaForm with recursion
  * Modify Read template to match with API call changed
  * Make DownloadButtons component workable with the API breaking Changes
  * Replace layer API call by crud/layer ones
  * Set default value to getView
  * Adapt CSS following the change of bootstrap version
  * Downgrade Bootstrap package to 3.3.7 and call it
  * Set fitBounds duration to 0 (no more animation)
  * Refacto getLayer method to getView
  * Build DataTable now with feature_list_properties key
  * Get the extent of the layer by the API; no computation anymore
  * Move the call of getFeatureList from views/Map to DataTable component

2.4.0 / 2019-10-01
==================

  * Regroup some form property & inline display
  * Change "commune" translation key
  * Remove export from Viewpoint List
  * Include RTEField in projet and manage its display
  * Add RTE field to ui:field
  * Add a default label component to custom ui:fields
  * Add quill package
  * Use PropTypes instead of argument default value for ViewpointFields component
  * Display latitude & longitude inputs inline
  * Get cities & themes from back-end data
  * Override i18next language detection to french
  * Create MapPointInput component for coordinates field
  * Add dependency to react-mapbox-gl

2.3.0 / 2019-09-30
==================

  * Use fetch feature API instead of searching in the current featureList
  * Replace `terra` prefix permissions by `geostore`
  * Move mainfield + Update label and helpertext

2.2.0 / 2019-09-26
==================

  * Add an edit button for picture List in ViewpointFields
  * Add picture display in picture list of a given Viewpoint
  * Adapt CRUD config with the API breaking change
  * Add groups field for DataSource
  * Use native RA translation management
  * Remove useless translate() HOC around DataSourceMainFields component
  * Remove useless translate() HOC around DataSource component
  * Remove pagination override as back-end now properly manage it
  * Increase data-source field pagination everywhere
  * Increase source field pagination
  * Add BackToList button for each RA user/group Create/Edit forms
  * Add BackToList button for each RA Create/Edit forms
  * Rename Templates component to DownloadButtons
  * Fix Bootstrap CSS not supported by 4+ versions
  * Improve CSS positions for read and templates components
  * Replace "informations" title by the schema title if it filled

2.1.0 / 2019-09-25
==================

  * Add paths for RA FormTab's
  * Use compose() for SourceFetcher HOCs
  * Change memoization index for SourceFetcher useEffect to avoid looped api calls
  * Avoid app crash when trying to obtain user permissions with expired token
  * Manage numeric prop display for the read view

2.0.0 / 2019-09-24
==================

  * Filter MenuDropdown content by enabledModules
  * Use compose helper for MenuDropdown HOC
  * Filter out from  dashboard links from not enabled modules
  * Fix default endpoint path for groups
  * Redirect to default route only if valid
  * Order properties driven by UI:Order
  * Get settings from views and not in layer anymore
  * Use permissions for AppSummary
  * Use permissions to enable/disable RA resource access
  * Create HOC for getting user permissions
  * Decompose dataProvider modifiers and provide picture_ids to Viewpoint
  * Small formatting improvement
  * Improve and test of details/Actions component
  * Improve and test Read component
  * Integrates templates buttons in read component
  * Create Template component
  * Add library + Add color picker field
  * Remove Viewpoint grid list checkboxes
  * Use generic guesser object for unspecified RA views
  * Add tabs for viewpoint data
  * Add explaination comments for data provider enhancer
  * Use constant for resource name
  * Remove search useless component
  * Test ErrorListTemplate component
  * Refacto and test Edit component
  * Refacto and test Details component
  * Fix some CRUDProvider test
  * Refacto try...catch logic in CRUD services
  * Symplify code from CRUD services
  * Display an error message when it's unable to load settings
  * Improve map views and test
  * Improve and test CRUDProvider services
  * Revamp AppSummary with 'menu' instead of 'nav'
  * Regroup nav items by module
  * Manage menu content with a more standard setup
  * Create edit/create views for Viewpoint resource
  * Keep standard react-admin layout component (only hide extraneous elements)
  * Create a basic grid view for viewpoints
  * Create RA placeholders with ListGuesser for OPP resources
  * Do not render react-admin wrapper if not any module is available
  * Fix translations for RA modules menu items
  * Allow Array in path property of a module
  * Manage RA modules permissions
  * Add a compose() function for function composition
  * Use constants for resource name & drop old config files
  * Remove useless provider proxy file
  * Regroup RA module configs
  * Simplify resource name management
  * Move all react-admin resource modules inside RA module
  * Regroup all react-admin views in a single module
  * Add trailing slash to avoid useless 301 redirection

1.0.0 / 2019-09-11
==================

  * First major release

