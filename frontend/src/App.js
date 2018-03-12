import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import Content from './Container/Content/content';
import LeftPanel from './Container/LeftPanel/leftPanel';

const link = createHttpLink({
  uri: 'http://127.0.0.1:4000/graphql/',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const ContentComponent = ({ match }) => {
  if (!match.params.view) {
    match.params.view = 'pieceADay';
  }
  return (
    <div
      id="App"
      style={styles.content}
    >
      <LeftPanel params={match.params} />
      <Content params={match.params} />
    </div>
  );
};

ContentComponent.propTypes = {
    match: PropTypes.object.isRequired,
};

const App = () => (
    <ApolloProvider client={client} >
      <Router>
        <Switch>
          <Route exact path="/" component={({ match }) => ContentComponent({ match })} />
          <Route exact path="/:view" component={({ match }) => ContentComponent({ match })} />
          <Route exact path="/:view/:secondPath" component={({ match }) => ContentComponent({ match })} />
          <Route exact path="/:view/:secondPath/:thirdPath" component={({ match }) => ContentComponent({ match })} />
        </Switch>
      </Router>
    </ApolloProvider>
);

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    outline: 'none',
    height: '100%',
    backgroundColor: '#ededed',
  },
};

export default App;
