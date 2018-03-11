import { Map } from 'immutable';
import moment from 'moment';

const initState = Map({
  pieceADay: Map({
    date: moment().format('YYYY-MM-DD'),
    order: 1,
    text: 'asdfasf',
  }),
  systemNews: Map({
    userName: '全部用户',
    text: 'sadfasd',
  }),
  speechControl: Map({
    order: 1,
    right: '',
    title: '',
    quantum: '无',
  }),
  openTime: Map({
    date: moment().format('YYYY-MM-DD'),
    start: '20:00',
    end: '21:00',
  }),
  data: Map({
      viewMode: 'comment',
      start: '',
      end: '',
  }),
});

export default initState;
