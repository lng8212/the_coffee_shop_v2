const API_URL = "http://localhost:8080/CoffeeShop";

$(document).ready(function () {
  $(document).ajaxStart(function () {
    $(".loading").css("display", "flex");
  });
  $(document).ajaxStop(function () {
    $(".loading").hide();
  });

  $.ajax({
    url: `${API_URL}/news`,
    success: function (result) {
      console.log(result);

      $("#getNewsBlog").empty();

      if (result) {
        result.forEach((item, index) => {
          $("#getNewsBlog").append(`
            <div class="new-item">
                    <img src="${item.img}"
                        alt="${item.name_news}" />
                    <div class="new-item-content">
                        <h3>${item.name_news}</h3>
                        <div class="new-btn">
                            <a href="/blogs/detail?id=${item.id_news}">Đọc tiếp</a>
                        </div>
                    </div>
                </div>
            `);
        });
      }
    },
  });
});
