const mockedInteraction = {
  interactions: [
    {
      id: 'terralego-chemins',
      interaction: 'displayTooltip',
      trigger: 'mouseover',
      template: `
{% if name %}{{name}}{% else %}Non renseigné{% endif %}
      `,
    }, {
      id: 'terralego-biens',
      interaction: 'displayTooltip',
      trigger: 'mouseover',
      template: `
{{osm_id}}
`,
    }, {
      id: 'terralego-tampon',
      interaction: 'displayTooltip',
      trigger: 'mouseover',
      template: `
{{name}}
`,
    }, {
      id: 'terralego-biens_polygon',
      interaction: 'displayTooltip',
      trigger: 'mouseover',
      template: `
{{name}}
`,
    }, {
      id: 'terralego-chemins',
      interaction: 'viewFeature',
    }, {
      id: 'terralego-biens',
      interaction: 'viewFeature',
    }, {
      id: 'terralego-tampon',
      interaction: 'viewFeature',
    }, {
      id: 'terralego-biens_polygon',
      interaction: 'viewFeature',
    }, {
      id: 'terralego-composantes',
      interaction: 'viewFeature',
    },
  ],
};

export default mockedInteraction;
