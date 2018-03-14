
/**
 * Defines the actions for the Games page
 */

import { createAction, handleActions } from 'redux-actions';
import { List, Map } from 'immutable';
import { combineReducers } from 'redux';

import {

} from './GamesSelectors';

const fetchGamesRequest = createAction('FETCH_GAMES_REQUEST');
const fetchGamesResponse = createAction('FETCH_GAMES_RESPONSE');

/**
 * @descriptin - Predicate function that takes the page number
 * and the state and determines if we need to fetch that particular page
 * @param {Object} state
 * @param {Number} pageNumber
 * @returns {Boolean}
 */
function shouldFetchGames(state, pageNumber) { //eslint-disable-line
  // TODO: Implement this function so it's "smart"
  return true;
}

/**
 * @description - Fetches the games from our public API.
 * Technically, in Redux jargon, a thunk creator
 * given the page number
 * @param {Number} pageNumber
 * @returns {Function}
 */
function fetchGames(pageNumber = 1) {
  return (dispatch, getState) => {
    if (shouldFetchGames(getState(), pageNumber)) {
      dispatch(fetchGamesRequest());
      fetch( //eslint-disable-line
        `http://api.gameframe.online/v1/game?page=${pageNumber}`,
        { method: 'GET' },
      )
        .then(response => response.json())
        .then(json => dispatch(fetchGamesResponse(json)))
        .catch(err => dispatch(fetchGamesResponse(err)));
    }
  };
}

/* gamesRequested state field. Is true
 * while we're fetching for games, and false
 * otherwise. Should be used to implement a spinner */
const gamesRequested = handleActions({
  [fetchGamesRequest]() {
    return true;
  },
  [fetchGamesResponse]() {
    return false;
  },
}, false);

/* gamesError state field. Set to the error
 * message whenever we get an error while
 * fetching for games */
const gamesError = handleActions({
  [fetchGamesResponse]: {
    next() {
      return null;
    },
    throw(state, { payload: { message } }) {
      return message;
    },
  },
}, null);

/* games state field. A list of the actual
 * state for our games */
const games = handleActions({
  [fetchGamesResponse]: {
    next(state, { payload }) {
      return List(payload.objects.map((game) => {
        return Map(game);
      }));
    },
    throw(state) {
      return state;
    },
  },
}, List());

/* The reducer for all of the game's related
 * state fields */
const gamesReducer = combineReducers({
  games,
  gamesError,
  gamesRequested,
});

export {
  fetchGames,

  fetchGamesRequest,
  fetchGamesResponse,

  gamesReducer,
};