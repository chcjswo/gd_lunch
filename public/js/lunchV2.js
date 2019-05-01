const getCurrentDate = () => {
    const d = new Date();

    return `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

/**
 * 식당 리스트 만들기
 * @param {data} 식당 리스트 Array
 */
const makeRestaurantItem = data => {
    return data.reduce((html, item) => {
        html += `<div class="media text-muted pt-3" id="r-${item._id}">
			<svg
				class="bd-placeholder-img mr-2 rounded"
				width="32"
				height="32"
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid slice"
				focusable="false"
				role="img"
				aria-label="Placeholder: 32x32">
				<title>Placeholder</title>
				<rect width="100%" height="100%" fill="#007bff"></rect>
				<text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text>
			</svg>
			<div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
				<div class="d-flex justify-content-between align-items-center w-100">
					<strong class="text-gray-dark">${item.name}</strong>
					<a href="#" onClick="onClickRemove('${item._id}')">삭제</a>
				</div>
				<span class="d-block">
					<span id="v-${item._id}">${item.visitCount}</span>번 방문 /
					<span id="c-${item._id}">${item.choiceCount}</span>번 선택
				</span>
			</div>
		</div>`;
        return html;
    }, "");
};

/**
 * 식당 리스트 보여 주기
 */
function showRestaurantList() {
    $(".loading").show();

    $.ajax({
        type: "get",
        contentType: "application/json",
        url: "/api/v2/lunch/"
    })
        .done(function(data) {
            $(".restaurantList").append(
                makeRestaurantItem(data.restaurantList)
            );
            if (data.restaurantName) {
                $("#today").html(`${data.lunchDate} 선택된 식당`);
                $("#todayRestaurant").html(
                    `오늘은 <b>${data.restaurantName}</b> 입니다.`
                );
                $("#todayLunch").show();
                $("#isDecistion").val("Y");
            }
        })
        .fail(function(data) {
            alert(data.responseJSON.message);
        })
        .always(function() {
            $(".loading").hide();
        });
}

const notify = (text, type, offsetY = 400) => {
    $.notify(text, {
        width: 100,
        offset: {
            x: 0,
            y: offsetY
        },
        spacing: 20,
        z_index: 1031,
        type,
        allow_dismiss: true,
        delay: 100,
        timer: 500
    });
};

/**
 * 식당 추가
 */
const onClickAddRestaurant = () => {
    const name = $("#restaurantName").val();

    if (name === "") {
        notify("식당 이름을 입력해주세요.", "danger", 10);
        return;
    }

    $(".loading").show();

    $.ajax({
        type: "post",
        contentType: "application/json",
        url: "/api/v2/lunch",
        data: JSON.stringify({ name })
    })
        .done(function(data) {
            notify("식당을 추가 했습니다.", "success", 10);
            $("#restaurantName").val("");
            $(".restaurantList").append(makeRestaurantItem(data));
        })
        .fail(function(data) {
            alert(data.responseJSON.message);
        })
        .always(function() {
            $(".loading").hide();
        });
};

/**
 * 식당 선택
 */
const onClickChoiceRestaurant = () => {
    if ($("#isDecistion").val() === "Y") {
        notify("오늘은 이미 식당이 결정 됐습니다.", "info", 10);
        return;
    }

    $(".loading").show();

    $.ajax({
        type: "post",
        contentType: "application/json",
        url: "/api/v2/lunch/choice"
    })
        .done(function(data) {
            $("#todayLunch").hide();
            $("#myModal").modal();

            $(".modal-title").html(`${getCurrentDate()} 점심 식당은??`);
            $(".modal-body").html(`오늘은 <b>${data.name}</b> 어떤가요???`);
            $("#c-" + data._id).html(data.choiceCount);
            $("#choiceRestaurantNo").val(data._id);
            $("#choiceRestaurantName").val(data.name);
        })
        .fail(function(data) {
            alert(data.responseJSON.message);
        })
        .always(function() {
            $(".loading").hide();
        });
};

/**
 * 식당 결정
 */
const onClickDecisionRestaurant = () => {
    $(".loading").show();

    const restaurantNo = $("#choiceRestaurantNo").val();
    const restaurantName = $("#choiceRestaurantName").val();

    $.ajax({
        type: "post",
        contentType: "application/json",
        url: "/api/v2/lunch/decision",
        data: JSON.stringify({ no: restaurantNo })
    })
        .done(function() {
            let visitCount = parseInt($("#v-" + restaurantNo).html());
            visitCount++;
            $("#v-" + restaurantNo).html(visitCount);

            $("#today").html(`${getCurrentDate()} 선택된 식당`);
            $("#todayRestaurant").html(
                `오늘은 <b>${restaurantName}</b> 입니다.`
            );
            $("#todayLunch").show();
            $("#isDecistion").val("Y");
        })
        .fail(function(data) {
            alert(data.responseJSON.message);
        })
        .always(function() {
            $(".loading").hide();
        });
};

/**
 * 식당 삭제 클릭 이벤트
 * @param {no} 식당 아이디
 */
function onClickRemove(no) {
    if (!confirm("식당을 삭제 하시겠습니까??")) {
        return;
    }

    $(".loading").show();

    $.ajax({
        type: "delete",
        contentType: "application/json",
        url: "/api/v2/lunch",
        data: JSON.stringify({ no })
    })
        .done(function() {
            $("#r-" + no).remove();
            notify("삭제 했습니다.", "success", 10);
        })
        .fail(function(data) {
            alert(data.responseJSON.message);
        })
        .always(function() {
            $(".loading").hide();
        });
}

$(function() {
    BootstrapDialog.show({
        message: "Hi Apple!"
    });
    showRestaurantList();
    $(".addRestaurant").click(function() {
        onClickAddRestaurant();
    });
    $(".choiceRestaurant").click(function() {
        onClickChoiceRestaurant();
    });
    $(".decisionRestaurant").click(function() {
        onClickDecisionRestaurant();
    });
    $("#restaurantName").keydown(function(key) {
        if (key.keyCode == 13) {
            onClickAddRestaurant();
        }
    });
});
