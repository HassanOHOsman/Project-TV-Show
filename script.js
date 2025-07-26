//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  displayEpisodes(allEpisodes);
  const searchBox = document.getElementById("searchInput");
  searchBox.addEventListener("input", function () {
    const searchItem = searchBox.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const episodeName = episode.name.toLowerCase();
      const episodeSummaryText = episode.summary.toLowerCase();
      return (
        episodeName.includes(searchItem) ||
        episodeSummaryText.includes(searchItem)
      );
    });
    displayEpisodes(filteredEpisodes);
  });
}

function displayEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.innerHTML = "";
  episodeList.forEach((episode) => {
    const divEpisode = document.createElement("div");
    const episodeCode =
      "S" +
      String(episode.season).padStart(2, "0") +
      "E" +
      String(episode.number).padStart(2, "0");
    divEpisode.innerHTML = `
      <h3>${episode.name} - ${episodeCode}</h3>
      <img src="${episode.image.medium}" alt="Thumbnail for ${episode.name} - Episode ${episode.number} - Season ${episode.season}">
      <p>${episode.summary}</p>`;

    rootElem.appendChild(divEpisode);
    const resultCount = document.getElementById("resultCount");
    resultCount.textContent = `Showing ${episodeList.length} Episodes`;
  });
}

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
