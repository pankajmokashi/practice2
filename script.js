
const key  = "AIzaSyCFbeXBoI77tL6HGVztGyANP-bVORonDVc"
const categories = document.getElementById("categories")
const videoCategories = document.getElementById("video-container")

async function loadVideoCategories(){
    let str = "1,2,10,15,17,19,20,22,24,25,26,27,28"
    const url = `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&key=${key}&id=${str}`
    const response = await fetch(url)
    const data = await response.json()
    addCategories(data.items)
    loadVideosById(17)
    for(let i = 0; i < categories.children.length; i++){
        categories.children[i].addEventListener("click", openCategory)
    }
}

function openCategory(event){
    videoCategories.innerHTML = ""
    for(let i = 0; i < categories.children.length; i++){
        categories.children[i].style.backgroundColor = '#e8e8e8'
        categories.children[i].style.color = 'black'
    }
    loadVideosById(event.srcElement.id)
}

function addCategories(data){

    for(let i = 0; i < data.length; i++){

        const title = data[i].snippet.title
        const chip = document.createElement("div")
        chip.className = "chip"
        chip.id = data[i].id
        chip.innerText = title
        categories.appendChild(chip)
    }

}

function funct(id){
    const div = document.getElementById(`${id}`)
    div.style.backgroundColor = 'black';
    div.style.color = 'white'
}

function playVideo(event){
    const ele = event.srcElement.parentElement
    const videoUrl = `https://www.youtube.com/watch?v=${ele.id}`;
    window.open(videoUrl, '_blank');
}

async function loadVideosById(id){
    funct(id)
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&type=video&videoCategoryId=${id}&key=${key}&relevanceLanguage=en`
    const response = await fetch(url)
    const data = await response.json()
    loadVideos(data)
}

async function loadVideos(data){

    for(let i = 0; i < data.items.length; i++){
        const videoItem = data.items[i]
        const videoId = videoItem.id.videoId
        const channelId = videoItem.snippet.channelId;
        const title = videoItem.snippet.title;
       
        const thumbnail = videoItem.snippet.thumbnails.high.url;
        const channelName = videoItem.snippet.channelTitle


        const channelLogo = await loadChannelLogo(channelId);
        const viewCount = await loadViewCount(videoId);
        const language = "en"
        let viewCount1 = Intl.NumberFormat(language, {notation: "compact"}).format(viewCount)


        const video_div = document.createElement("div")
        video_div.id = videoId
        video_div.className = "video"

        const thumbnail_div = document.createElement("div")
        thumbnail_div.className = "thumbnail"
        thumbnail_div.style.backgroundImage = `url(${thumbnail})`

        const channel_div = document.createElement("div")
        channel_div.className = "channel-logo"
        channel_div.style.backgroundImage = `url(${channelLogo})`

        const p_title = document.createElement("p")
        p_title.className = "title"
        
        const p_ch_name = document.createElement("p")
        p_ch_name.className = "channel-name"
        p_ch_name.innerText = channelName

        const p_views = document.createElement("p")
        p_views.className = "views"
        p_views.innerText = viewCount1 + " views"

        const span = document.createElement("span")
        span.className = "material-symbols-outlined"
        span.innerText = "more_vert"

        const b = document.createElement("b")
        b.innerText = title
        p_title.appendChild(b)

        const div_1 = document.createElement("div")
        div_1.appendChild(p_title)
        div_1.appendChild(p_ch_name)
        div_1.appendChild(p_views)

        const div_2 = document.createElement("div")
        div_2.appendChild(channel_div)
        div_2.appendChild(div_1)
        div_2.appendChild(span)

        video_div.appendChild(thumbnail_div)
        video_div.appendChild(div_2)

        videoCategories.appendChild(video_div)
    
        for(let i = 0; i < videoCategories.children.length; i++){
            videoCategories.children[i].addEventListener("click", playVideo)
        }
    }
}

async function loadChannelLogo(channelId){
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${key}`
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0].snippet.thumbnails.default.url;
}

async function loadViewCount(videoId){
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${key}`
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0].statistics.viewCount; 
}

loadVideoCategories()


async function loadVideosByString(str){
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&key=${key}&q=${str}&relevanceLanguage=en`
    const response = await fetch(url)
    const data = await response.json()
    videoCategories.innerHTML = ""
    loadVideos(data)
}


const search = document.getElementById("search-query")
const search_str = document.getElementById("search-videos")

function getVideos(){
    loadVideosByString(search_str.value)
}
search.addEventListener("click", getVideos)