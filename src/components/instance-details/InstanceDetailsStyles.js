/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * InstanceDetailsStyles.js                                                  *
 * This file contains CSS style properties intended for use with elements in *
 * the InstanceDetails.js file, as well as other files that make use of the  *
 * InstanceDetails object.                                                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const cornerRadius = '4px';


const InstanceDetails = {
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * GENERAL ELEMENTS AND GAME-SPECIFIC ELEMENTS                               *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

    blurBackgroundBefore: {
    position: 'fixed',
    top: '0',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: '-150'
  },

  blurBackgroundImage: {
    width: '10%',
    height: '10%',
    imageRendering: 'pixelated',
    filter: 'saturate(250%) blur(2px)',
    display: 'block',
    position: 'relative',
    margin: 'auto',
    transform: 'perspective(800px) translate3d(0, 0, 760px) scale(2)',
    zIndex: '-5'
  },

  backgroundBorder: {
    padding: '20px 2% 20px 2%'
  },

  jumbotron: {
    padding: '2% 2% 2% 2%',
    margin: 'auto',
    width: '98%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: `${cornerRadius}`,
    backgroundColor: 'rgba(238, 238, 238, 0.8)'
  },

  titleText: {
    fontSize: 'calc(24px + 2.0vw)'
  },

  releaseDate: {
    fontSize: 'calc(16px + 0.75vw)'
  },

  genreCluster: {
    display: 'flex'
  },

  genreIndicator: {
      fontSize: 'calc(16px + 0.5vw)'
  },

  genreLabelGroup: {
    fontSize: 'calc(16px + 0.5vw)',
    display: 'flex',
    flexWrap: 'wrap'
  },

  carousel: {
    margin: '2% -2% 2% -2%',
    width: '104%',
    backgroundColor: 'black',
    overflow: 'hidden'
  },

  carouselCoverLink: {
    display: 'flex',
    width: '100%'
  },

  carouselCoverImage: {
    maxWidth: '96vw',
    maxHeight: '50vh',
    margin: 'auto',
  },

  carouselScreenshotLink: {
    display: 'flex',
    width: '100%'
  },

  carouselScreenshotImage: {
    maxWidth: '96vw',
    maxHeight: '50vh',
    margin: 'auto'
  },

  secondaryDataCluster: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  priceCluster: {
    display: 'flex',
    flexDirection: 'row'
  },

  priceIndicator: {
    fontSize: 'calc(14px + 0.5vw)'
  },

  priceTag: {
    fontSize: 'calc(14px + 0.5vw)',
    color: '#00884b'
  },

  horizontalRule: {
    borderTop: '1px dotted #333333',
    opacity: '0.5',
    width: '100%'
  },

  synoposisIndicator: {
    fontSize: 'calc(16px + 0.75vw)'
  },

  synoposisHTMLContainer: {
    overflow: 'hidden'
  },

  externalGridCluster: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    flexFlow: 'row wrap',
    justifyContent: 'space-around'
  },

  developerGridCluster: {
    flexGrow: '0'
  },

  developerIndicator: {
    fontSize: 'calc(16px + 0.75vw)'
  },

  articleGridCluster: {
    flexGrow: '0'
  },

  articleIndicator: {
    fontSize: 'calc(16px + 0.75vw)'
  },

  minigrid: {
    maxHeight: '70vh',
    overflowY: 'scroll',
    borderRadius: `${cornerRadius}`,
    display: 'flex',
    flexDirection: 'column',
    flexFlow: 'row wrap'
  },

  minigridLink: {
    textDecoration: 'none',
    borderRadius: `${cornerRadius}`,
    width: 'calc((100vh + 20vw) / 4)',
    height: 'calc((20vh + 20vw) / 2)',
    margin: 'calc((1vw + 1vh) / 2)',
    flex: 'auto'
  },

  minicard: cover => ({
    width: '100%',
    height: '100%',
    borderRadius: `${cornerRadius}`,
    backgroundImage: `url(${cover})`,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'all 0.2s',
    ':hover': {
      filter: 'brightness(150%)',
      boxShadow: '0 14px 20px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)'
    }
  }),

  minicardTextArea: {
    padding: '2%',
    background: 'rgba(16, 16, 16, 0.9)',
    color: '#eeeeee',
    borderRadius: `${cornerRadius}`
  },

  minicardParagraph: {
    fontSize: 'calc(12px + 0.5vw)'
  },

  twitterIndicator: {
    fontSize: 'calc(16px + 0.75vw)'
  },

  youtubeIndicator: {
    fontSize: 'calc(16px + 0.75vw)'
  },

  twitchIndicator: {
    fontSize: 'calc(16px + 0.75vw)'
  },

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DEVELOPER-SPECIFIC ELEMENTS                                               *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  developerPrimaryDataCluster: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },

  developerLogo: {
    flexGrow: '0',
    marginLeft: '-2%',
    marginTop: '-2%',
    marginRight: '2%',
    display: 'block',
    height: 'calc(45.6px + 9.12vw)',
    maxWidth: '100%'
  },

  developerLogoImageBoundingBox: {
    maxHeight: 'calc(45.6px + 9.12vw)',
    borderBottomRightRadius: `${cornerRadius}`,
    maxWidth: '100%',
    objectFit: 'scale-down'
  },

  developerLogoImage: {
    height: 'calc(45.6px + 9.12vw)',
    width: 'auto',
    borderBottomRightRadius: `${cornerRadius}`,
    borderTopLeftRadius: `${cornerRadius}`
  },

  developerPrimaryInfoCluster: {
    flexGrow: '2',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: 'auto',
    justifyContent: 'flex-end'
  },

  establishDateIndicator: {
    fontSize: 'calc(10px + 1.0vw)'
  },

  locationIndicator: {
    fontSize: 'calc(10px + 1.0vw)'
  },

  bigButtonCluster: {
    marginTop: '1.5%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 'calc(16px + 0.75vw)',
    justifyContent: 'space-around'
  },

  bigButton: {
    margin: 'auto',
    padding: '0.5em 1em 0.5em 1em',
    textDecoration: 'none',
    color: '#eeeeee',
    backgroundColor: 'rgba(51, 51, 51, 0.85)',
    transition: 'all 0.2s',
    borderRadius: `${cornerRadius}`,
    border: '1px solid #333333',
    ':hover': {
      color: '#333333',
      backgroundColor: 'rgba(238, 238, 238, 0.2)'
    }
  },

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ARTICLE-SPECIFIC ELEMENTS                                                 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


};

export default InstanceDetails;
