const ALGOLIA_APP_ID = "11GAJN9N0E";
const ALGOLIA_SEARCH_KEY = "5835ff52deca529281d579a18294efe5";
const ALGOLIA_INDEX = "documents";

const keywordInput = document.getElementById("keyword-search");
const phraseInput = document.getElementById("phrase-search");
const typeFilter = document.getElementById("type-filter");
const sortOrder = document.getElementById("sort-order");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const resultsGrid = document.getElementById("results-grid");

async function searchDocuments() {
  const keyword = keywordInput.value.trim();
  const phrase = phraseInput.value.trim();
  const selectedType = typeFilter.value;
  const sort = sortOrder.value;

  // Build query — exact phrase takes priority over keyword
  const query = phrase ? `"${phrase}"` : keyword;

  // Build filter
  const filters = selectedType ? `document_type:"${selectedType}"` : "";

  const response = await fetch(
    `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX}/query`,
    {
      method: "POST",
      headers: {
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "X-Algolia-API-Key": ALGOLIA_SEARCH_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        filters: filters,
      }),
    }
  );

  const data = await response.json();

  // Sort results
  let hits = data.hits;
  hits.sort((a, b) => {
    if (sort === "asc") return a.title.localeCompare(b.title);
    return b.title.localeCompare(a.title);
  });

  renderResults(hits);
}

function renderResults(hits) {
  if (hits.length === 0) {
    resultsGrid.innerHTML = "<p>No documents found.</p>";
    return;
  }

  resultsGrid.innerHTML = hits
    .map(
      (hit) => `
      <div class="document-card">
        <h3>${hit.title}</h3>
        <span class="doc-type">${hit.document_type}</span>
        ${
          hit.file_url
            ? `<a class="file-btn" href="http://localhost:3000${
                hit.file_url
              }" target="_blank">
              ${hit.file_url.split("/").pop()}
             </a>`
            : '<p style="font-size:0.85rem;color:red;">No file attached</p>'
        }
      </div>
    `
    )
    .join("");
}

// Search button
searchBtn.addEventListener("click", searchDocuments);

// Reset button
resetBtn.addEventListener("click", function () {
  keywordInput.value = "";
  phraseInput.value = "";
  typeFilter.value = "";
  sortOrder.value = "asc";
  searchDocuments();
});

// Initial load
searchDocuments();
