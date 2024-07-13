$(document).ready(function () {
    $(".loading-screen").fadeOut(600, () => {
        $('body').removeClass('overflow-hidden');
    })
});



let navBtn = $('#navBtn');
let navBar = $('#navBar');
let content = $('#content');
let search = $('#search');




getSearchApi();
closeNav();

navBtn.on('click', () => {
    if (navBar.css('left') == '0px') {
        closeNav();
    }
    else {
        openNav();
    }
})

function openNav() {
    navBtn.addClass('fa-x');
    navBtn.removeClass('fa-bars');
    navBar.animate({ left: 0 }, 500)
    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 10) * 100)
    }
}

function closeNav() {
    navBtn.removeClass('fa-x');
    navBtn.addClass('fa-bars');
    navBar.animate({ left: -220 }, 500)
    $(".links li").animate({
        top: 300
    }, 500)
}

async function getSearchApi(name, s) {
    $(".loading-screen").fadeIn(300);
    $(".loading-screen").removeClass('ts').addClass('top-12');
    s = s ? s : 's';
    name = name ? name : '';
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${s}=${name}`)
    let data = await response.json();
    data = data.meals;
    data ? displayMeals(data) : displayMeals([]);
    $(".loading-screen").fadeOut(300);
    $(".loading-screen").removeClass('top-12').addClass('ts');
}

function displayMeals(arr) {
    let cont = ``;
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3">
                            <div onclick='getDetalisApi(${arr[i].idMeal})' class="meal position-relative rounded-2 overflow-hidden">
                                <img class="w-100"
                                    src="${arr[i].strMealThumb}" alt="#"
                                    srcset="">
                                <div class="meal-layer1 d-flex align-items-center position-absolute p-2 ">
                                    <h3>${arr[i].strMeal}</h3>
                                </div>
                            </div>
                        </div>`
    }
    content.html(cont)
}



async function getDetalisApi(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let data = await response.json();
    data = data.meals[0];
    displayDetalis(data)
    closeNav();
    search.addClass('d-none');
}

function displayDetalis(meal) {
    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (meal['strMeasure' + i] && meal['strIngredient' + i]) {
            ingredients += `<li class='bg-cold p-2 rounded-3 me-3 mb-3'>${meal['strMeasure' + i]} ${meal['strIngredient' + i]}</li>`;
        }
        else {
            break;
        }
    }
    let displayTag = ``;
    if (meal.strTags !== null) {
        let tags = meal.strTags.split(',');
        for (let i = 0; i < tags.length; i++) {
            displayTag += `<li class='alert-danger text-black p-2 rounded-3 me-3 mb-3'>${tags[i]}</li>`;
        }
    }

    let cont = `
    <div class="col-md-4 text-white">
                        <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                            alt="">
                            <h2>${meal.strMeal}</h2>
                    </div>
                    <div class="col-md-8 text-white">
                        <h2>Instructions</h2>
                        <p>${meal.strInstructions}</p>
                        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                        <h3>Recipes :</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">
                            ${ingredients}
                        </ul>
        
                        <h3>Tags :</h3>
                        <ul class="list-unstyled d-flex g-3 flex-wrap">
                            ${displayTag}
                        </ul>
        
                        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
                    </div>`
    content.html(cont);
}






$('#sbtn').on("click", () => {
    content.html('');
    search.removeClass('d-none');
    $('#sbyname').val('');
    $('#sbyf').val('');
    closeNav();
})

$('#sbyname').on('keyup', () => {
    getSearchApi($('#sbyname').val());
})

$('#sbyf').on('keyup', () => {

    getSearchApi($('#sbyf').val(), 'f');
})



async function getCat() {
    content.html('');
    $(".loading-screen").fadeIn(300)
    search.addClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let data = await response.json()
    data = data.categories;
    displayCat(data);
    closeNav();
    $(".loading-screen").fadeOut(300)
}

function displayCat(arr) {
    let cont = "";
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer1 position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }
    content.html(cont);
}

