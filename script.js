//You can edit ALL of the code here

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous episodes

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

  // Create dropdown selector for TV SHow Selection
  const showSelector = document.createElement("select");
  document.body.insertBefore(showSelector, rootElem);

  // Create dropdown selector
  const selector = document.createElement("select");
  document.body.insertBefore(selector, rootElem);

  // Create search input
  const searchBar = document.createElement("input");
  searchBar.placeholder = "Find an episode";
  searchBar.id = "episodeSearch";
  searchBar.name = "episodeSearch";

  document.body.insertBefore(searchBar, selector.nextSibling);

  // Create episode count display
  const episodeCountDisplay = document.createElement("p");
  document.body.insertBefore(episodeCountDisplay, searchBar.nextSibling);

  let allEpisodes = [];

  userNotification.textContent = "Loading episodes, please wait...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then((data) => {
      userNotification.textContent = "";
      allEpisodes = data;

      populateDropdown(allEpisodes);
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

  selector.addEventListener("change", () => {
    const url = selector.value;
    if (url) window.open(url, "_blank");
  });

  // Helper to fill dropdown
  function populateDropdown(episodes) {
    selector.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Show all episodes";
    defaultOption.value = "";
    selector.appendChild(defaultOption);

    episodes.forEach((episode) => {
      const option = document.createElement("option");
      const code = `S${String(episode.season).padStart(2, "0")}E${String(
        episode.number
      ).padStart(2, "0")}`;
      option.textContent = `${code} - ${episode.name}`;
      option.value = episode.url;
      selector.appendChild(option);
    });
  }
}

async function fetchAllShows() {
  let pageNumber = 0;
  let allShows = [];

  while (true) {
    const URL = `https://api.tvmaze.com/shows?page=${pageNumber}`;
    const response = await fetch(URL);
    if (response.status === 404) {
      break;
    } else {
      const data=await response.json();
      if (data.length === 0) {
        break;
      } else {
        allShows = allShows.concat(data);
        pageNumber++;
      }
    }
  }
  return allShows;
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
