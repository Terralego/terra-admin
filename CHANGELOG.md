
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

