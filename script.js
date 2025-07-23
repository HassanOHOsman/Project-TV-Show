//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  episodeList.forEach(episode => {
    const eachEpisode = document.createElement("div");
    const episodeCode = "S" + String(episode.season).padStart(2, "0") + "E" + String(episode.number).padStart(2, "0");
    eachEpisode.innerHTML = `
      <h3>${episode.name} - ${episodeCode}</h3>
      <img src="${episode.image.medium}" alt="Thumbnail for ${episode.name} - Episode ${episode.number} - Season ${episode.season}">
      <p>${episode.summary}</p>`;

    rootElem.appendChild(eachEpisode);
  });
}

window.onload = setup;
