import pieceADay from './pieceADay';
import systemNews from './systemNews';
import speechControl from './speechControl';
import openTime from './openTime';
import data from './data';

const app = (state, action) => {
  state = state.update('pieceADay', value => pieceADay(value, action));
  state = state.update('systemNews', value => systemNews(value, action));
  state = state.update('speechControl', value => speechControl(value, action));
  state = state.update('openTime', value => openTime(value, action));
  state = state.update('data', value => data(value, action));
  return state;
};

export default app;
