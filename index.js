var activeName = "games";

function updateActiveHighlight() {
  $(".nav-link").each(function() {
    if (activeName === String($(this).html()).toLowerCase()) {
      $(this).css("background-color", "#FF00E9");
    } else {
      $(this).css("background-color", "#A60798");
    }
  })
}

$(document).ready(function() {

  updateActiveHighlight();

  $(".nav-link").each(function() {
    $(this).click(function() {
      window.scrollTo(0, 0);
      var name = String($(this).html()).toLowerCase();
      $(".section").hide();
      $("#".concat(name)).show();
      activeName = name
      updateActiveHighlight();
    });
  });
});