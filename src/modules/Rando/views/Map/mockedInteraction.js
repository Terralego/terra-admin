const TEMPLATE_DETAILS_CHEMINS = `
<div class="details">
  <h2 class="details__title">
    {% if name %}{{name}}{% else %}Non renseigné{% endif %}
  </h2>
  <div class="details_content">
    <h3 class="details__subtitle">
      Informations
    </h3>
    <ul class="details__list">
      <li class="details__list-item">
        <strong class="details__list-label">_id</strong>
        <span class="details__list-value{% if not _id %} details__list-value--empty{% endif %}">
          {% if _id %}{{_id}}{% else %}Non renseigné{% endif %}
        </span>
      </li>
      <li class="details__list-item">
        <strong class="details__list-label">Name</strong>
        <span class="details__list-value{% if not name %} details__list-value--empty{% endif %}">
          {% if name %}{{name}}{% else %}Non renseigné{% endif %}
        </span>
      </li>
      <li class="details__list-item">
        <strong class="details__list-label">osm_id</strong>
        <span class="details__list-value{% if not osm_id %} details__list-value--empty{% endif %}">
          {% if osm_id %}{{osm_id}}{% else %}Non renseigné{% endif %}
        </span>
      </li>
      <li class="details__list-item">
        <strong class="details__list-label">highway</strong>
        <span class="details__list-value{% if not highway %} details__list-value--empty{% endif %}">
          {% if highway %}{{highway}}{% else %}Non renseigné{% endif %}
        </span>
      </li>
      <li class="details__list-item">
        <strong class="details__list-label">z_order</strong>
        <span class="details__list-value{% if not z_order %} details__list-value--empty{% endif %}">
          {% if z_order %}{{z_order}}{% else %}Non renseigné{% endif %}
        </span>
      </li> 
      <li class="details__list-item">
        <strong class="details__list-label">other_tags</strong>
        <span class="details__list-value{% if not other_tags %} details__list-value--empty{% endif %}">
          {% if other_tags %}{{other_tags}}{% else %}Non renseigné{% endif %}
        </span>
      </li>      
    </ul>
  </div>
</div>
`;

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
      interaction: 'displayDetails',
      template: TEMPLATE_DETAILS_CHEMINS,
    },
  ],
};

export default mockedInteraction;