async function getCategoryMeals(type) {
    $(".loading-screen").fadeIn(300);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${type}`);
    let data = await response.json();
    data = data.meals;
    closeNav();
    displayMeals(data);
    $(".loading-screen").fadeOut(300);
}

$('#cat').on('click', getCat);


async function getAApi(a, type, i) {
    content.html('');
    $(".loading-screen").fadeIn(300);
    search.addClass('d-none');
    let aoi;
    if (i) {
        aoi = 'i';
    }
    else {
        aoi = 'a'
    }
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/${type}${aoi}=${a}`);
    let data = await response.json();
    data = data.meals;
    if (type == 'filter.php?' && !i) {
        displayMeals(data);
    }
    else if (type == 'list.php?' && !i) {
        displayAreas(data);
    }
    else if (type == 'filter.php?' && i) {
        displayMeals(data.slice(0, 20));
    }
    else {
        displaying(data.slice(0, 20));
    }
    closeNav();
    $(".loading-screen").fadeOut(300);
}
function displayAreas(arr) {
    let cont = "";
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3">
                <div onclick="getAApi('${arr[i].strArea}','filter.php?')" class="rounded-2 nnn text-center cursor-pointer text-white">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3 class='area'>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }
    content.html(cont);
}

function displaying(arr) {
    let cont = "";
    for (let i = 0; i < arr.length; i++) {
        cont += `
        <div class="col-md-3">
                <div onclick="getAApi('${arr[i].strIngredient}','filter.php?','i')" class="rounded-2 text-center text-white nnn cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }
    content.html(cont);
}

$('#area').on('click', () => {
    getAApi('list', 'list.php?');
});


$('#ingred').on('click', () => {
    getAApi('list', 'list.php?', 'i');
});

function displayContact() {
    $('#search').addClass('d-none');
    let cont = `
    <div class="col-8 offset-2  bg-black myy-5">
                        <div class="row g-4 bg-black">
                            <div class="col-md-6">
                                <input id="name" onkeyup="nameValidate(this.value)" type="text" class="form-control" placeholder="Enter Your Name">
                                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Special characters and numbers not allowed
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="email" onkeyup="emailValidate(this.value)" type="email" class="form-control " placeholder="Enter Your Email">
                                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Email not valid *exemple@yyy.zzz
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="phone" onkeyup="phoneValidate(this.value)" type="text" class="form-control " placeholder="Enter Your Phone">
                                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Enter valid Phone Number
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="age" onkeyup="ageValidate(this.value)" type="number" class="form-control " placeholder="Enter Your Age">
                                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Enter valid age
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="pass" onkeyup="passValidate(this.value)" type="password" class="form-control " placeholder="Enter Your Password">
                                <div id="passAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="repass" onkeyup="repassValidate(this.value)" type="password" class="form-control " placeholder="Repassword">
                                <div id="repassAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Enter valid repassword 
                                </div>
                            </div>
                            <button id="submitBtn" disabled="true" class="btn btn-outline-danger btncon px-2 mt-3">Submit</button>
                        </div>
                    </div>`;
    closeNav()
    content.html(cont);
}

$('#contact').on('click', displayContact);


let nameV=false;
let passV=false;
let repassV=false;
let phoneV=false;
let emailV=false;
let ageV=false;

function nameValidate(name) {
    var pattern = /^[a-zA-Z\s-]+$/;
    if (!pattern.test(name) || !name) {
        $('#nameAlert').removeClass('d-none');
        nameV=false;
    }
    else{
        $('#nameAlert').addClass('d-none')
        nameV=true;
    }
    verification();
}

function emailValidate(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email) || !email) {
        $('#emailAlert').removeClass('d-none');
        emailV=false;
    }
    else{
        $('#emailAlert').addClass('d-none')
        emailV=true;
    }
    verification();
}

function phoneValidate(phone) {
    var pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!pattern.test(phone) || !phone) {
        $('#phoneAlert').removeClass('d-none');
        phoneV=false;
    }
    else{
        $('#phoneAlert').addClass('d-none')
        phoneV=true;
    }
    verification();
}

function ageValidate(age) {
    var pattern = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
    if (!pattern.test(age) || !age) {
        $('#ageAlert').removeClass('d-none');
        ageV=false;
    }
    else{
        $('#ageAlert').addClass('d-none')
        ageV=true;
    }
    verification();
}

function passValidate(pass) {
    var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!pattern.test(pass) || !pass) {
        $('#passAlert').removeClass('d-none');
        passV=false;
    }
    else{
        $('#passAlert').addClass('d-none')
        passV=true;
    }
    verification();
}

function repassValidate(repass) {
    var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if ($('#pass').val()!==repass ||!pattern.test(repass) || !repass) {
        $('#repassAlert').removeClass('d-none');
        repassV=false;
    }
    else{
        $('#repassAlert').addClass('d-none')
        repassV=true;
    }
    verification();
}

function verification(){
    if(passV==true && repassV==true && emailV==true && phoneV==true && nameV==true && ageV==true){
        $('#submitBtn').removeAttr("disabled");
    }
    else{
        $('#submitBtn').attr("disabled", true);
    }
}