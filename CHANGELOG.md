
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

