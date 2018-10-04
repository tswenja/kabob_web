(function() {
  // Set current locale value.
  document.querySelectorAll('.i18n_selector > select > option').forEach(function(option) {
    if (location.pathname.indexOf(option.value) >= 0) {
      option.selected = true;
    }
  });

  // Enable element onchange.
  var hostName = location.protocol + '//' + location.host,
      currentPathNodes = location.pathname.slice(1).split('/');
  if (hostName.indexOf('github') >= 0) {
    var webRootPath = '/' + currentPathNodes.slice(0, 1);
  } else {
    var webRootPath = '';
  }
  document.querySelectorAll('.i18n_selector > select').forEach(function(select) {
    select.onchange = function() {
      var locale = this.value == "tw" ? "" : "/" + this.value;
      location = hostName + webRootPath + locale + '/' + currentPathNodes.slice(-1);
    };
  });
})();
