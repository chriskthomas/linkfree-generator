<ul>
  {% for doc in site.pages -%}
    {%- if doc.title -%}
      <li><a href="{{ doc.url | absolute_url }}">{{ doc.title }}</a></li>
    {%- endif -%}
  {%- endfor %}
</ul> 
