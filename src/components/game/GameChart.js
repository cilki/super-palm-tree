
/**
 * A GameChart for rendering the D3 charts for a game
 */

import React from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';

import { select } from 'd3-selection';
import {
  scaleTime,
  scaleLinear,
} from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { extent } from 'd3-array';
import { line as Line, curveMonotoneX } from 'd3-shape';
import { legendColor } from 'd3-svg-legend';

import * as d3 from 'd3-transition'; //eslint-disable-line

/**
 * @description - Creates and returns a LineChart created using D3
 * @param {Object} props
 * @returns {React.Component}
 */
class GameChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
    };

    this.svgRef = null;
    this.graphWidth = -1;
    this.graphHeight = -1;
    this.margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50,
    };
  }

  componentDidUpdate() {
    this.renderD3();
  }

  setSvgRef = (svg) => {
    this.svgRef = svg;
  };

  createLegend() {
    const linear = scaleLinear()
      .domain([0, 1])
      .range(['rgb(46, 73, 123)', 'rgb(71, 187, 94)']);

    const legend = legendColor()
      .shapeWidth(30)
      .cells(3)
      .labels(['Videos', 'Tweets', 'Articles'])
      .orient('vertical')
      .scale(linear);

    if (this.legend) {
      this.legend.remove();
    }

    this.legend = select(this.svgRef)
      .append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(60,20)')
      .call(legend);
  }

  /**
   * @description - Parses the data contained in `this.props` under the
   * given key
   * @param {String} dataKey
   * @return {Array}
   */
  parseData(dataKey) {
    const stats = [];
    const data = this.props[dataKey];
    if (!data || !data.length) {
      return stats;
    }
    const now = new Date();
    data.forEach((item) => {
      const date = new Date(item.timestamp);

      // make sure we're not collecting data more than a month
      if (now.getTime() - date.getTime() > 7884 * 1000000) {
        return;
      }

      const value = stats.find(stat => stat.date.getFullYear() === date.getFullYear() &&
        stat.date.getMonth() === date.getMonth() && stat.date.getDate() === date.getDate());
      if (value) {
        value.number += 1;
      } else {
        stats.push({
          date,
          number: 1,
        });
      }
    });

    return stats
      .sort((first, next) => {
        return Number(first.date.getTime() > next.date.getTime()) -
          Number(first.date.getTime() < next.date.getTime());
      });
  }

  /**
   * @description - Renders the entire D3 graph
   */
  renderD3() {
    if (this.svgRef) {
      const { width, height } = this.state;

      this.graphWidth = width - this.margin.left - this.margin.right;
      this.graphHeight = height - this.margin.top - this.margin.bottom;

      select(this.svgRef)
        .attr('width', Math.round(width))
        .attr('height', Math.round(height));
    }

    // we want the time to be from now until a month ago
    const now = new Date();
    const past = new Date();
    const threeMonths = 7884 * 1000000;

    past.setTime(now.getTime() - threeMonths);

    const x = scaleTime()
      .domain([past, now])
      .rangeRound([0, this.graphWidth]);
    const y = scaleLinear()
      .rangeRound([this.graphHeight, 0]);

    if (this.g) {
      this.g.remove();
    }

    const videoData = this.parseData('videos');
    const articleData = this.parseData('articles');
    const tweetData = this.parseData('tweets');

    const [videoMin, videoMax] = extent(videoData, d => d.number);
    const [articleMin, articleMax] = extent(articleData, d => d.number);
    const [tweetMin, tweetMax] = extent(tweetData, d => d.number);
    y.domain([
      Math.min(videoMin, articleMin, tweetMin),
      Math.max(videoMax, articleMax, tweetMax),
    ]);

    this.g = select(this.svgRef).append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.g.append('g')
      .attr('transform', `translate(0,${this.graphHeight})`)
      .call(axisBottom(x));

    this.g.append('g')
      .call(axisLeft(y));

    const line = Line()
      .x(d => x(d.date))
      .y(d => y(d.number))
      .curve(curveMonotoneX);

    // line for videos
    this.g.append('path')
      .datum(videoData)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(46, 73, 123)')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // line for articles
    this.g.append('path')
      .datum(articleData)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(71, 187, 94)')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    this.g.append('path')
      .datum(tweetData)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(82, 130, 109)')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    this.createLegend();
  }

  render() {
    return (
      <Measure
        bounds
        onResize={(contentRect) => {
          this.setState({
            width: contentRect.bounds.width,
            height: contentRect.bounds.height,
          });
        }}
      >
        {({ measureRef }) => (
          <div
            ref={measureRef}
            style={{
              width: '100%',
              flex: 1,
              maxHeight: '100%',
            }}
          >
            <svg ref={this.setSvgRef} />
          </div>
        )}
      </Measure>
    );
  }
}

GameChart.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({ //eslint-disable-line
    timestamp: PropTypes.string.isRequired, //eslint-disable-line
  })),
  videos: PropTypes.arrayOf(PropTypes.shape({ //eslint-disable-line
    timestamp: PropTypes.string.isRequired, //eslint-disable-line
  })),
};

GameChart.defaultProps = {
  videos: [],
};

export default GameChart;
