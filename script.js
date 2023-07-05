const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

const apiKey = "m7k0bBxgtU0TqsGf8h8f3u8XsC7B1X8jdL7co87HMN5BG3vDDDwqz9Ua";
//API key,paginations, searchTErm var
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

let searchImg = document.getElementById("searchimg");
let sImgs = ['./image/img5.jpg', './image/img1.jpg', './image/img2.jpg', './image/img3.jpg', './image/img4.jpg', './image/img5.jpg', './image/img6.jpg', './image/img7.jpg', './image/img8.jpg', './image/img9.jpg', './image/img10.jpg', './image/img11.jpg', './image/img12.jpg', './image/img1.jpg', './image/img5.jpg'];
setInterval(function () {
    let rnd = Math.floor(Math.random() * sImgs.length);
    searchImg.src = sImgs[rnd];
}, 5000);

const downloadImg = (imgURL) => {
    //converting received img to blob ,creating its download link ,& downloading it 
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();


    }).catch(() => alert("Failed to Download images!"));
}
const showLightbox = (name, img) => {
    //showing lightbox and setting img source,name and button attribute
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";

}
const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
           <img src="${img.src.large2x}" alt="img">
           <div class="details">
             <div class="photographer">
                  <i class="uil uil-camera"></i>
                  <span>${img.photographer}</span>
             </div>
             <button onclick="downloadImg('${img.src.large2x}')">
                  <i class="uil uil-import"></i>
             </button>
           </div>
        </li>`
    ).join("");
}
const getImages = (apiURL) => {
    //Fetching images by API call with authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"));
}
const loadMoreImages = () => {
    currentPage++; // Inc currentPage by 1
    //if search term has some value then call API with search term else call default api
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}
const loadSearchImages = (e) => {
    //if the search input is empty ,set the search term to null and returm from here
    if (e.target.value === "") {
        return searchTerm = null;
    }
    //if passed key is enter,update the current page ,search term and call the get images
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);

    }

}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));