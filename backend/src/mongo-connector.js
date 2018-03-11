import { MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017/WhatAreHuman';

const connectMongo = async () => {
    const db = await MongoClient.connect(MONGO_URL);
    return {
        OpenTime: db.collection('OpenTime'),
        Academy: db.collection('Academy'),
        Plaza: db.collection('Plaza'),
        Account: db.collection('Account'),
        SystemNews: db.collection('SystemNews'),
        OperationRecord: db.collection('OperationRecord'),
        Data: db.collection('Data'),
    };
};

export default connectMongo;
