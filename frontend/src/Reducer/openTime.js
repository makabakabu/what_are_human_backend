const openTime = (state, action) => {
  switch (action.type) {
    case 'OPENTIME_SELECT_DATE':
      return state.set('date', action.date);

    case 'OPENTIME_SELECT_TIME':
      return state.set(action.kind, action.time);

    default:
      return state;
  }
};

export default openTime;
