$(document).ready(function () {
  $("body").on("mouseover", "img", function () {
    $(this).css("-webkit-filter", "none");
  });

  $("body").on("mouseout", "img", function () {
    $(this).css("-webkit-filter", "grayscale(100%)");
  });
});