const getCurrentDate = () => {
    const d = new Date();

	return `${d.getFullYear()}-${(d.getMonth() + 1)
		.toString().padStart(2, '0')}-${d.getDate()
			.toString().padStart(2, '0')}`;
};

/**
 * 식당 리스트 만들기
 * @param {data} 식당 리스트 Array
 */
const makeRestaurantItem = (data) => {
	return data.reduce((html, item) => {
		html += `<div class="media text-muted pt-3" id="r-${item.no}">
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
					<a href="#" onClick="onClickRemove('${item.no}')">삭제</a>
				</div>
				<span class="d-block">
					<span id="v-${item.no}">${item.visitCount}</span>번 방문 / 
					<span id="c-${item.no}">${item.choiceCount}</span>번 선택
				</span>
			</div>
		</div>`;
		return html
	}, '');
};

/**
 * 유저 리스트 보여 주기
 */
function showRestaurantList() {
	$('.loading').show();

	$.ajax({
		type: 'get',
		contentType: 'application/json',
		url: '/api/v1/lunch/'
	}).done(function(data) {
		$('.restaurantList').append(makeRestaurantItem(data));
	}).fail(function(data) {
		alert(data.responseJSON.message);
	}).always(function() {
		$('.loading').hide();
	});
}

$(".alert button.close").click(function (e) {
    $(this).parent().fadeOut(300);
});

const notify = (text, type) => {
	$.notify(text, {
		width: 100,
		offset: {
			x: 0,
			y: 400
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
	const name = $('#restaurantName').val();

	if (name === '') {
		notify('식당 이름을 입력해주세요.', 'danger');
		return;
	}

	$('.loading').show();

	$.ajax({
		type: 'post',
		contentType: 'application/json',
		url: '/api/v1/lunch',
		data: JSON.stringify({ name })
	}).done(function(data) {
		$('#restaurantName').val('');
		$('.restaurantList').append(makeRestaurantItem(data));
	}).fail(function(data) {
		alert(data.responseJSON.message);
	}).always(function() {
		$('.loading').hide();
	});
};

/**
 * 식당 선택
 */
const onClickChoiceRestaurant = () => {
	$('.loading').show();

	$.ajax({
		type: 'post',
		contentType: 'application/json',
		url: '/api/v1/lunch/choice'
	}).done(function(data) {
		$('#todayLunch').hide();
		$('#myModal').modal();
	
		$('.modal-title').html(`${getCurrentDate()} 점심 식당은??`);
		$('.modal-body').html(`오늘은 <b>${data.name}</b> 어떤가요???`);		
		$('#c-' + data.no).html(data.choiceCount);
		$('#choiceRestaurantNo').val(data.no);
		$('#choiceRestaurantName').val(data.name);
	}).fail(function(data) {
		alert(data.responseJSON.message);
	}).always(function() {
		$('.loading').hide();
	});
};

/**
 * 식당 결정
 */
const onClickDecisionRestaurant = () => {
	$('.loading').show();

	const restaurantNo = $('#choiceRestaurantNo').val();
	const restaurantName = $('#choiceRestaurantName').val();

	$.ajax({
		type: 'post',
		contentType: 'application/json',
		url: '/api/v1/lunch/decision',
		data: JSON.stringify({ no: restaurantNo })
	}).done(function () {
		let visitCount = parseInt($('#v-' + restaurantNo).html());
		visitCount++;
		$('#v-' + restaurantNo).html(visitCount);
		
		$('#today').html(`${getCurrentDate()} 선택된 식당`);
		$('#todayRestaurant').html(`오늘은 <b>${restaurantName}</b> 입니다.`);
		$('#todayLunch').show();

		// alert(`오늘의 점심 식당은 ${restaurantName}(으)로 선택 하셨습니다.`);
	}).fail(function(data) {
		alert(data.responseJSON.message);
	}).always(function() {
		$('.loading').hide();
	});
};

/**
 * 유저 리스트 tr 만들기
 * @param {data} 유저 리스트 Array
 */
function makeUsersList(data) {
	return data.reduce((html, item) => {
		html += `<tr class="show-detail" style="cursor: pointer"
		data-user-id="${item.id}">
        <td class="v-align-middle">${item.id}</td>
        <td class="v-align-middle">${item.email}</td>
        <td class="v-align-middle">${item.displayName}</td>
        <td class="v-align-middle">${item.provider}</td>
        <td class="v-align-middle">${item.hp}</td></tr>`;
		return html
	}, '');
}

/**
 * 식당 삭제 클릭 이벤트
 * @param {no} 식당 아이디
 */
function onClickRemove(no) {
	const data = {
		no
	};

	$('.loading').show();

	$.ajax({
		type: 'delete',
		contentType: 'application/json',
		url: '/api/v1/lunch',
		data: JSON.stringify(data)
	}).done(function () {
		$('#r-' + no).remove();
		alert('삭제 했습니다.');
	}).fail(function(data) {
		alert(data.responseJSON.message);
	}).always(function() {
		$('.loading').hide();
	});
}

$(function() {
	showRestaurantList();
	$('.addRestaurant').click(function () {
		onClickAddRestaurant();
	});
	$('.choiceRestaurant').click(function () {
		onClickChoiceRestaurant();
	});
	$('.decisionRestaurant').click(function () {
		onClickDecisionRestaurant();
	});
	$('#restaurantName').keydown(function (key) {
		if (key.keyCode == 13) {
			onClickAddRestaurant();
		}
	});
});
