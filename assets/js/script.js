//API KEY AND URL
const url = "https://api.nasa.gov/planetary/apod?";
const apiKey = "api_key=oZE6pQiVQIdUnGScbcRkpcIkbi1luROq42MtbL3F";
const defaultQuery = url + apiKey ;

//ELEMENTS FOR MANIPULATING THE DOM
const searchForm =  document.querySelector('#search-form');
const errorCard = document.querySelector('#error-dialog');
const errorCardText = errorCard.querySelector('#error-dialog-text');
const retryBtn = document.querySelector('#retry');
const container = document.querySelector('#data');
const searchDate = container.querySelector('#search-result-date');
const innerContainer = document.querySelector('#api-data-inner');
const loadingSpinner = document.getElementById('spinner'); //LOADING SPINNER
let apiNotFound = false;

//PRELOADER
window.addEventListener('load', () => {
    document.querySelector('#preloader').style.display = 'none';
})

//SEARCH USING USER REQUEST
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); //TO AVOID THE DEFAULT ACTION ASSOSIATED WITH SUBMIT EVENT IN JS
    SearchWithDate();
    innerContainer.style.display = "none";
});

//GETTING DATA FROM HTML 
const SearchWithDate = ()=>{
    const dd =  String(searchForm.querySelector('#date').value).padStart(2, '0'); //getting the date entered by the user and ensuring that it always has 2 digits
    const mm =  String(searchForm.querySelector('#month').value).padStart(2, '0'); //getting the date entered by the user and ensuring that it always has 2 digits
    const yyyy =  searchForm.querySelector('#year').value; //selecting the parent of  description container to append data in it
    let date = yyyy + '-' + mm + '-' + dd;
    let dateUrl = "&date=" + date;
    let dateQuery = url + apiKey + dateUrl;

    let date_constructor= new Date(); //initiallising constructor
    let Present_date = date_constructor.getDate(); //present date 
    let x = date_constructor.getMonth(); //present month ranging  0-11
    let Present_month = ++x; //present month ranging 1-12 
    let Present_year = date_constructor.getFullYear(); //present year
    
    function validating_dates () {
        if(yyyy>Present_year){
            errorCardText.innerHTML  =`Invalid Date!!<br/> Try something between <b>01/01/1996</b>  to <b>${Present_date}/${Present_month}/${Present_year}</b>`;
            errorCard.showModal();
            clearData();
        } else { 
            if (yyyy==Present_year && mm>Present_month){
                errorCardText.innerHTML  =`Invalid Date!!<br/> Try something between <b>01/01/1996</b>  to <b>${Present_date}/${Present_month}/${Present_year}</b>`;
                errorCard.showModal();
                clearData();
            } else {
                if(yyyy==Present_year && mm==Present_month && dd>Present_date){
                    errorCardText.innerHTML  =`Invalid Date!!<br/> Try something between <b>01/01/1996</b>  to <b>${Present_date}/${Present_month}/${Present_year}</b>`;
                    errorCard.showModal();
                    clearData();
                } else {                
                    fetchData(dateQuery);
                    clearData();
                }
            }
        };
    }
    validating_dates();     
    searchDate.innerHTML = `<h4>Search Results for: ${dd}/${mm}/${yyyy} </h4>`;
};


//CLEARING DATA
const clearData = () => {
    searchForm.querySelector('#date').value = '';
    searchForm.querySelector('#month').value = '';
    searchForm.querySelector('#year').value = '';
}

//FETCHING DATA FROM API
const fetchData = async(query) => {
    try{
        loadingSpinner.style.display = "flex"; //display spinner while fetching data
        let response = await fetch(query); //FETCHING  DATA
        let fetchedData = await response.json(); //CONVERTING  DATA
        loadingSpinner.style.display = "none";//hide spinner after data fetching
        apiNotFound = false;
        renderData(fetchedData, apiNotFound); //passing the data for display
    } catch(error){
        apiNotFound = true;
        renderData(fetchData, apiNotFound);//passing the data for display
        loadingSpinner.style.display = "none"; //hiding spinner
    }
}

//DEFAULT API CALL
fetchData(defaultQuery);

//DISPLAYING THE FETCHED DATA IN DOM
const renderData = (data, apiNotFound) => {
    //RENDERING DATA ON SCREEN IF DATA IS FETCHED SUCCESSFULLY 
    if(!apiNotFound){
        let copyright = data["copyright"];
        let explanation = data["explanation"];
        let hdurl = data["hdurl"];
        let media_type = data["media_type"];
        let title = data["title"];
        let url = data["url"];
        console.log(data)

        let imageType = ` 
            <a id="hd-image-url" href="" target="_blank">              
                <img class="image" id="image" src="#">
            </a>
        `;
        let videoType = `
            <div class="ratio ratio-16x9">
                <iframe
                class="shadow-1-strong rounded"
                id="video"
                src=""
                title="YouTube video"
                allowfullscreen
                ></iframe>
            </div>
        `;

        // Static elements
        if(data['msg']) {
            searchDate.innerHTML = `<h4>No Data Found for: ${dd}/${mm}/${yyyy} </h4>`;
            document.getElementById("media").style.classList = 'nd';
            document.getElementById("title").innerHTML = '';
            document.getElementById("description").innerHTML = '';    

        } else{
            document.getElementById("title").innerHTML = title;
            document.getElementById("description").innerHTML = explanation;    
        }

        // If statement for images/videos
        if (media_type === "video") {
            document.getElementById("media").innerHTML = videoType;
            document.getElementById("video").src = url;
        } else {
            document.getElementById("media").innerHTML = imageType;
            document.getElementById("image").src = url;
            document.getElementById("hd-image-url").href = hdurl;
        }

        //IF statements for copywrite
        if (copyright === undefined){
            document.getElementById("copyright").classList.add('nd');
        } else {
            document.getElementById("copyright").innerHTML = copyright;
        }  

        //CLEAR FORM DATA
        clearData();
    }else{        
        errorCard.showModal(); //displaying error message
    }
    
    innerContainer.style.display = "flex";
}

//RETRY ON CLICK
retryBtn.addEventListener('click', () => {
    errorCard.close();
    fetchData(defaultQuery);
});
