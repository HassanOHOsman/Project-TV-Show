//You can edit ALL of the code here

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  episodeList.forEach((episode) => {
    const episodeCode =
      "S" +
      String(episode.season).padStart(2, "0") +
      "E" +
      String(episode.number).padStart(2, "0");

    const eachEpisode = document.createElement("div");
    eachEpisode.innerHTML = `
      <h3>${episode.name} - ${episodeCode}</h3>
      <img src="${episode.image?.medium || ""}" alt="Thumbnail for ${
      episode.name
    }">
      <p>${episode.summary}</p>
    `;
    rootElem.appendChild(eachEpisode);
  });
}
function setup() {
  const rootElem = document.getElementById("root");

  // Create notification paragraph for loading/errors
  const userNotification = document.createElement("p");
  document.body.insertBefore(userNotification, rootElem);

  // Create dropdown show selector
  const showSelector = document.createElement("select");
  document.body.insertBefore(showSelector, rootElem);

  // Create dropdown episode selector
  const episodeSelector = document.createElement("select");
  document.body.insertBefore(episodeSelector, rootElem);

  // Create search input
  const searchBar = document.createElement("input");
  searchBar.placeholder = "Find an episode";
  searchBar.id = "episodeSearch";
  searchBar.name = "episodeSearch";

  document.body.insertBefore(searchBar, episodeSelector.nextSibling);

  // Create episode count display
  const episodeCountDisplay = document.createElement("p");
  document.body.insertBefore(episodeCountDisplay, searchBar.nextSibling);

  let allEpisodes = [];

  userNotification.textContent = "Loading episodes, please wait...";

  Promise.all([
    fetch("https://api.tvmaze.com/shows"),
    fetch("https://api.tvmaze.com/shows/82/episodes"),
  ])
    .then(async ([showResponse, episodeResponse]) => {
      if (!showResponse.ok || !episodeResponse.ok) {
        throw new Error("Network error");
      }
      const showData = await showResponse.json();
      const episodeData = await episodeResponse.json();

      return { showData, episodeData };
    })
    .then((showData, episodeData) => {
      userNotification.textContent = "";
      allEpisodes = episodeData;

      populateEpisodesDropdown(allEpisodes);
      makePageForEpisodes(allEpisodes);
      episodeCountDisplay.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
    })
    .catch(() => {
      userNotification.textContent =
        "Failed to load episodes. Please try again later.";
    });

  searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filtered = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    makePageForEpisodes(filtered);
    episodeCountDisplay.textContent = `Displaying ${filtered.length}/${allEpisodes.length} episodes.`;
  });

  episodeSelector.addEventListener("change", () => {
    const url = episodeSelector.value;
    if (url) window.open(url, "_blank");
  });

  // Helper to fill shows dropdown
  function populateShowsDropdown(episodes) {
    episodeSelector.innerHTML = "";

    const defaultOption1 = document.createElement("option");
    defaultOption1.textContent = "Display all shows";
    defaultOption1.value = "";
    episodeSelector.appendChild(defaultOption1);

    episodes.forEach((episode) => {
      
    });
  }

  // Helper to fill episodes dropdown
  function populateEpisodesDropdown(episodes) {
    episodeSelector.innerHTML = "";

    const defaultOption2 = document.createElement("option");
    defaultOption2.textContent = "Show all episodes";
    defaultOption2.value = "";
    episodeSelector.appendChild(defaultOption2);

    episodes.forEach((episode) => {
      const option = document.createElement("option");
      const code = `S${String(episode.season).padStart(2, "0")}E${String(
        episode.number
      ).padStart(2, "0")}`;
      option.textContent = `${code} - ${episode.name}`;
      option.value = episode.url;
      episodeSelector.appendChild(option);
    });
  }
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
