import { ObjectId } from 'mongodb';
import moment from 'moment';
import { Map, fromJS } from 'immutable';

const resolvers = {
    Query: {
        whatAreHuman: async (data, { userName }, { mongo: { Academy, Plaza, Account, OpenTime, SystemNews } }) => {
            const academy = await Academy.find({}).toArray();
            const plaza = await Plaza.find({}).toArray();
            const accountArray = await Account.find({}).toArray();
            const userInfo = accountArray.length > 0 ? accountArray[0] : {};
            const openTimeArray = await OpenTime.find({ date: moment().format('YYYY-MM-DD') }).toArray();
            const openTime = openTimeArray.length > 0 ? openTime[0] : { date: '', start: '', end: '' };
            const systemNews = await SystemNews.find({ userName }).toArray();
            return {
                academy,
                plaza,
                userInfo, // 只有一个
                systemNews,
                openTime, // 只有一个
            };
        },
        openTime: async (data, regs, { mongo: { OpenTime } }) => OpenTime.find({}).toArray(),
        pieceADay: async (data, { order }, { mongo: { Academy } }) => {
            const pieceArray = await Academy.find({ order }).toArray();
            return pieceArray.map(value => ({ order: value.order, content: value.content }));
        },
        speechTitle: async (data, regs, { mongo: { Plaza } }) => {
            const info = await Plaza.find({}).toArray();
            const userNameArray = [];
            info.forEach(value => (value.visibility && userNameArray.push({ userName: value.title })));
            return userNameArray;
        },
        commentUserName: async (data, { order }, { mongo: { Academy } }) => {
            const info = await Academy.find({ order }).toArray();
            if (info.length === 0) {
                return [];
            }
            const userNameArray = [];
            const [{ comment }] = info;
            comment.forEach((item) => {
                if (item.visibility) {
                    userNameArray.push(item.userName);
                }
                item.recomment.forEach((recommentItem) => { if (recommentItem.visibility) { userNameArray.push(recommentItem.userName); } });
            });
            return userNameArray.map(item => ({ userName: item }));
        },
        speechUserName: async (data, { title }, { mongo: { Plaza } }) => {
            const info = await Plaza.find({ title }).toArray();
            if (info.length === 0 || !info[0].visibility) {
                return [];
            }
            const { review } = info[0];
            const userNameArray = [];
            Map(review).forEach(value => value.forEach((speechUserNameItem) => { if (speechUserNameItem.visibility) { userNameArray.push(speechUserNameItem.userName); } }));
            return userNameArray.map(item => ({ userName: item }));
        },
        academy: async (data, regs, { mongo: { Academy } }) => {
            const pieceArray = await Academy.find({}).toArray();
            return pieceArray.map(value => ({ order: value.order, content: value.content }));
        },
        user: async (data, { userName }, { mongo: { Account } }) => {
            const usersArray = await Account.find({ userName }).toArray();
            return usersArray.map(value => ({ userName: value.userName, gender: value.gender, time: value.time, quantum: value.quantum }));
        },
        allUsers: async (data, regs, { mongo: { Account } }) => {
            const usersArray = await Account.find({}).toArray();
            return usersArray.map(value => ({ userName: value.userName, gender: value.gender, time: value.time, quantum: value.quantum }));
        },
        gagedUser: async (data, regs, { mongo: { Account } }) => {
            const usersArray = await Account.find({}).toArray();
            return usersArray.filter(value => value.quantum !== '无').map(value => ({ userName: value.userName, gender: value.gender, time: value.time, quantum: value.quantum }));
        },
        allSystemNews: async (data, regs, { mongo: { SystemNews } }) => {
            const systemNewsArray = await SystemNews.find({}).toArray();
            return systemNewsArray.filter(item => item.visibility).map(value => ({ id: value.id.toString(), userName: value.userName, content: value.content, time: value.time, kind: value.kind }));
        },
        allComments: async (data, { userName, order }, { mongo: { Academy } }) => {
            if (userName === '') {
                return [];
            }
            const info = await Academy.find({ order }).toArray();
            const [{ comment }] = info;
            const commentsArray = [];
            comment.filter(value => value.userName === userName).forEach(item => commentsArray.push({ userName: item.userName, content: item.content, time: item.time, id: item.id.toString() }));
            info[0].comment.forEach(commentItem => commentsArray.push(...commentItem.recomment.filter(value => value.userName === userName).map(value => ({ userName: value.userName, content: value.content, time: value.time, id: value.id.toString() }))));
            return commentsArray;
        },
        allReviews: async (data, { userName, title }, { mongo: { Plaza } }) => {
            if (userName === '') {
                return [];
            }
            const info = await Plaza.find({ title }).toArray();
            const reviewsArray = [];
            Map(info[0].review).forEach(item => reviewsArray.push(...item.filter(reviewItem => reviewItem.visibility && reviewItem.userName === userName)));
            return reviewsArray.map(value => ({ title, userName: value.userName, content: value.content, time: value.time, id: value.id.toString() }));
        },
        allSpeechs: async (data, { title }, { mongo: { Plaza } }) => {
            if (title === '') {
                return [];
            }
            const info = await Plaza.find({ title }).toArray();
            return info.map(value => (value.visibility && { userName: value.userName, content: value.content, time: value.time, id: value.id.toString(), title: value.title }));
        },
        allRevises: async (data, regs, { mongo: { Academy } }) => {
            const info = await Academy.find({}).toArray();
            const reviseList = [];
            info.forEach(item => item.revise.forEach((value) => { if (value.visibility) { reviseList.push({ userName: value.userName, content: value.content, time: value.time, id: value.id.toString(), order: item.order }); } }));
            return reviseList;
        },
        operationRecord: async (data, { kind }, { mongo: { OperationRecord } }) => {
            const info = await OperationRecord.find({ kind }).toArray();
            switch (kind) {
                case 'comment':
                    // 到所有comment里面检索
                    return info.map(value => ({ id: value.id, userName: value.userName, to: value.to, content: value.content, time: value.time }));

                case 'review':
                    // 到所有review里面检索
                    return info.map(value => ({ id: value.id, userName: value.userName, to: value.to, content: value.content, time: value.time }));

                case 'revise':
                    // 到所有academy 里面检索
                    return info.map(value => ({ id: value.id, userName: value.userName, order: value.order, content: value.content, time: value.time }));

                case 'speech':
                    // 到所有plaza里面检索
                    return info.map(value => ({ id: value.id, userName: value.userName, plazaName: value.plazaName, title: value.title, content: value.content, time: value.time }));

                default:
                    return info;
            }
        },
        reviewChart: async (data, { start, end }, { mongo: { Data } }) => {
            // 重组每一个数据，然后再比
            const reformDate = ({ date }) => {
                date = date.split('-');
                return (date[0] * 10000) + (date[1] * 100) + date[2];
            };
            if (start === '') {
                return [];
            }
            const info = await Data.find({}).toArray();
            const dataArray = [];
            info.forEach((value) => {
                if (reformDate({ date: value.date }) >= reformDate({ date: start }) && reformDate({ date: value.date }) <= reformDate({ date: end })) {
                    dataArray.push({ date: value.date, number: value.review });
                }
            });
            console.log(dataArray);
            return dataArray;
        },
        commentChart: async (data, { start, end }, { mongo: { Data } }) => {
            // 重组每一个数据，然后再比
            const reformDate = ({ date }) => {
                date = date.split('-');
                return (date[0] * 10000) + (date[1] * 100) + date[2];
            };
            if (start === '') {
                return [];
            }
            const info = await Data.find({}).toArray();
            const dataArray = [];
            info.forEach((value) => {
                if (reformDate({ date: value.date }) >= reformDate({ date: start }) && reformDate({ date: value.date }) <= reformDate({ date: end })) {
                    dataArray.push({ date: value.date, number: value.comment });
                }
            });
            console.log(dataArray);
            return dataArray;
        },
    },
    Mutation: {
        createOpenTime: async (data, regs, { mongo: { OpenTime } }) => {
            await OpenTime.insert(regs);
            return regs;
        },
        removeOpenTime: async (data, regs, { mongo: { OpenTime } }) => {
            await OpenTime.remove(regs);
            return regs;
        },
        visibleComment: async (data, { order, id, visibility }, { mongo: { Academy, SystemNews, OperationRecord } }) => {
            // 将academy里面的visibility设置为空，并且发送systemNews
            // 是否需要可以撤销系统消息(可以)
            const operationRecordPiece = await OperationRecord.find({ id: new ObjectId(id) }).toArray();
            if (visibility) {
                [{ order }] = operationRecordPiece;
            }
            const info = await Academy.find({ order }).toArray(); // get the academy
            const [{ comment }] = info;
            let selectedComment;
            if (comment.filter(item => item.id.toString() === id).length > 0) {
                selectedComment = comment.find(item => item.id.toString() === id);
                selectedComment.visibility = visibility;
            } else {
                comment.map(item => item.recomment.map((recommentItem) => {
                    if (recommentItem.id.toString() === id) {
                        recommentItem.visibility = visibility;
                    }
                    selectedComment = recommentItem;
                    return recommentItem;
                }));
            }
            if (visibility) {
                await OperationRecord.remove({ id: new ObjectId(id) });
                await SystemNews.remove({ id: new ObjectId(id) });
            } else {
                await OperationRecord.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), kind: 'comment', order }, selectedComment));
                await SystemNews.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), kind: '删除评论', visibility: true, order }, selectedComment));
            }
            await Academy.update({ order }, { $set: { comment } });
            return { userName: 'asdfsadf', time: 'sadfsdaf' };
        },
        removeComment: async (data, { id }, { mongo: { Academy, OperationRecord } }) => {
            const operationRecordPiece = await OperationRecord.find({ id: new ObjectId(id) }).toArray();
            const [{ order }] = operationRecordPiece;
            const info = await Academy.find({ order }).toArray(); // get the academy
            let [{ comment }] = info;
            if (comment.filter(item => item.id.toString() === id).length > 0) {
                comment = fromJS(comment).filter(item => item.get('id').toString() !== id);
            } else {
                comment = fromJS(comment).map(item => item.update('recomment', recomment => recomment.filter(recommentItem => recommentItem.get('id').toString() !== id)));
            }
            await OperationRecord.remove({ id: new ObjectId(id) });
            await Academy.update({ order }, { $set: { comment: comment.toJS() } });
            return { userName: 'asdfasf', time: 'asdfadf' };
        },
        visibleReview: async (data, { id, title, visibility }, { mongo: { Plaza, SystemNews, OperationRecord } }) => {
            // 将academy里面的visibility设置为空，并且发送systemNews
            // 是否需要可以撤销系统消息(可以)
            const operationRecordPiece = await OperationRecord.find({ id: new ObjectId(id), kind: 'review' }).toArray();
            if (visibility) {
                [{ title }] = operationRecordPiece;
            }
            const info = await Plaza.find({ title }).toArray(); // get the academ
            let { review } = info[0];
            let selectedReview;
            review = fromJS(review).map(item => item.map((reviewItem) => {
                if (reviewItem.get('id').toString() === id) {
                    reviewItem = reviewItem.set('visibility', visibility);
                    selectedReview = reviewItem.toJS();
                }
                return reviewItem;
            }));
            if (visibility) {
                await OperationRecord.remove({ id: new ObjectId(id) });
                await SystemNews.remove({ id: new ObjectId(id) });
            } else {
                await OperationRecord.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), kind: 'review', title }, selectedReview));
                await SystemNews.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), kind: '删除评论', visibility: true, title }, selectedReview));
            }
            await Plaza.update({ title }, { $set: { review: review.toJS() } });
            return { userName: 'asdfsadf', time: 'sadfsdaf' };
        },
        removeReview: async (data, { id }, { mongo: { Plaza, OperationRecord } }) => {
            const operationRecordPiece = await OperationRecord.find({ id: new ObjectId(id) }).toArray();
            const [{ title }] = operationRecordPiece;
            const info = await Plaza.find({ title }).toArray(); // get the academy
            let { review } = info[0];
            review = fromJS(review).map(item => item.filter(reviewItem => reviewItem.get('id').toString() !== id));
            await OperationRecord.remove({ id: new ObjectId(id) });
            await Plaza.update({ title }, { $set: { review: review.toJS() } });
            return { userName: 'asdfasf', time: 'asdfadf' };
        },
        visibleSpeech: async (data, { id, visibility }, { mongo: { Plaza, SystemNews, OperationRecord } }) => {
            // 将academy里面的visibility设置为空，并且发送systemNews
            // 是否需要可以撤销系统消息(可以)
            const info = await Plaza.find({ id: new ObjectId(id) }).toArray(); // get the academ
            if (visibility) {
                await OperationRecord.remove({ id: new ObjectId(id) });
                await SystemNews.remove({ id: new ObjectId(id) });
            } else {
                await OperationRecord.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), kind: 'speech' }, info[0]));
                await SystemNews.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), visibility: true, kind: '删除演讲' }, info[0]));
            }
            await Plaza.update({ id: new ObjectId(id) }, { $set: { visibility } });
            return { userName: 'asdfsadf', time: 'sadfsdaf' };
        },
        removeSpeech: async (data, { id }, { mongo: { Plaza, OperationRecord } }) => {
            await OperationRecord.remove({ id: new ObjectId(id) });
            await Plaza.remove({ id: new ObjectId(id) });
            return { userName: 'asdfasf', time: 'asdfadf' };
        },
        visibleRevise: async (data, { id, order, visibility }, { mongo: { Academy, SystemNews, OperationRecord } }) => {
            // 将academy里面的visibility设置为空，并且发送systemNews
            // 是否需要可以撤销系统消息(可以)
            const operationRecordPiece = await OperationRecord.find({ id: new ObjectId(id), kind: 'revise' }).toArray();
            if (visibility) {
                [{ order }] = operationRecordPiece;
            }
            const info = await Academy.find({ order }).toArray(); // get the academ
            let [{ revise }] = info;
            let selectedRevise;
            revise = fromJS(revise).map((item) => {
                if (item.get('id').toString() === id) {
                    item = item.set('visibility', visibility);
                    selectedRevise = item.toJS();
                }
                return item;
            });
            if (visibility) {
                await OperationRecord.remove({ id: new ObjectId(id) });
                await SystemNews.remove({ id: new ObjectId(id) });
            } else {
                await OperationRecord.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), kind: 'revise', order }, selectedRevise));
                await SystemNews.insert(Object.assign({ time: moment().format('YYYY-MM-DD'), kind: '删除修订', visibility: true, order }, selectedRevise));
            }
            await Academy.update({ order }, { $set: { revise: revise.toJS() } });
            return { userName: 'asdfsadf', time: 'sadfsdaf' };
        },
        removeRevise: async (data, { id }, { mongo: { Academy, OperationRecord } }) => {
            const operationRecordPiece = await OperationRecord.find({ id: new ObjectId(id) }).toArray();
            const [{ order }] = operationRecordPiece;
            const info = await Academy.find({ order }).toArray(); // get the academy
            let [{ revise }] = info;
            revise = fromJS(revise).filter(item => item.get('id').toString() !== id);
            await OperationRecord.remove({ id: new ObjectId(id) });
            await Academy.update({ order }, { $set: { revise: revise.toJS() } });
            return { userName: 'asdfasf', time: 'asdfadf' };
        },
        removeSystemNews: async (data, { id }, { mongo: { SystemNews } }) => {
            await SystemNews.update({ id: new ObjectId(id) }, { $set: { visibility: false } });
        },
        cancelSystemNews: async (data, { id }, { mongo: { SystemNews } }) => {
            await SystemNews.remove({ id: new ObjectId(id) });
        },
        removeOperationRecord: async (data, { kind, id }, { mongo: { OperationRecord } }) => {
            await OperationRecord.remove({ kind, id: new ObjectId(id) });
            return {
                id,
            };
        },
        gag: async (data, { userName, quantum, content }, { mongo: { Account, SystemNews } }) => {
            await Account.update({ userName }, { $set: { quantum } });
            await SystemNews.insert({ id: new ObjectId(), userName, content, quantum, time: moment().format('YYYY-MM-DD'), kind: '禁言账号', visibility: true });
            return { userName, gender: 'female', time: 'asadfff' };
        },
        updatePieceADay: async (data, { order, date, content }, { mongo: { Academy, OperationRecord } }) => {
            let response = await Academy.find({ order }).toArray();
            if (response.length > 0) {
                response = await Academy.update({ order }, { $set: { date } });
                response = await Academy.update({ order }, { $set: { content } });
            }
            response = await OperationRecord.insert({ id: new ObjectId(), kind: 'pieceADay', order, content, time: moment().format('YYYY-MM-DD') });
            return { order, content };
        },
        createSystemNews: async (data, regs, { mongo: { SystemNews } }) => {
            await SystemNews.insert({ id: new ObjectId(), ...regs, kind: '系统消息', time: moment().format('YYYY-MM-DD'), visibility: true });
            return { ...regs, kind: '系统消息', time: moment().format('YYYY-MM-DD') };
        },
    },
};

export default resolvers;
