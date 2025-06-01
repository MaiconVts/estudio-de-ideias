function createFavoriteButton(project, isFavorite = false) {
  const favorite = document.createElement("button");
  favorite.classList.add("project-card__favorite-button");
  favorite.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';

  if (isFavorite)
    favorite.classList.add("project-card__favorite-button--active");

  favorite.addEventListener("click", () => {
    window.estudioIdeias.favorites.toggle(project.id);

    const isFavorite = window.estudioIdeias.favorites.isFavorite(project.id);
    favorite.classList.toggle(
      "project-card__favorite-button--active",
      isFavorite
    );
  });

  return favorite;
}

function createProjectElement(project, isFavorite = false) {
  const container = document.createElement("article");
  container.classList.add("project-card");

  const title = document.createElement("h3");
  title.classList.add("project-title");
  const titleLink = document.createElement("a");
  titleLink.classList.add("project-link");
  titleLink.href = `./detalhes.html?id=${project.id}`;
  titleLink.textContent = project.title;
  title.appendChild(titleLink);

  const metadata = document.createElement("section");
  metadata.classList.add("project-metadata", "project-tags");

  const authorName = document.createElement("span");
  authorName.classList.add("author-name-value");
  authorName.textContent = project.author;

  const authorInfo = document.createElement("span");
  authorInfo.classList.add("project-tag", "author-info-tag");
  authorInfo.textContent = "Autor: ";
  authorInfo.appendChild(authorName);

  const citationsCount = document.createElement("span");
  citationsCount.classList.add("citations-count-value");
  citationsCount.textContent = project.citations;

  const citationsInfo = document.createElement("span");
  citationsInfo.classList.add("project-tag", "citations-info-tag");
  citationsInfo.textContent = "Citações: ";
  citationsInfo.appendChild(citationsCount);

  const area = document.createElement("span");
  area.classList.add("project-tag", "area-tag");
  area.textContent = `Área: ${project.area}`;

  const year = document.createElement("span");
  year.classList.add("project-tag", "year-tag");
  year.textContent = `Ano: ${project.year}`;

  metadata.appendChild(authorInfo);
  metadata.appendChild(citationsInfo);
  metadata.appendChild(area);
  metadata.appendChild(year);

  const description = document.createElement("p");
  description.classList.add("project-summary");
  description.textContent = project.summary;

  const favorite = createFavoriteButton(project, isFavorite);

  container.appendChild(title);
  container.appendChild(metadata);
  container.appendChild(description);
  container.appendChild(favorite);

  return container;
}

window.estudioIdeiasUtils = {
  createFavoriteButton,
  createProjectElement,
};
