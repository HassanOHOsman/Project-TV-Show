//You can edit ALL of the code here
let selector;
let episodeCountDisplay;
let userNotification;
let allEpisodes = [];
let searchBar;
const episodeCache = new Map();
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

async function setup() {
  const rootElem = document.getElementById("root");

  // Create notification paragraph for loading/errors
  userNotification = document.createElement("p");
  document.body.insertBefore(userNotification, rootElem);

  // Create dropdown selector for TV Show Selection
  showSelector = document.createElement("select");
  document.body.insertBefore(showSelector, rootElem);
  const allShows = await fetchAllShows();
  allShows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  populateShowSelector(allShows);

  // Create dropdown selector
  selector = document.createElement("select");
  document.body.insertBefore(selector, rootElem);

  // Create search input
  searchBar = document.createElement("input");
  searchBar.placeholder = "Find an episode";
  searchBar.id = "episodeSearch";
  searchBar.name = "episodeSearch";

  document.body.insertBefore(searchBar, selector.nextSibling);

  // Create episode count display
  episodeCountDisplay = document.createElement("p");
  document.body.insertBefore(episodeCountDisplay, searchBar.nextSibling);

  userNotification.textContent = "Loading episodes, please wait...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then((data) => {
      userNotification.textContent = "";
      allEpisodes = data;

      //insert in cache
      episodeCache.set("82", data);

      populateDropdown(allEpisodes);
      makePageForEpisodes(allEpisodes);
      searchBar.value = "";
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

  showSelector.addEventListener("change", async (event) => {
    const showSelectedId = event.target.value;

    if (showSelectedId === "All") {
      allEpisodes = episodeCache.get("82");
      populateDropdown(allEpisodes);
      makePageForEpisodes(allEpisodes);
      searchBar.value = "";
      episodeCountDisplay.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
      return;
    }
    //search show episodes in cache
    if (episodeCache.has(showSelectedId)) {
      const cachedEpisode = episodeCache.get(showSelectedId);
      allEpisodes = cachedEpisode;
      populateDropdown(allEpisodes);
      makePageForEpisodes(allEpisodes);
      searchBar.value = "";
      episodeCountDisplay.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
    } else {
      try {
        userNotification.textContent = "Loading episodes, please wait...";

        const response = await fetch(
          `https://api.tvmaze.com/shows/${showSelectedId}/episodes`
        );
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        //save episodes in cache
        episodeCache.set(showSelectedId, data);
        allEpisodes = data;
        populateDropdown(allEpisodes);
        makePageForEpisodes(allEpisodes);
        searchBar.value = "";
        episodeCountDisplay.textContent = `Displaying ${allEpisodes.length}/${allEpisodes.length} episodes.`;
        userNotification.textContent = "";
      } catch (error) {
        userNotification.textContent =
          "Failed to load episodes. Please try again later.";
      }
    }
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

// Helper to fill dropdown show selector
function populateShowSelector(shows) {
  showSelector.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Show all Shows";
  defaultOption.value = "All";
  showSelector.appendChild(defaultOption);

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.textContent = show.name;
    option.value = show.id;
    showSelector.appendChild(option);
  });
}

async function fetchAllShows() {
  let pageNumber = 0;
  let allShows = [];
  userNotification.textContent = "Loading list of shows...";
  try {
    while (pageNumber < 5) {
      const URL = `https://api.tvmaze.com/shows?page=${pageNumber}`;
      const response = await fetch(URL);
      if (response.status === 404) {
        break;
      } else {
        const data = await response.json();
        if (data.length === 0) {
          break;
        } else {
          allShows = allShows.concat(data);
          pageNumber++;
        }
      }
    }
    return allShows;
  } catch (error) {
    userNotification.textContent = "Failed to load shows. Please refresh.";
    return [];
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
