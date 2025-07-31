//You can edit ALL of the code here

const userNotification = document.createElement("p");
document.body.appendChild(userNotification);

function setup() {
  // const allEpisodes = getAllEpisodes();
  // makePageForEpisodes(allEpisodes);
  userNotification.textContent = "Episodes are loading, please wait...";
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      userNotification.textContent = "";
      makePageForEpisodes(data);
    })
    .catch(() => {
      userNotification.textContent = "Oops! We couldn't load the episodes. Please try again later.";
    
    });

}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.innerHTML = "";

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
