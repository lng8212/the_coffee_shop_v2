const API_URL = "http://localhost:8080/CoffeeShop";

const queryString = window.location.search;
console.log(queryString);

const urlParams = new URLSearchParams(queryString);

const id = urlParams.get("id");
console.log(id);

$(document).ready(function () {
  $(document).ajaxStart(function () {
    $(".loading").css("display", "flex");
  });
  $(document).ajaxStop(function () {
    $(".loading").hide();
  });
  $.ajax({
    url: `${API_URL}/news?id=${id}`,
    success: function (result) {
      console.log(result);

      $("#nameDetailNews").empty();
      $("#descriptDetailNews").empty();

      if (result) {
        $("#nameDetailNews").text(result[0].name_news);
        $("#descriptDetailNews").text(result[0].descript);
      }
    },
  });
});
