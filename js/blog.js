(function () {
  const searchInput = document.getElementById("blog-search");
  const grid = document.getElementById("blog-grid");
  const cards = Array.from(grid.querySelectorAll("article"));
  const featured = document.getElementById("featured-post");
  const noResults = document.getElementById("no-results");

  function textOf(el) {
    return el.textContent.trim().toLowerCase();
  }

  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const match = textOf(card).includes(q);
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    if (featured) {
      featured.style.display = textOf(featured).includes(q) ? "" : "none";
    }

    noResults.classList.toggle("hidden", visibleCount > 0 || q === "");
  });
})();
