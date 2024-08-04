const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');


// Embedding on the Apollo Server landing page -- https://www.apollographql.com/docs/graphos/explorer/embed-explorer
const { ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault, } = require('@apollo/server/plugin/landingPage/default');

let plugins = [];
if (process.env.NODE_ENV === "production") {
  plugins = [ApolloServerPluginLandingPageProductionDefault({ embed: true, graphRef: process.env.APOLLO_GRAPH_REF || "myGraph@prod" })];
} else {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })];
}


const PORT = process.env.PORT || 3001;
const app = express();

// Adding CORS
const cors = require('cors');
app.use(cors({
  origin: 'https://studio.apollographql.com',
}));


const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins,
  introspection: process.env.NODE_ENV === 'production' ? true : true, // Force introspection to true
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    // app.use(express.static(path.join(__dirname, '../client/build')));
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 API server running on port: ${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();




