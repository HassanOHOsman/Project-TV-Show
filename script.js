//You can edit ALL of the code here

//Creating the drop-down menu of all episodes:

const allEpisodes = getAllEpisodes();
const selector = document.createElement("select");

allEpisodes.forEach((episode) => {
  const option = document.createElement("option");
  const episodeCode = "S" + String(episode.season).padStart(2, "0") + "E" + String(episode.number).padStart(2, "0");
  const itemTitle = `${episodeCode} - ${episode.name}`;

  option.textContent = itemTitle;
  option.value = episode.url;

  selector.appendChild(option);
});

document.body.insertBefore(selector, document.body.firstChild);



//Creating a live & interactive search bar:

const searchBar = document.createElement("input");
searchBar.placeholder = "Find an episode";
document.body.insertBefore(searchBar, selector.nextSibling);

const episodeCountDisplay = document.createElement("p");
document.body.insertBefore(episodeCountDisplay, searchBar.nextSibling);

selector.addEventListener("change", () => {
  const selectedUrl = selector.value;
  if (selectedUrl) {
    window.open(selectedUrl, "_blank");
  }
});




function setup() { 
  makePageForEpisodes(allEpisodes);

  searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value.toLocaleLowerCase();
    const matchingEpisodes = allEpisodes.filter((episode) => {
      const name = episode.name.toLocaleLowerCase();
      const summary = episode.summary.toLocaleLowerCase();
      return name.includes(searchTerm) || summary.includes(searchTerm);
  });

  episodeCountDisplay.textContent = `Displaying ${matchingEpisodes.length}/${allEpisodes.length} episodes.`;
  makePageForEpisodes(matchingEpisodes);
 });

}



function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.innerHTML = "";
  
  episodeList.forEach(episode => {
    const eachEpisode = document.createElement("div");
    const episodeCode = "S" + String(episode.season).padStart(2, "0") + "E" + String(episode.number).padStart(2, "0");
   
    const episodeTitle = document.createElement("h2");
    episodeTitle.textContent = `${episode.name} - ${episodeCode}`;

    const episodeSummary = document.createElement("div");
    episodeSummary.innerHTML = episode.summary;

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image.medium;

    eachEpisode.appendChild(episodeTitle);
    eachEpisode.appendChild(episodeImage);
    eachEpisode.appendChild(episodeSummary);

    rootElem.appendChild(eachEpisode);
  });
}


//Creating a page footer:

const pageFooter = document.createElement("footer");

const footerText = document.createElement("p");
footerText.textContent = "Episode information is sourced from ";

const hyperLink = document.createElement("a");
hyperLink.href = "https://www.tvmaze.com/shows/82/game-of-thrones";
hyperLink.target = "_blank";
hyperLink.textContent = "TVmaze";

footerText.appendChild(hyperLink);
pageFooter.appendChild(footerText);
document.body.appendChild(pageFooter);


window.onload = setup;
