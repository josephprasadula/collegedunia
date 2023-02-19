const filePath = "./data.json";
let filter = document.querySelector('#filter')
let sorter = document.querySelector('#sorter')
let search = document.querySelector('#search')
let itemsPerPage = 6;
let collegeData, k, start = 0; end = 0;
let result;
function renderCardGrid(array, start, end) {
    // console.log(array);
    array?.slice(start, end).map((item) => {
        temp = `<div class="card">
        <div class=" relative w-100">
            <div class="college-details flex align-center h-20  w-100">
                <img style="width:15%;height: 80%;margin: 0rem 10px; "
                    src="https://images.collegedunia.com/public/college_data/images/logos/col30730.png?h=80&w=80&mode=stretch"
                    alt="college logo">
                <div>
                    <div class="h-80 f-w-400">
                        <span>${item?.name}</span><br>
                        <span>-[${item?.short}],${item?.location.split(',')[1]}</span><br>
                    </div>
                    <span style="color:black;font-size: 10px;" class="flex align-center h-20"><ion-icon
                            name="location-outline"></ion-icon style='font-size: 12px;'>${item?.location}</span>
                </div>
            </div>
            <div class="card-top  h-40  w-100">
                <div class="flex justify-between p-10">
                    <div class="flex justify-between w-25 align-center">
                        <div class="flex align-center f-w-600"><ion-icon name="image-outline"></ion-icon>42</div>
                        <div class="flex align-center f-w-600"><ion-icon name="videocam-outline"></ion-icon>2
                        </div>
                    </div>
                    <div class="flex justify-between w-50 align-center">
                        <div><ion-icon name="business-outline"></ion-icon></div>
                        <div style="font-size: 10px;text-align: end;">College Dunia ratings <br> <span
                            class=' f-w-400'    style="font-size: 1.5rem">${item?.ratings}/5</span> </div>
                    </div>
                </div>

            </div>
            <div class="card-bottom flex  h-40  w-100">
                <div class="flex border-b">
                    <div class=" border-r px-1 my-1">
                        <div class="fee">$${item?.fee[0]?.amount.toLocaleString()}</div>
                        <div style="font-size: 10px">BE/Btech FIST YEAR FEES</div>
                    </div>
                    <div class="px-1 my-1">
                        <div class="rating">${((item?.userReviewRatings?.reduce((a, b) => (a + b?.rating), 0)) / item?.userReviewRatings?.length).toPrecision(3)}/5</div>
                        <div style="font-size: 10px">BASED ON 3 USERS</div>
                    </div>
                </div>
                <div style="margin: 10px 0rem;" class="flex">
                    <div class="m-auto">
                        <div>RANKED ${item?.nirfRanking} out of 300</div>
                        <div class="text-center f-w-600">NIRF</div>
                    </div>
                    <div class="m-auto">
                        <div>RANKED ${item?.weekRanking} out of 300</div>
                        <div class="text-center f-w-600">THE WEEK</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button">
            <div class="flex justify-evenly bg-gray py-1 f-w-400">
                <span class=" font-14">ADMISSIONS 2022</span>
                <span class=" font-14">REVIEWS</span>
                <span class=" font-14">COURSES & FEES</span>
            </div>
            <div class="flex w-100">
                <button class="apply-button flex w-50"><ion-icon style="font-size: 12px;margin-right: 5px;"
                        name="archive-outline"></ion-icon>APPLY NOW</button>
                <button class="brochure-button flex w-50"><ion-icon style="font-size: 12px;margin-right: 5px;"
                        name="cloud-download-outline"></ion-icon>BROCHURE</button>
            </div>
        </div>
    </div>`
        document?.querySelector('.body').insertAdjacentHTML('beforeend', temp)
    })
}

fetch(filePath)
    .then(response => response.json())
    .then(jsonData => {
        collegeData = jsonData;
        result = jsonData;
        // console.log('college data', collegeData);
        // renderUi();
        renderCardGrid(result, 0, itemsPerPage);
        filter.addEventListener('change', (e) => {
            if (e.target.value == '') return
            filterEvent()
        })
        sorter.addEventListener('change', (e) => {
            if (e.target.value == '') return
            filterEvent()
        })
        search.addEventListener('change', (e) => {
            searchEvent()
        })
        window.addEventListener('scroll', () => scrollEvent(result?.length))
    })
    .catch(error => {
        console.error("Error fetching JSON data:", error);
        alert(error)
    });

function ratingCompare(a, b) {
    if (a?.ratings < b?.ratings) {
        return -1;
    }
    if (a?.ratings > b?.ratings) {
        return 1;
    }
    return 0;
}
function feeCompare(a, b) {
    if (a?.fee[0]?.amount < b?.fee[0]?.amount) {
        return -1;
    }
    if (a?.fee[0]?.amount > b?.fee[0]?.amount) {
        return 1;
    }
    return 0;
}
function userRatingCompare(a, b) {
    if (a?.userReviewRatings?.reduce((a, b) => (a + b?.rating), 0) < b?.userReviewRatings?.reduce((a, b) => (a + b?.rating), 0)) {
        return -1;
    }
    if (a?.userReviewRatings?.reduce((a, b) => (a + b?.rating), 0) > b?.userReviewRatings?.reduce((a, b) => (a + b?.rating), 0)) {
        return 1;
    }
    return 0;
}
function filterEvent() {
    let filterValue = filter.value;
    let sorterValue = sorter.value;
    if (filterValue == '') return alert('select any filter to apply sorter')
    // console.log(filterValue, sorterValue);
    if (filterValue == 'rating') {
        result = collegeData.sort(ratingCompare)
    } else if (filterValue == 'fees') {
        result = collegeData.sort(feeCompare)
    } else if (filterValue == 'user-ratings') {
        result = collegeData.sort(userRatingCompare)
    }
    start = 0;
    if (sorterValue == 'ascending') {
        // console.log(result);
        document.querySelector('.body').innerHTML = "";
        renderCardGrid(result, 0, itemsPerPage)
    } else if (sorterValue == 'descending') {
        result = result.reverse();
        // console.log(result);
        document.querySelector('.body').innerHTML = "";
        renderCardGrid(result, 0, itemsPerPage)
    }
}
function searchEvent() {
    result = [];
    let searchValue = search.value
    let regex = new RegExp(searchValue, "gi")
    start = 0;
    if (searchValue == '') {
        document.querySelector('.body').innerHTML = "";
        result = collegeData;
        renderCardGrid(collegeData, 0, itemsPerPage)
    }
    collegeData.map((item) => {
        // console.log(regex, item?.name, item?.name.match(searchValue), item?.name.includes(searchValue), searchValue)
        if (item?.name.match(regex)) {
            result.push(item)
        }
    })
    document.querySelector('.body').innerHTML = "";
    renderCardGrid(result, 0, itemsPerPage)
}
function scrollEvent(length) {
    let scrollTop = document.documentElement.scrollTop;
    let windowHeigth = window.innerHeight;
    let fullHeight = document.documentElement.scrollHeight;
    if (start > length) return
    // console.log('scroll event', scrollTop, windowHeigth, fullHeight)
    if (scrollTop + windowHeigth >= fullHeight - 1) {
        // console.log('rendermore')
        start += itemsPerPage;
        end = start + itemsPerPage;
        // console.log(start, end)
        renderCardGrid(result, start, end)
    }
}