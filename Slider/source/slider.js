
window.onload = function(){
    
    // When the DOM completaly loaded call this functions. This will overwrite the 
    //  most of the html dummies that we created.
    addAllThumbnails();
    registerEventsToThumbnailButtons();
    updateProduct();
    
}


// ------------------------------ Constants -----------------------------------------
const IMAGE_URL = "https://images.hepsiburada.net/banners/s/0/";
const BILLBOARD_PATH = "672-378/bannerImage";
const THUMBNAIL_PAPTH = "71-40/thumbnailImage";
const BACKGROUND_PATH = "1920-540/backgroundImage";
// Order is important. First item of list will be first product in slide.
const PRODUCT_LIST = [
    
    {
        "thumbnail-end":"2102_20210623220128.png",
        "message-light":"Her gün yenilenen seçili ürünlerden alışveriş yap",
        "message-bold":"Hepsipapel kazanmaya başla",
        "button-text":"Acele et kaçırma",
        "button-color":"#651BCF",
        "billboard-end":"2114_20210623220143.png",
        "background-color" : "#5236DD"
    },
    
    {
        "thumbnail-end": "2149_20210802095059.png",
        "message-light":"Ağ modem ürünlerinde",
        "message-bold":"süper fırsatlar",
        "button-text":"Acele et kaçırma",
        "button-color":"#FF6000",
        "billboard-end":"2096_20210802095111.png",
        "background-color" : "#F0AB17"
    },

    {
        "thumbnail-end":"2099_20210803181237.png",
        "message-light":"Son teknoloji Case 4U telefon aksesuarlarında",
        "message-bold":"%40'a varan indirimler",
        "button-text":"Acele et kaçırma",
        "button-color":"#00ABF1",
        "billboard-end":"2102_20210803181301.png",
        "background-color" : "#00D8E0"
    },
    
    {
        "thumbnail-end": "2130_20210804134440.png",
        "message-light":"Rahat ve şık bir tarz için",
        "message-bold":"aradığın ayakkabılar burada",
        "button-text":"Hemen keşfet",
        "button-color":"#FF6000",
        "billboard-end":"2098_20210804134708.png",
        "background-color":"#FF9A75"
    }
]


// ------------------------------ Globals -----------------------------------------
var NextProductIndex = 0;
var ThumbnailDivList = [];
var PreviousButtonElem;
var NextButtonElem;


// ------------------------------ Billboard -----------------------------------------
async function updateBillboard()
{

    // Promote two variables for two billboard element that stands on top of each other.
    // Back element is not currently seen by user.
    let billboard_front_elem = document.querySelector("div[order=front].billboard-ordered")
    let billboard_back_elem = document.querySelector("div[order=back].billboard-ordered")

    // Background element of slider.
    let billboard_background_elem = document.querySelector(".slider-container");
    
    // Promote variables to billboard's child elements since we are going to modify them for next product.
    let billboard_back_image_elem = billboard_back_elem.querySelector("img");
    let billboard_back_message_light_elem = billboard_back_elem.querySelector("h1");
    let billboard_back_message_bold_elem = billboard_back_elem.querySelector("h2");
    let billboard_back_button_elem = billboard_back_elem.querySelector("button");
    
    // This obj will hold the properties of our next product.
    let new_product = 
    {
        image_src: IMAGE_URL + BILLBOARD_PATH + PRODUCT_LIST[NextProductIndex]["billboard-end"],
        message_light : PRODUCT_LIST[NextProductIndex]["message-light"],
        message_bold : PRODUCT_LIST[NextProductIndex]["message-bold"],
        button_text : PRODUCT_LIST[NextProductIndex]["button-text"],
        button_color : PRODUCT_LIST[NextProductIndex]["button-color"],
        background_color : PRODUCT_LIST[NextProductIndex]["background-color"]
    }

    // Set back (unseen) element's properties to our next product's properties. Still unseen by the user.
    billboard_back_image_elem.setAttribute("src",new_product.image_src);
    billboard_back_message_light_elem.innerHTML = new_product.message_light;
    billboard_back_message_bold_elem.innerHTML = new_product.message_bold;
    billboard_back_button_elem.innerHTML = new_product.button_text;
    billboard_back_button_elem.style.backgroundColor = new_product.button_color;
    billboard_background_elem.style.backgroundColor = new_product.background_color;

    // Fade out (CSS transition) the opacity of front element which is seen by the user. This will reveal the next product
    //  back element) which stays behind of the front element.
    billboard_front_elem.style.opacity = 0;
    await sleep(200);

    // After 200 ms, remove the front element so user can not click on the buttons of front element.
    billboard_front_elem.parentNode.removeChild(billboard_front_elem);

    // Now we only have back element as our billboard. Our next product is revealed succesfully.
    // But since we want this sequence to successfully applied for further products we must have a front element.
    // We clone the back element, set it's order attribute to front and append it to our billboard.
    // Now user sees the front element again and not back element.
    billboard_back_elem_clone = billboard_back_elem.cloneNode(true);
    billboard_back_elem_clone.setAttribute("order","front");
    billboard_back_elem.parentElement.appendChild(billboard_back_elem_clone);
}



