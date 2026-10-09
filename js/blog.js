(function () {
  const searchInput = document.getElementById("blog-search");
  const noResults = document.getElementById("no-results");
  const posts = Array.from(document.querySelectorAll(".post[data-category]"));
  const chips = Array.from(document.querySelectorAll(".chip[data-filter]"));
  if (!posts.length) return;

  let category = "all";

  function apply() {
    const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    posts.forEach((post) => {
      const catMatch = category === "all" || post.dataset.category === category;
      const textMatch = !q || post.textContent.toLowerCase().includes(q);
      const show = catMatch && textMatch;
      post.hidden = !show;
      if (show) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount > 0;
  }

  if (searchInput) searchInput.addEventListener("input", apply);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      category = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      apply();
    });
  });
})();
