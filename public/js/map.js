const mapOptions = {
    center: new naver.maps.LatLng(37.504604594, 127.0224165),
    zoom: 16
};

let map = new naver.maps.Map('map', mapOptions);

marker = new naver.maps.Marker({
    map: map,
    position: new naver.maps.LatLng(37.504604594, 127.0224165),
});

const markerList = [];
const infoWindowList = [];

function clickMap(index) {
    return function () {
        const infoWindow = infoWindowList[index];
        infoWindow.close();
    }
}

function viewInfo(index) {
    return function () {
        const marker = markerList[index];
        const infoWindow = infoWindowList[index];

        if (infoWindow.getMap()) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
    }
}

let currentUse = true;

$('#current').on('click', function () {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latlng = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
            if (currentUse) {
                marker = new naver.maps.Marker({
                    map: map,
                    position: latlng,
                    icon: {
                        content: "<img class='pulse' draggable='false' unselectable='on' src='https://myfirstmap.s3.ap-northeast-2.amazonaws.com/circle.png' />",
                        anchor: new naver.maps.Point(11, 11)
                    }
                });
                currentUse = false;
            }
            map.setZoom(14, false);
            map.panTo(latlng);
        });
    } else {
        alert("위치정보 사용 불가능");
    }
});

$('#index').on('click', function () {
    location.href = '/';
});

const ps = new kakao.maps.services.Places();
const search_arr = [];

$('#search_input').on('keydown', function (e) {
    const keyword = $(this).val();

    if (e.keyCode === 13) {

        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }
        ps.keywordSearch(keyword, placeSearch);
    }
});

$('#search_button').on('click', function () {
    const keyword = $('#search_input').val();

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }
    ps.keywordSearch(keyword, placeSearch);
});

function placeSearch(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        makeMarker(data);
    } else {
        alert('검색결과가 없습니다.');
    }
}

// const data = [
//     {
//         place_name: "서울",
//         place_url: "서울 남산",
//         address_name: "2020-10-18",
//         x: 37.550998,
//         y: 126.990862
//     }, {
//         place_name: "서울",
//         place_url: "서울 용산",
//         address_name: "2020-10-17",
//         x: 37.529889,
//         y: 126.964593
//     }
// ];

// const data =
//     [
//         {
//             "address_name":"서울 서초구 반포동 736","category_group_code":"FD6","category_group_name":"음식점","category_name":"음식점 \u003e 한식 \u003e 육류,고기 \u003e 갈비","distance":"","id":"513835912","phone":"02-540-1225","place_name":"강소식당","place_url":"http://place.map.kakao.com/513835912","road_address_name":"서울 서초구 사평대로57길 72","x":"127.022258233922","y":"37.5073994520171"
//         },
//         {
//             "address_name":"경기 수원시 영통구 매탄동 1267-3","category_group_code":"FD6","category_group_name":"음식점","category_name":"음식점 \u003e 한식 \u003e 육류,고기","distance":"","id":"70388711","phone":"","place_name":"강소식당 수원매탄점","place_url":"http://place.map.kakao.com/70388711","road_address_name":"경기 수원시 영통구 효원로 387","x":"127.043950654631","y":"37.2592369787024"
//         }
//     ];

// data.forEach(function (item) {
//     console.log('x', item.x);
//     console.log('y', item.y);
//     const latlng = new naver.maps.LatLng(item.y, item.x);
//     console.log(latlng);
//     marker = new naver.maps.Marker({
//         map: map,
//         position: latlng
//     });
//
//     const content = `<div class='infoWindow_wrap'>
//             <div class='infoWindow_title'>${item.place_name}</div>
//             <div class='infoWindow_content'>${item.place_url}</div>
//             <div class='infoWindow_date'>${item.address_name}</div>
//             ${item.phone ? '<div class=\'infoWindow_date\'>' + item.phone + '</div>' : ''}
//         </div>`;
//
//     const infoWindow = new naver.maps.InfoWindow({
//         content: content,
//         backgroundColor: "#00ff0000",
//         borderColor: "#00ff0000",
//         anchorSize: new naver.maps.Size(0, 0)
//     });
//
//     markerList.push(marker);
//     infoWindowList.push(infoWindow)
// });
//
// for (let i = 0, length = markerList.length; i < length; i++) {
//     naver.maps.Event.addListener(map, 'click', clickMap(i));
//     naver.maps.Event.addListener(markerList[i], 'click', viewInfo(i));
// }

function makeMarker(data) {
    data.forEach(function (item) {
        const latlng = new naver.maps.LatLng(item.y, item.x);
        marker = new naver.maps.Marker({
            map: map,
            position: latlng
        });

        const content = `<div class='infoWindow_wrap'>
            <div class='infoWindow_title'>${item.place_name}</div>
            <div class='infoWindow_content'>${item.place_url}</div>
            <div class='infoWindow_date'>${item.address_name}</div>
            <div class='infoWindow_date'>${item.phone}</div>
        </div>`;

        const infoWindow = new naver.maps.InfoWindow({
            content: content,
            backgroundColor: "#00ff0000",
            borderColor: "#00ff0000",
            anchorSize: new naver.maps.Size(0, 0)
        });

        markerList.push(marker);
        infoWindowList.push(infoWindow)
    });

    // map.setZoom(16, false);
    // map.panTo(latlng);

    for (let i = 0, length = markerList.length; i < length; i++) {
        naver.maps.Event.addListener(map, 'click', clickMap(i));
        naver.maps.Event.addListener(markerList[i], 'click', viewInfo(i));
    }
}

$(function() {
    const search = $('#search_input').val();
    if (search.replace(/^\s+|\s+$/g, '')) {
        ps.keywordSearch(search, placeSearch);
    }
});
