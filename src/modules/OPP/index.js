export const config = {
  title: 'opp.title',
  namespace: 'opp',
  nav: [{
    label: 'opp.nav.foo',
    href: 'foo',
  }, {
    label: 'opp.nav.bar',
    href: 'bar',
  }],
  routes: [{
    path: '/foo',
    import: () => import('./Foo'),
  }, {
    path: '/bar',
    import: () => import('./Bar'),
  }],
};

export default config;
