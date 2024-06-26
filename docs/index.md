<ul>
  {% for doc in site.pages -%}
  <li><a href="{{ doc.url | absolute_url }}">{{ doc.title }}</a></li>
  {%- endfor %}
</ul> 
