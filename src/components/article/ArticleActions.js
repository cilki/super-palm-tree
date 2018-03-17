
/**
 * Simple actions for a Article's instance page
 */

import { normalize } from 'normalizr';

import {
  fetchArticleRequest,
  fetchArticleResponse,
  fetchDeveloperResponse,
  fetchGamesResponse,
} from '../Actions';
import { articles as articleSchema } from '../Schemas';
import { getArticle } from './ArticleSelectors';

/**
 * @description - Predicate function to determine if the given
 * article id should be fetched
 * @param {Object} state
 * @param {Number} articleId
 * @returns {Boolean}
 */
function shouldFetchArticle(state, articleId) {
  const result = getArticle(state, { id: articleId });
  return !result;
}

/**
 * @description - Requests from the API the article we want depending on the
 * returned value from the predicate. In redux jargon, a thunk creator
 * @param {Number} articleId
 * @returns {Function}
 */
function fetchArticle(articleId) {
  return (dispatch, getState) => {
    if (shouldFetchArticle(getState(), articleId)) {
      dispatch(fetchArticleRequest(articleId));
      fetch(`http://api.gameframe.online/v1/article/${articleId}`, { method: 'GET' }) //eslint-disable-line
        .then(response => response.json())
        .then(json => normalize(json, articleSchema))
        .then((data) => {
          dispatch(fetchDevelopersResponse(Object.values(data.entities.developers)));
          dispatch(fetchGamesResponse(Object.values(data.entities.games)));
          dispatch(fetchArticleResponse(articleId, data.entities.articles[articleId]));
        })
        .catch(err => dispatch(fetchArticleResponse(articleId, err)));
    }
  };
}

export { fetchArticle }; //eslint-disable-line
