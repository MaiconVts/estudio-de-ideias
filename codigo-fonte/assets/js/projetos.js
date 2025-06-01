const collections = {
  projects: "projects",
  favorites: "favorites",
};

const utils = {
  safeJsonParse(data, defaultValue = null) {
    try {
      return JSON.parse(data) ?? defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  paginate({ data, page, perPage }) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return data.slice(start, end);
  },

  uuid() {
    return window.crypto.randomUUID();
  },

  isNumber(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === "number") return true;
    if (typeof value === "string") return !isNaN(Number(value));
    return false;
  },

  toNumber(value) {
    return Number(value);
  },

  toString(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  },
};

const db = {
  readAsSet(key) {
    const data = localStorage.getItem(key);
    const parsed = utils.safeJsonParse(data, {});
    return Object.entries(parsed).reduce((acc, [key, value]) => {
      acc.push({ ...value, id: key });
      return acc;
    }, []);
  },

  readAsMap(key) {
    const data = localStorage.getItem(key);
    return utils.safeJsonParse(data, {});
  },

  collectionExists(key) {
    return localStorage.getItem(key) !== null;
  },

  setCollection(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

const projects = {
  async seed() {
    // corrigindo o caminho para o ERRO 404
    const response = await fetch("./assets/data/projects.json");
    let data = await response.json();

    // Adiciona o status padrão e data de criação a cada projeto inicial
    Object.keys(data).forEach((key) => {
      data[key].status = "Aprovado";
      data[key].createdAt = new Date().toISOString();
    });
    db.setCollection(collections.projects, data);
  },

  paginate(params = {}) {
    const {
      search = null,
      searchBy = null,
      orderBy = null,
      year = null,
      area = null,
      page = 1,
      perPage = 20,
    } = params;

    const data = db.readAsSet(collections.projects);
    const searchTerm = utils.toString(search).toLowerCase();
    const areaString = utils.toString(area);
    const yearNumber = utils.isNumber(year) ? utils.toNumber(year) : null;

    const filtered = data.filter((item) => {
      let result = true;
      if (searchTerm) {
        const byTitle = item.title.toLowerCase().includes(searchTerm);
        const byAuthor = item.author.toLowerCase().includes(searchTerm);
        const results = {
          title: byTitle,
          author: byAuthor,
          all: byTitle || byAuthor,
        };
        result = searchBy ? results[searchBy] : results.all;
      }
      if (result && yearNumber) {
        result = item.year === yearNumber;
      }
      if (result && areaString) {
        result =
          utils.toString(item.area).toLowerCase() === areaString.toLowerCase();
      }
      return result;
    });

    const sorted = filtered.sort((a, b) => {
      if (orderBy === "newest") return b.year - a.year;
      if (orderBy === "oldest") return a.year - b.year;
      if (orderBy === "citations") return b.citations - a.citations;
      return 0;
    });

    const total = sorted.length;
    const pages = Math.ceil(total / perPage);
    const results = utils.paginate({ data: sorted, page, perPage });
    return { total, pages, results };
  },

  count() {
    const data = db.readAsSet(collections.projects);
    return data.length;
  },

  get(id) {
    const data = db.readAsMap(collections.projects);
    return data[id] ? { ...data[id], id } : null;
  },
  /* Parte original da API*/
  // add(payload) {
  //   const id = utils.uuid()
  //   const data = db.readAsMap(collections.projects)
  //   const project = { ...payload, id }
  //   data[id] = project
  //   db.setCollection(collections.projects, data)
  //   return project
  // },

  /* Parte com ajuste para a pagina admin */
  add(payload) {
    const id = utils.uuid();
    const data = db.readAsMap(collections.projects);
    // Adiciona o status "Pendente" e a data da criação automaticamente!
    const project = {
      ...payload,
      id,
      status: "Pendente",
      createdAt: new Date().toISOString(),
    };
    data[id] = project;
    db.setCollection(collections.projects, data);
    return project;
  },

  remove(id) {
    const data = db.readAsMap(collections.projects);
    delete data[id];
    db.setCollection(collections.projects, data);
  },

  // Funções para inserir a apt na pagina de admin
  updateStatus(id, newStatus) {
    const data = db.readAsMap(collections.projects);
    if (data[id]) {
      data[id].status = newStatus;
      db.setCollection(collections.projects, data);
      console.log(
        `AUDITORIA: Projeto ID ${id} atualizado para "${newStatus}".`
      );
      return data[id];
    }
    return null;
  },
  getSubmissions() {
    const data = db.readAsSet(collections.projects);
    // retorna todos os projetos que não estão 'aprovados'
    return data
      .filter((p) => p.status !== "Aprovado")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  // aqui as funções para a implementação da api na pagina admin termina
  getAvailableYears() {
    const data = db.readAsSet(collections.projects);
    const years = data.map((item) => item.year);
    const uniqueYears = [...new Set(years)];
    return uniqueYears.sort((a, b) => b - a);
  },
  getAvailableAreas() {
    const data = db.readAsSet(collections.projects);
    const areas = data.map((item) => item.area);
    const uniqueAreas = [...new Set(areas)];
    return uniqueAreas.sort((a, b) => a.localeCompare(b));
  },
};

const favorites = {
  async seed() {
    db.setCollection(collections.favorites, {});
  },

  getAll() {
    const data = db.readAsMap(collections.favorites);
    return Object.keys(data);
  },

  toggle(id) {
    const data = db.readAsMap(collections.favorites);
    if (data[id]) {
      delete data[id];
    } else {
      data[id] = { favoritedAt: new Date() };
    }
    db.setCollection(collections.favorites, data);
  },

  isFavorite(id) {
    const data = db.readAsMap(collections.favorites);
    return data[id] !== undefined;
  },
};

async function init() {
  if (!db.collectionExists(collections.projects)) {
    await projects.seed();
  }

  if (!db.collectionExists(collections.favorites)) {
    await favorites.seed();
  }
}

(async () => {
  await init();
})();

window.estudioIdeias = { projects, favorites };
