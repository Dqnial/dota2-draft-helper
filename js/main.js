const icons = document.querySelectorAll(".icons-pick");
const menu = document.getElementById("heroes-menu");
let id = null;
let dataHeroes = [];

let enemyId1;
let enemyId2;
let enemyId3;
let enemyId4;
let enemyId5;

let enemyIds = [enemyId1, enemyId2, enemyId3, enemyId4, enemyId5];

const menuClose = document.getElementById("heroes-menu-close");
const heroesItem = document.querySelectorAll(".heroes-menu__item");
const iconsRes = document.querySelectorAll(".icons-result");
let isMenuOpened = false;
let lastClickedIcon = null;

menuClose.addEventListener("click", function () {
  menu.classList.remove("open");
  isMenuOpened = false;
});

fetch("heroes.json")
  .then((response) => response.json()) // Преобразуем ответ в JSON
  .then((heroesData) => {
    const heroesList = document.getElementById("heroes-list"); // Контейнер для списка героев

    // Проходим по каждому герою в данных
    for (const heroId in heroesData) {
      const hero = heroesData[heroId];

      icons.forEach(function (icon) {
        icon.addEventListener("click", function () {
          if (!isMenuOpened) {
            menu.classList.add("open");
            isMenuOpened = true;
          }

          if (lastClickedIcon && lastClickedIcon !== icon) {
            lastClickedIcon.style.background = "";
          }
          icon.style.background = "lightblue";
          lastClickedIcon = icon;
        });
      });

      // Создаем элемент для каждого героя
      const heroItem = document.createElement("div");
      heroItem.classList.add("heroes-menu-item");
      heroItem.setAttribute("data-hero-id", hero.id);
      heroItem.addEventListener("click", function () {
        heroItem.classList.add("disabled");
        menu.classList.remove("open");
        isMenuOpened = false;
        lastHeroItem = heroItem;
        lastClickedIcon.innerHTML = `
        <div class="heroes-menu__item" data-hero=${heroId} data-hero-id=${hero.id}>
          <div class="heroes-menu__item-bg-1">
            <div class="heroes-menu__item-hero-image">
              <img src="${hero.image}" alt="${hero.name}">
              <h2 class="heroes-menu__item-hero-name">
                ${hero.name}
              </h2>
            </div>
          </div>
        </div>
      `;
        id = hero.id;
        // ids.push(hero.id);
        // console.log(ids);
        // After fetching hero stats and clicking on a hero, check if each enemy pick element exists
        let enemyHero1Div = document
          .getElementById("enemy-pick-1")
          ?.querySelector(".heroes-menu__item");
        let enemyHero2Div = document
          .getElementById("enemy-pick-2")
          ?.querySelector(".heroes-menu__item");
        let enemyHero3Div = document
          .getElementById("enemy-pick-3")
          ?.querySelector(".heroes-menu__item");
        let enemyHero4Div = document
          .getElementById("enemy-pick-4")
          ?.querySelector(".heroes-menu__item");
        let enemyHero5Div = document
          .getElementById("enemy-pick-5")
          ?.querySelector(".heroes-menu__item");

        enemyId1 = enemyHero1Div
          ? enemyHero1Div.getAttribute("data-hero-id")
          : null;
        enemyId2 = enemyHero2Div
          ? enemyHero2Div.getAttribute("data-hero-id")
          : null;
        enemyId3 = enemyHero3Div
          ? enemyHero3Div.getAttribute("data-hero-id")
          : null;
        enemyId4 = enemyHero4Div
          ? enemyHero4Div.getAttribute("data-hero-id")
          : null;
        enemyId5 = enemyHero5Div
          ? enemyHero5Div.getAttribute("data-hero-id")
          : null;

        if (enemyId1 !== null) {
          console.log(`Выбран герой ${enemyId1} для 1 ячейки`);
          fetchHeroStats(enemyId1);
        } else if (enemyId2 !== null) {
          console.log(`Выбран герой ${enemyId2} для 2 ячейки`);
          fetchHeroStats(enemyId2);
        } else if (enemyId3 !== null) {
          console.log(`Выбран герой ${enemyId3} для 3 ячейки`);
          fetchHeroStats(enemyId3);
        } else if (enemyId4 !== null) {
          console.log(`Выбран герой ${enemyId4} для 4 ячейки`);
          fetchHeroStats(enemyId4);
        } else if (enemyId5 !== null) {
          console.log(`Выбран герой ${enemyId5} для 5 ячейки`);
          fetchHeroStats(enemyId5);
        }
        // fetchHeroStats(id);
      });
      // Заполняем HTML для героя
      heroItem.innerHTML = `
        <div class="heroes-menu-item-bg">
          <div class="heroes-menu-item-image">
            <img src="${hero.image}" alt="${hero.name}">
            <h2 class="heroes-menu-item-name">
              ${hero.name}
            </h2>
          </div>
        </div>
      `;

      // Добавляем новый элемент в контейнер
      heroesList.appendChild(heroItem);
      const fetchHeroStats = async () => {
        const API_TOKEN =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiMmUzOTVlYWItNGFmYy00ZmFhLWJkZTAtMGY1ODk2ZmRjM2JjIiwiU3RlYW1JZCI6IjEwNDE0MDQxOTMiLCJuYmYiOjE3MzYyNjc1MzcsImV4cCI6MTc2NzgwMzUzNywiaWF0IjoxNzM2MjY3NTM3LCJpc3MiOiJodHRwczovL2FwaS5zdHJhdHouY29tIn0.UerWAF6u0FcsXDXnLixojkVOmq4Vxu-TKQAGAGnAxuo"; // Убедись, что токен правильный
        const query = `
          {
            heroStats {
              heroVsHeroMatchup(
                heroId:${id},
                matchLimit:0
                skip:0
              ) {
            advantage {
                  vs {
                    heroId1
                    heroId2
                    winsAverage
                  }
                }
              }
            }
          }`;
        try {
          const response = await fetch("https://api.stratz.com/graphql", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
          });

          if (response.ok) {
            const data = await response.json();
            // Извлечение конкретных данных
            const matchups =
              data.data.heroStats.heroVsHeroMatchup.advantage[0].vs;

            // Пример: перебор и вывод информации о каждом противостоянии
            const smallestWinrate = matchups
              .sort((a, b) => a.winsAverage - b.winsAverage)
              .slice(0, 20);

            dataHeroes.push(smallestWinrate);

            console.log(dataHeroes);
            // Шаг 1: Собираем все heroId2 в одном массиве
            const allHeroIds = dataHeroes.flat().map((hero) => hero.heroId2);

            // Шаг 2: Подсчитываем количество каждого heroId2
            const heroCount = allHeroIds.reduce((acc, heroId) => {
              acc[heroId] = (acc[heroId] || 0) + 1;
              return acc;
            }, {});

            // Шаг 3: Фильтруем heroId2, где heroId1 не равен heroId2 в другом объекте
            const filteredHeroCount = Object.entries(heroCount)
              .filter(([heroId, count]) => {
                // Проверяем, что heroId2 не равен heroId1 из другого объекта
                return (
                  count > 1 &&
                  !dataHeroes
                    .flat()
                    .some(
                      (hero) =>
                        hero.heroId1 === parseInt(heroId) &&
                        hero.heroId2 === parseInt(heroId)
                    )
                );
              })
              .map(([heroId, count]) => ({ heroId2: heroId, count }));

            if (filteredHeroCount == 0) {
              // Функция поиска героя по id
              function findHeroById(heroId, heroesData) {
                return Object.values(heroesData).find(
                  (hero) => hero.id === parseInt(heroId)
                );
              }

              // Обработчик для вывода героев на основе filteredHeroCount
              dataHeroes[0].forEach(function (filteredHero, index) {
                // Ищем героя по heroId2
                const hero = findHeroById(filteredHero.heroId2, heroesData);
                if (hero) {
                  // Если герой найден, добавляем его в iconsRes
                  if (iconsRes[index]) {
                    // Проверяем, чтобы индекс был валиден
                    iconsRes[index].innerHTML = `
        <div class="heroes-menu__item" data-hero="${hero.id}" data-hero-id="${hero.id}">
          <div class="heroes-menu__item-bg-1">
            <div class="heroes-menu__item-hero-image">
              <img src="${hero.image}" alt="${hero.name}">
              <h2 class="heroes-menu__item-hero-name">
                ${hero.name}
              </h2>
            </div>
          </div>
        </div>
      `;
                  }
                } else {
                  console.log(`Герой с ID ${filteredHero.heroId2} не найден`);
                }
              });
            }
            filteredHeroCount.sort((a, b) => b.count - a.count);
            console.log(filteredHeroCount);
            // Функция поиска героя по id
            function findHeroById(heroId, heroesData) {
              return Object.values(heroesData).find(
                (hero) => hero.id === parseInt(heroId)
              );
            }

            // Обработчик для вывода героев на основе filteredHeroCount
            filteredHeroCount.forEach(function (filteredHero, index) {
              // Ищем героя по heroId2
              const hero = findHeroById(filteredHero.heroId2, heroesData);

              if (hero) {
                // Если герой найден, добавляем его в iconsRes
                if (iconsRes[index]) {
                  // Проверяем, чтобы индекс был валиден
                  iconsRes[index].innerHTML = `
        <div class="heroes-menu__item" data-hero="${hero.id}" data-hero-id="${hero.id}">
          <div class="heroes-menu__item-bg-1">
            <div class="heroes-menu__item-hero-image">
              <img src="${hero.image}" alt="${hero.name}">
              <h2 class="heroes-menu__item-hero-name">
                ${hero.name}
              </h2>
            </div>
          </div>
        </div>
      `;
                }
              } else {
                console.log(`Герой с ID ${filteredHero.heroId2} не найден`);
              }
            });
          } else {
            console.error("Ошибка:", response.status);
          }
        } catch (error) {
          console.error("Ошибка при запросе:", error);
        }
      };
    }
  })
  .catch((error) => {
    console.log("Ошибка при загрузке данных:", error);
  });
