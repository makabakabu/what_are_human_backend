const data = (state, action) => {
    switch (action.type) {
        case 'SPEECHCONTROL_SELECT_USER':
            return state.set('right', action.right);

        case 'SPEECHCONTROL_SELECT_TITLE':
            return state.set('title', action.title);

        case 'SPEECHCONTROL_CHANGE_QUANTUM':
            return state.set('quantum', action.quantum);

        case 'SPEECHCONTROL_COMMENT_ORDER':
            return state.set('order', action.num);

        default:
            return state;
    }
};

export default data;
