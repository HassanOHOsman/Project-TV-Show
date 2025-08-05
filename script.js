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

  // Create show container to hold all shows info
  const showContainer = document.createElement("div");
  showContainer.id = "shows-container";
  rootElem.appendChild(showContainer);

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

  // Create episode count display
  const episodeCountDisplay = document.createElement("p");

  const searchContainer = document.createElement("div");
  searchContainer.style.display = "inline-flex";
  searchContainer.style.alignItems = "center";
  searchContainer.style.gap = "1rem";
  searchContainer.style.margin = "0";
  searchContainer.style.padding = "0";

  searchBar.style.margin = "0";

  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(episodeCountDisplay);

  document.body.insertBefore(searchContainer, episodeSelector.nextSibling);

  episodeCountDisplay.style.margin = "0";
  episodeCountDisplay.style.whiteSpace = "nowrap";

  let allEpisodes = [];

  userNotification.textContent = "Loading episodes, please wait...";

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch shows.");
      }
      return response.json();
    })
    .then((showData) => {
      userNotification.textContent = "";

      showData.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      showContainer.innerHTML = "";

      showData.forEach((show) => {
        const showCard = document.createElement("div");
        showCard.classList.add("show-card");

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

      populateShowsDropdown(showData);
    })
    .catch(() => {
      userNotification.textContent =
        "Failed to load shows. Please try again later.";
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
  function populateShowsDropdown(shows) {
    showSelector.innerHTML = "";

    const defaultOption1 = document.createElement("option");
    defaultOption1.textContent = "Display all shows";
    defaultOption1.value = "";
    showSelector.appendChild(defaultOption1);

    shows.forEach((show) => {
      const option1 = document.createElement("option");
      option1.textContent = show.name;
      showSelector.appendChild(option1);
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
      const option2 = document.createElement("option");
      const code = `S${String(episode.season).padStart(2, "0")}E${String(
        episode.number
      ).padStart(2, "0")}`;
      option2.textContent = `${code} - ${episode.name}`;
      option2.value = episode.url;
      episodeSelector.appendChild(option2);
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
