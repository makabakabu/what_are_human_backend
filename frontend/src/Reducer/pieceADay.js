const pieceADay = (state, action) => {
  switch (action.type) {
    case 'PIECEADAY_SELECT_DATE':
        return state.set('date', action.date);

    case 'PIECEADAY_CHANGE_ORDER':
        return state.set('order', action.order);

    case 'PIECEADAY_EDIT':
        return state.set('order', action.order);

    default:
      return state;
  }
};

export default pieceADay;
