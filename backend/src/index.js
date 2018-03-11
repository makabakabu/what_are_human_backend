import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import cors from 'cors';
import connectMongo from './mongo-connector';
import schema from './schema/index';

const start = async () => {
    const mongo = await connectMongo();
    let app = express();
    app = app.use(cors());
    app.use('/graphql', bodyParser.json(), graphqlExpress(() => ({ schema, context: { mongo } })));
    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
    }));

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Hackernews GraphQL server running on port ${PORT}.`);
    });
};

start();