// ------------------------------ Thumbnail -----------------------------------------
function addAllThumbnails()
{
    // Add a thumbnail for each product in PRODUCT_LIST
    for (let product of PRODUCT_LIST)
    {
        addSingleThumbnail(product);  
    }
}

function addSingleThumbnail(product)
{
    // Promote a variable to div that we are going to add our thumbnail elements.
    let thumbnails_container_elem = document.querySelector(".thumbnails-container");

    // Construct our thumbnail's image source for this product.
    let thumbnail_image_src = IMAGE_URL + THUMBNAIL_PAPTH + product["thumbnail-end"];

    // Create a div element to contain our thumbnail image. And set 'click' event listener.
    let thumbnail_image_container_elem = document.createElement("div");
    thumbnail_image_container_elem.setAttribute("class","thumbnail-image center-item vertically rounded");
    thumbnail_image_container_elem.addEventListener('click',updateProductOnThumbnailClick);
    
    // Add our thumbnail to global ThumbnailDivList array. We use this array to add "selected" class to thumbnail further.
    ThumbnailDivList.push(thumbnail_image_container_elem);

    // Create the thumbnail image element.
    let thumbnail_image_elem = document.createElement("img");
    thumbnail_image_elem.setAttribute("class","rounded");
    thumbnail_image_elem.setAttribute("style","min-width: 80px;");
    thumbnail_image_elem.setAttribute("src",thumbnail_image_src);

    // Add thumbnail image to thumbnail div then add thumbnail div to thumbnail container.    
    thumbnail_image_container_elem.appendChild(thumbnail_image_elem);
    thumbnails_container_elem.appendChild(thumbnail_image_container_elem);

}

function updateThumbnailVisuals()
{
    // Remove "selected" class from all thumbnail div elements.
    for(let thumbnail_div of ThumbnailDivList)
    {
        thumbnail_div.classList.remove('selected');
    }

    // Add "selected" class to our currently clicked thumbnail.
    ThumbnailDivList[NextProductIndex].classList.add('selected');
}

function updateProductOnThumbnailClick()
{
    // Set NextProductIndex to currently clicked div element's index in ThumbnailDivList.
    // Since this function will be called from "click" event of div, this will referr to div element.
    let index_of_thumbnail = ThumbnailDivList.indexOf(this);
    NextProductIndex = index_of_thumbnail;

    updateProduct();
}

// ------------------------------ Button -----------------------------------------

function registerEventsToThumbnailButtons()
{
    // Get thumbnail button elements and promote them to two global variables.
    let button_elems = document.querySelectorAll(".thumbnail-button");
    PreviousButtonElem = button_elems[0];
    NextButtonElem = button_elems[1];

    // Add updateProductOnButtonClick to their onclick litener.
    PreviousButtonElem.onclick = updateProductOnButtonClick;
    NextButtonElem.onclick = updateProductOnButtonClick;
}

function updateButtonVisuals()
{
    // Show all buttons for first.
    PreviousButtonElem.style.display = "";
    NextButtonElem.style.display = "";

    // Depending on the NextProductIndex, hide the button element.
    if (NextProductIndex == 0)
    {
        PreviousButtonElem.style.display = "none";
        
    }
    if (NextProductIndex == PRODUCT_LIST.length-1)
    {
        NextButtonElem.style.display = "none";
        
    }
}


function updateProductOnButtonClick()
{
    // Update the NextProductIndex depending on which button element called this function.
    if (this == NextButtonElem)
    {
        NextProductIndex++;
    }
    else if ( this== PreviousButtonElem)
    {
        NextProductIndex--;
    }
    
    // Clamp the NextProductIndex between 0 and PRODUCT_LIST.length-1.
    NextProductIndex = clamp(NextProductIndex,0,PRODUCT_LIST.length-1);

    updateProduct();
}


// ------------------------------ Misc -----------------------------------------
function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clamp(value,min,max)
{
    return value < min ? min : value > max ? max : value;
}

function updateProduct()
{
    updateButtonVisuals();
    updateThumbnailVisuals();
    updateBillboard();
}