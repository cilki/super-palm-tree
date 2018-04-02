import React from 'react';
import PropTypes from 'prop-types';
import Radium, { StyleRoot } from 'radium';
import Highlighter from 'react-highlight-words';
import InstanceDetailsStyles from './instance-details/InstanceDetailsStyles';
import Minigrid from './minigrid/Minigrid';
import Minicard from './minicard/Minicard';
import CommonAssets from '../inline-styles/CommonAssets';
import InstanceDetails from './instance-details/InstanceDetails';

/**
 * @description - Helper method for rendering a link to a developer or article
 * @param {Object} props
 * @param {String} props.label
 * @param {String} props.url
 * @returns {React.Component}
 */
function link({
  label, url, cover, key,
}) {
  return (
    <Minicard label={label} url={url} cover={cover} cardKey={`${key}-inner`} key={key} />
  );
}

link.propTypes = {
  label: PropTypes.object.isRequired,//eslint-disable-line
  url: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query_string: decodeURI(window.location.href.substring(window.location.href.lastIndexOf('=') + 1)),//eslint-disable-line
      game_results: {},
      developer_results: {},
      article_results: {},
      // video_results: {},
      // twitter_results {},
    };
    this.updateGameItems = this.updateGameItems.bind(this);
    this.updateDeveloperItems = this.updateDeveloperItems.bind(this);
    this.updateArticleItems = this.updateArticleItems.bind(this);
    this.updateGameItems();
    this.updateDeveloperItems();
    this.updateArticleItems();
  }

  componentDidUpdate() {
    const newString = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('=') + 1));//eslint-disable-line
    if (newString !== this.state.query_string) {
      this.state.query_string = newString;
      this.updateGameItems();
      this.updateDeveloperItems();
      this.updateArticleItems();
    }
  }

  updateGameItems() {
    fetch(//eslint-disable-line
      encodeURI(`http://api.gameframe.online/v1/game?q={"filters":[{"name":"name","op":"like","val":"%${this.state.query_string}%"}],"order_by":[{"field":"metacritic","direction":"desc"}]}&results_per_page=1000`),
      { method: 'GET' },
    )
      .then(response => response.json())
      .then((data) => {
        this.setState({ game_results: data });
      });
  }

  updateDeveloperItems() {
    fetch(//eslint-disable-line
      encodeURI(`http://api.gameframe.online/v1/developer?q={"filters":[{"name":"name","op":"like","val":"%${this.state.query_string}%"}],"order_by":[{"field":"name","direction":"asc"}]}&results_per_page=1000`),
      { method: 'GET' },
    )
      .then(response => response.json())
      .then((data) => {
        this.setState({ developer_results: data });
      });
  }

  updateArticleItems() {
    fetch(//eslint-disable-line
      encodeURI(`http://api.gameframe.online/v1/article?q={"filters":[{"name":"title","op":"like","val":"%${this.state.query_string}%"}],"order_by":[{"field":"title","direction":"asc"}]}&results_per_page=1000]}`),
      { method: 'GET' },
    )
      .then(response => response.json())
      .then((data) => {
        this.setState({ article_results: data });
      });
  }

  render() {
    const query = this.state.query_string || '';
    const searchWords = query ? query.split(' ') : [];
    return (
      <StyleRoot>
        <div>
          <div style={[
            CommonAssets.fillBackground,
            CommonAssets.horizontalGradient,
          ]}
          />
          <div style={[
            CommonAssets.stripeOverlay,
            CommonAssets.fillBackground,
          ]}
          />
          <InstanceDetails>
            <div style={[InstanceDetailsStyles.externalGridCluster]}>
              <div style={[InstanceDetailsStyles.gameGridCluster('30%')]}>
                <div style={[InstanceDetailsStyles.gameIndicator]}>
                  Game Results:
                </div>
                <Minigrid>
                  {
                    this.state.game_results.objects ?
                    this.state.game_results.objects.map(game => link({
                      label: <Highlighter
                        highlightStyle={{ backgroundColor: '#ffd54f' }}
                        searchWords={searchWords}
                        textToHighlight={game.name}
                      />,
                      url: `/games/${game.game_id}`,
                      cover: (game.cover && game.cover.indexOf('http') < 0 ? `https://${game.cover}` : game.cover),
                      key: `game-${game.game_id}`,
                    })) : ['Loading games']
                  }
                </Minigrid>
              </div>
              <br />
              <div style={[InstanceDetailsStyles.developerGridCluster('30%')]}>
                <div style={[InstanceDetailsStyles.developerIndicator]}>
                  Developer Results:
                </div>
                <Minigrid>
                  {
                    this.state.developer_results.objects ?
                    this.state.developer_results.objects.map(developer => link({
                      label: <Highlighter
                        highlightStyle={{ backgroundColor: '#ffd54f' }}
                        searchWords={searchWords}
                        textToHighlight={developer.name}
                      />,
                      url: `/developers/${developer.developer_id}`,
                      cover: (developer.logo && developer.logo.indexOf('http') < 0 ? `https://${developer.logo}` : developer.logo),
                      key: `developer-${developer.developer_id}`,
                    })) : ['Loading developers']
                  }
                </Minigrid>
              </div>
              <br />
              <div style={[InstanceDetailsStyles.articleGridCluster('30%')]}>
                <div style={[InstanceDetailsStyles.articleIndicator]}>
                  Article Results:
                </div>
                <Minigrid>
                  {
                    this.state.article_results.objects ?
                    this.state.article_results.objects.map(article => link({
                      label: <Highlighter
                        highlightStyle={{ backgroundColor: '#ffd54f' }}
                        searchWords={searchWords}
                        textToHighlight={article.title}
                      />,
                      url: `/articles/${article.article_id}`,
                      cover: article.cover,
                      key: `article-${article.article_id}`,
                    })) : ['Loading articles']
                  }
                </Minigrid>
              </div>
            </div>
          </InstanceDetails>
        </div>
      </StyleRoot>
    );
  }
}

export default Radium(SearchResults);