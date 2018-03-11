import React from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { AutoComplete, Select, InputNumber } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Review from './review';
import Comment from './comment';
import Speech from './speech';
import Account from './account';

const allUsers = gql`
    query allUsers {
        allUsers {
            userName
            gender
        }
    }

`;

const speechTitle = gql`
    query speechTitle {
        speechTitle {
            userName
        }
    }
`;

const commentUserName = gql`
    query commentUserName ($order: Int!) {
        commentUserName (order: $order) {
            userName
        }
    }
`;


const speechUserName = gql`
    query speechUserName ($title: String!) {
        speechUserName (title: $title) {
            userName
        }
    }
`;

const { Option } = Select;
const SpeechControl = ({ speechTitle, allUsers, commentUserName, speechUserName, selectTitle, speechControl, params, select, commentOrder }) => {
    const componentMap = {
        review: Review,
        comment: Comment,
        speech: Speech,
        account: Account,
    };
    if (allUsers.loading || speechTitle.loading || commentUserName.loading || speechUserName.loading) {
        return (<div>loading...</div>);
    }

    let selector = params.secondPath;
    if (!params.secondPath) {
        selector = 'comment';
    }
    let userSource;
    let speechTitleArray;
    switch (selector) {
        case 'comment':
            userSource = commentUserName.commentUserName.map(value => value.userName);
            break;

        case 'speech':
            speechTitleArray = speechTitle.speechTitle.map(value => value.userName);
            break;

        case 'review':
            userSource = speechUserName.speechUserName.map(value => value.userName);
            speechTitleArray = speechTitle.speechTitle.map(value => value.userName);
            break;

        case 'account':
            userSource = allUsers.allUsers.map(value => value.userName);
            break;

        default:
            break;
    }
    const ComponentName = componentMap[selector];
    return (
        <div style={{ height: '700px', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '8px', color: '#6a6a6a' }} >
            <div style={{ height: '150px', width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Select defaultValue="account" value={selector} style={{ width: 120 }}>
                    <Option value="comment"><Link to="/speechControl/comment" href="/speechControl/comment" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>评论</div></Link></Option>
                    <Option value="review"><Link to="/speechControl/review" href="/speechControl/review" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>回复</div></Link></Option>
                    <Option value="speech"><Link to="/speechControl/speech" href="/speechControl/speech" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>演讲</div></Link></Option>
                    <Option value="account"><Link to="/speechControl/account" href="/speechControl/account" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>账户</div></Link></Option>
                </Select>
                {/*
                1. comment需要order
                a. 姓名栏目中1⃣️只提供有的名称
                2. review 需要2⃣️演讲名称
                b. 姓名栏中3⃣️提供有的名称
                3. speech只提供2⃣️发表演讲的名称
                    */}
                {
                    selector === 'comment' && <InputNumber placeholder="次序" min={1} value={speechControl.get('order')} onChange={num => commentOrder({ num })} />
                }
                {
                    selector === 'review' && <AutoComplete
                      style={{ width: 200 }}
                      dataSource={speechTitleArray}
                      value={speechControl.get('title')}
                      filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                      onSelect={value => selectTitle({ value })}
                    />
                }
                <AutoComplete
                  style={{ width: 200 }}
                  dataSource={selector === 'speech' ? speechTitleArray : userSource}
                  value={speechControl.get('right')}
                  filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  onSelect={value => select({ value })}
                />
            </div>
            <ComponentName />
        </div>
    );
};

SpeechControl.propTypes = {
    speechTitle: PropTypes.object.isRequired,
    allUsers: PropTypes.object.isRequired,
    speechUserName: PropTypes.object.isRequired,
    commentUserName: PropTypes.object.isRequired,
    speechControl: ImmutablePropTypes.map.isRequired,
    params: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    selectTitle: PropTypes.func.isRequired,
    commentOrder: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    speechControl: state.get('speechControl'),
});

const mapDispatchToProps = dispatch => ({
    select: ({ value }) => dispatch({
        type: 'SPEECHCONTROL_SELECT_USER',
        right: value,
    }),
    commentOrder: ({ num }) => dispatch({
        type: 'SPEECHCONTROL_COMMENT_ORDER',
        num,
    }),
    selectTitle: ({ value }) => dispatch({
        type: 'SPEECHCONTROL_SELECT_TITLE',
        title: value,
    }),
});

const commentUserNameOptions = {
    options: props => ({
        variables: {
            order: props.speechControl.get('order'),
        },
    }),
    name: 'commentUserName',
};

const speechUserNameOptions = {
    options: props => ({
        variables: {
            title: props.speechControl.get('title'),
        },
    }),
    name: 'speechUserName',
};

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(allUsers, { name: 'allUsers' }), graphql(speechTitle, { name: 'speechTitle' }), graphql(commentUserName, commentUserNameOptions), graphql(speechUserName, speechUserNameOptions))(SpeechControl)); // graphql(commentUserName, commentUserNameOptions), graphql(speechUserName, speechUserNameOptions)
