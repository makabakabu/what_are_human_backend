import React from 'react';
import PropTypes from 'prop-types';
import Review from './review';
import Comment from './comment';
import Speech from './speech';
import Account from './account';

const SpeechControl = ({ params }) => {
    const componentMap = {
        review: Review,
        comment: Comment,
        speech: Speech,
        account: Account,
    };
    let selector = params.thirdPath;
    if (!selector) {
        selector = 'comment';
    }
    const ComponentName = componentMap[selector];
    return (
        <ComponentName />
    );
};

SpeechControl.propTypes = {
    params: PropTypes.object.isRequired,
};

export default SpeechControl;
