import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
    type Query{
        whatAreHuman(userName: String!): whatAreHuman!
        openTime: [Time!]!
        academy: [Piece!]!
        operationRecord(kind: String!): [OperationPiece]!
        pieceADay(order: Int!): [Piece!]!
        allUsers: [User!]!
        gagedUser: [User!]!
        allSystemNews:[SystemNews!]!
        allComments(userName: String!, order: Int!): [Comment!]!
        allReviews(userName: String!, title: String!): [Comment!]!
        allSpeechs(title: String!): [Speech!]!
        allRevises: [Revise!]!
        user(userName: String!): [User!]!
        speechTitle: [UserName!]!
        commentUserName(order: Int!): [UserName!]!
        speechUserName(title: String!): [UserName!]!
        reviewChart(start: String!, end: String!): [dayReview!]!
        commentChart(start: String!, end: String!): [dayReview!]!
    }

    type Mutation{
        createOpenTime(date: String!, start: String!, end: String!): Time
        removeOpenTime(date: String!, start: String!, end: String!): Time
        visibleComment(id: String!, order: Int!, visibility: Boolean!): Comment
        removeComment(id: String!): Comment
        visibleReview(id: String!, title: String!, visibility: Boolean!): Comment
        removeReview(id: String!): Comment
        visibleSpeech(id: String!, visibility: Boolean!): Speech
        removeSpeech(id: String!): Speech
        visibleRevise(order: Int!, id: String!, visibility: Boolean!): Revise
        removeRevise(id: String!): Revise
        cancelSystemNews(id: String!): SystemNews
        removeSystemNews(id: String!): SystemNews
        removeOperationRecord(kind: String!, id: String!): OperationPiece
        cancelOperationRecord(kind: String!, id: String!, data: String!): OperationPiece
        gag(userName: String!, quantum: String!): User!
        updatePieceADay(order: Int!, content: String!, date: String!): Piece
        createSystemNews(userName: String!, content: String!): SystemNews!
    }

    type whatAreHuman {
        academy: [Artical!]!
        plaza: [Speech!]!
        userInfo: UserInfo
        openTime: Time
        systemNews: [SystemNews!]
    }

    type Artical {
        order: Int!
        text: String!
        share: Int!
        like: Int!
        revise: String!
        comment: [Comment!]
        notes: Notes
    }

    type Notes {
        userName: String!
        title: String!
        text: String!
        time: String!
    }

    type Speech {
        id: String
        plazaName: String
        userName: String
        title: String
        content: String
        gender: String
        time: String
        share: Int
        collect: Int
        discuss: [ReviewBlock!]
    }

    type UserInfo {
        userName: String
        gender: String
        phoneNumber: Int
        passward: String
        time: String
        quantum: String
        start: String
        end: String
    }

    type UserName {
        userName: String!
    }

    type Time{
        date: String!
        start: String!
        end: String!
    }

    type Comment {
        userName: String!
        gender: String
        content: String!
        time: String!
        id: String!
        recomment: [Recomment!]
    }

    type Recomment {
        userName: String!
        gender: String!
        content: String!
        time: String!
        id: String!
    }

    type ReviewBlock {
        time: String!
        review: [Review!]!
    }

    type Review {
        userName: String!
        gender: String!
        to: String!
        text: String!
        time: String!
    }

    type Revise {
        userName: String!
        order: Int!
        content: String!
        time: String!
        id: String!
    }

    type SystemNews {
        id: String!
        userName: String!
        content: String
        kind: String!
        time: String!
    }

    type Piece {
        order: Int!
        content: String!
    }

    type User {
        userName: String!
        gender: String!
        time: String!
        quantum: String!
    }

    type OperationPiece {
        id: String!
        order: Int
        content: String
        time: String!
        to: String
        userName: String
        plazaName: String
        title: String
        quantum :String
        gender: String
    }

    type dayReview {
        date: String!
        number: Int!
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
