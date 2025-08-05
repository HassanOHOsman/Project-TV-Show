//You can edit ALL of the code here

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const showContainer = document.getElementById("shows-container");
  if (showContainer) showContainer.style.display = "none";

  rootElem.innerHTML = ""; 

  episodeList.forEach((episode) => {
    const episodeCode =
      "S" +
      String(episode.season).padStart(2, "0") +
      "E" +
      String(episode.number).padStart(2, "0");

    const eachEpisode = document.createElement("div");
    eachEpisode.style.marginBottom = "70px"; 
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

const episodeCache = {};

function setup() {
  const rootElem = document.getElementById("root");

  const showContainer = document.createElement("div");
  showContainer.id = "shows-container";
  rootElem.appendChild(showContainer);

  const userNotification = document.createElement("p");
  document.body.insertBefore(userNotification, rootElem);

  const showSelector = document.createElement("select");
  document.body.insertBefore(showSelector, rootElem);

  const episodeSelector = document.createElement("select");
  document.body.insertBefore(episodeSelector, rootElem);

  const showSearchBar = document.createElement("input");
  showSearchBar.placeholder = "Search shows";
  showSearchBar.id = "showSearch";
  showSearchBar.name = "showSearch";
  document.body.insertBefore(showSearchBar, showSelector);


  const searchBar = document.createElement("input");
  searchBar.placeholder = "Find an episode";
  searchBar.id = "episodeSearch";
  searchBar.name = "episodeSearch";

  const episodeCountDisplay = document.createElement("p");

  const searchContainer = document.createElement("div");
  searchContainer.style.display = "inline-flex";
  searchContainer.style.alignItems = "center";
  searchContainer.style.gap = "1rem";

  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(episodeCountDisplay);
  document.body.insertBefore(searchContainer, episodeSelector.nextSibling);

  const backToShowsButton = document.createElement("button");
  backToShowsButton.textContent = "← Back to Shows";
  backToShowsButton.style.display = "none";
  document.body.insertBefore(backToShowsButton, rootElem);


  let allEpisodes = [];

  // 1. Load all shows initially
  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((showData) => {
      showData.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      showData.forEach((show) => {
        const showCard = document.createElement("div");
        showCard.classList.add("show-card");
        showCard.style.marginBottom = "100px";

        showCard.innerHTML = `
          <h3>${show.name}</h3>
          <img src="${show.image?.medium || ""}" alt="${show.name}" />
          <p>${show.summary}</p>
          <h5>Rating: ${show.rating?.average || "N/A"}</h5>
          <h5>Genres: ${show.genres.join(", ")}</h5>
          <h5>Status: ${show.status}</h5>
          <h5>Runtime: ${show.runtime} mins</h5>
          <button data-show-id="${show.id}">View Episodes</button>
        `;

        showContainer.appendChild(showCard);
      });

      // Populate show dropdown
      showSelector.innerHTML = `<option value="">Display all shows</option>`;
      showData.forEach((show) => {
        const opt = document.createElement("option");
        opt.value = show.id;
        opt.textContent = show.name;
        showSelector.appendChild(opt);
      });
    });

  // 2. Button click → load episodes
  document.body.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.dataset.showId) {
      const showId = e.target.dataset.showId;
      fetchEpisodesForShow(showId);
    }
  });

  function fetchEpisodesForShow(showId) {
    userNotification.textContent = "Loading episodes...";

    if (episodeCache[showId]) {
      renderEpisodes(episodeCache[showId]);
      return;
    }

    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((res) => res.json())
      .then((episodes) => {
        episodeCache[showId] = episodes;
        renderEpisodes(episodes);
      })
      .catch(() => {
        userNotification.textContent = "Failed to load episodes.";
      });
  }

  function renderEpisodes(episodes) {
    userNotification.textContent = "";
    allEpisodes = episodes;
    makePageForEpisodes(episodes);
    populateEpisodesDropdown(episodes);
    episodeCountDisplay.textContent = `Displaying ${episodes.length}/${episodes.length} episodes.`;
    showContainer.style.display = "none"; 
    backToShowsButton.style.display = "inline"; 
  }

  // 3. Search bar logic
  searchBar.addEventListener("input", () => {
    const term = searchBar.value.toLowerCase();
    const filtered = allEpisodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(term) ||
        ep.summary.toLowerCase().includes(term)
    );
    makePageForEpisodes(filtered);
    episodeCountDisplay.textContent = `Displaying ${filtered.length}/${allEpisodes.length} episodes.`;
  });

  // 4. Episode dropdown
  episodeSelector.addEventListener("change", () => {
    const url = episodeSelector.value;
    if (url) window.open(url, "_blank");
  });

  // 5. Helpers
  function populateEpisodesDropdown(episodes) {
    episodeSelector.innerHTML = `<option value="">Show all episodes</option>`;
    episodes.forEach((ep) => {
      const code = `S${String(ep.season).padStart(2, "0")}E${String(
        ep.number
      ).padStart(2, "0")}`;
      const opt = document.createElement("option");
      opt.value = ep.url;
      opt.textContent = `${code} - ${ep.name}`;
      episodeSelector.appendChild(opt);
    });
  }
  backToShowsButton.addEventListener("click", () => {
    showContainer.style.display = "block"; // Show shows
    rootElem.innerHTML = ""; // Hide episode list
    backToShowsButton.style.display = "none"; // Hide back button
    episodeSelector.innerHTML = ""; // Clear dropdown
    episodeCountDisplay.textContent = ""; // Clear episode count
    searchBar.value = ""; // Clear search bar
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
