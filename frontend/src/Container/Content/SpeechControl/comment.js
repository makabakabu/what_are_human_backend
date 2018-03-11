import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { List } from 'antd';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const allComments = gql`
    query allComments ($userName: String!, $order: Int!) {
        allComments (userName: $userName, order: $order) {
            userName
            content
            time
            id
        }
    }
`;

const visibleComment = gql`
    mutation visibleComment ($id: String!, $order: Int!, $visibility: Boolean!) {
        visibleComment (id: $id, order: $order, visibility: $visibility) {
            userName,
            time
        }
    }
`;

const { Item } = List;
const Cancel = ({ id, order, remove, visibleComment }) => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }} onClick={remove({ id, order, visibleComment })} role="presentation">删除</div>
);

Cancel.propTypes = {
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired,
    visibleComment: PropTypes.func.isRequired,
};

const Comment = ({ data, remove, visibleComment, speechControl }) => {
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    return (
        <div style={{ width: '600px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center' }}>
            <List
              itemLayout="horizontal"
              dataSource={data.allComments}
              renderItem={item => (
                <Item actions={[<Cancel id={item.id} remove={remove} visibleComment={visibleComment} order={speechControl.get('order')} />]} style={{ width: '600px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7f7f7', marginTop: '10px', borderRadius: '4px' }}>
                    <Item.Meta
                      title={`${item.userName}   ${item.time}`}
                      description={item.content}
                      style={{ marginLeft: '10px' }}
                    />
                </Item>
            )}
            />
        </div>
    );
};

Comment.propTypes = {
    data: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    visibleComment: PropTypes.func.isRequired,
    speechControl: ImmutablePropTypes.map.isRequired,
};

const mapStateToProps = state => ({
    speechControl: state.get('speechControl'),
});

const mapDispatchToProps = () => ({
    remove: ({ id, order, visibleComment }) => async () => {
        await visibleComment({ variables: { id, order, visibility: false } });
        window.location.reload();
    },
});

const queryOptions = {
    options: props => ({
        variables: {
            userName: props.speechControl.get('right'),
            order: props.speechControl.get('order'),
        },
    }),
};

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(allComments, queryOptions), graphql(visibleComment, { name: 'visibleComment' }))(Comment));
