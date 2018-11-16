var components = [].slice.call(document.querySelectorAll('link[rel="import"][type="text/html"]'));
components.forEach(function(component) {
  if ('import' in component) {
    var template = component.import.querySelector('template');
    document.querySelector(template.getAttribute('for')).innerHTML = template.innerHTML;
    if (component.onload) component.onload();
  }
  else {
    // Fallback: using jquery.
    $.get( component.href , function(data) {
      var template = $(data);
      document.querySelector(template.attr('for')).innerHTML = template.html();
      if (component.onload) component.onload();
    });
  }
});
