
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

