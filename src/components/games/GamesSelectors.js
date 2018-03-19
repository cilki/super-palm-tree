
/**
 * Selectors for the state tree for Games.js
 */

import QueryString from 'query-string';
import { createSelector } from 'reselect';

import { PAGE_SIZE } from '../Constants';

/**
 * @description - Input selector for the games
 * 'requested' state
 * @param {Map} state
 * @returns {Boolean}
 */
function getGamesRequested(state) {
  return state.games.gamesRequested;
}


/**
   * @description - Input selector for the games
   * @param {Map} state
   * @returns {String|null}
   */
function getGames(state) {
  const games = state.games.games.toJS();
  return games;
}

/**
 * @description - Trivial selector for finding the
 * error state of the games
 * @param {Map} state
 * @returns {String|null}
 */
function getGamesError(state) {
  return state.games.gamesError;
}

/**
 * @description - Returns the current page for the games
 * @param {Object} state
 * @returns {Number}
 */
function getGamesCurrentPage(state, props) {
  let page = props.page ? props.page : QueryString.parse(props.location.search).page;
  page = Number(page);

  return isNaN(page) ? 1 : page; //eslint-disable-line
}

/**
 * @description - Total page selector for games
 * @param {Object} state
 * @returns {Number}
 */
function getTotalPages(state) {
  return state.games.totalPages;
}

/**
 * @description - Returns all of the games from a certain
 * page
 * @returns {Function}
 */
const getGamesByPage = createSelector(
  [getGames, getGamesCurrentPage],
  (games, currentPage) => {
    const gamesToReturn = [];
    for (let i = (currentPage - 1) * PAGE_SIZE + 1; i <= currentPage * PAGE_SIZE; ++i) { //eslint-disable-line
      if (games[i]) {
        gamesToReturn.push(games[i]);
      }
    }

    return gamesToReturn;
  },
);

export { //eslint-disable-line
  getGamesRequested,
  getGames,
  getGamesError,
  getTotalPages,
  getGamesByPage,
  getGamesCurrentPage,
};
