import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { List } from 'antd';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const allComments = gql`
    query {
        operationRecord(kind: "comment"){
            id
            userName
            content
            time
        }
    }
`;

// 从systemNews中获取
const cancelComment = gql`
    mutation cancelComment ($id: String!) {
        visibleComment(order: 1, id: $id, visibility: true){
            userName,
            time,
        }
    }
`;

const removeComment = gql`
    mutation removeComment($id: String!){
        removeComment(id: $id){
            userName
            time
        }
    }
`;

const { Item } = List;
const Operation = ({ id, remove, cancel, removeComment, cancelComment }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px' }} onClick={remove({ id, removeComment })} role="presentation">
            删除
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px' }} onClick={cancel({ id, cancelComment })} role="presentation">
            撤销
        </div>
    </div>
);

Operation.propTypes = {
    id: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    removeComment: PropTypes.func.isRequired,
    cancelComment: PropTypes.func.isRequired,
};

const Comment = ({ data, remove, cancel, removeComment, cancelComment }) => {
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    return (
        <div style={{ width: '600px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center' }}>
            <List
              itemLayout="horizontal"
              dataSource={data.operationRecord}
              renderItem={item => (
                <Item actions={[<Operation id={item.id} remove={remove} cancel={cancel} removeComment={removeComment} cancelComment={cancelComment} />]} style={{ width: '580px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7f7f7', marginTop: '10px', borderRadius: '4px' }}>
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
    removeComment: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    cancelComment: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    operationRecord: state.get('operationRecord'),
});

const mapDispatchToProps = () => ({
    remove: ({ id, removeComment }) => async () => {
        await removeComment({ variables: { id } });
        window.location.reload();
    },
    cancel: ({ id, cancelComment }) => async () => {
        await cancelComment({ variables: { id } });
        window.location.reload();
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(allComments), graphql(removeComment, { name: 'removeComment' }), graphql(cancelComment, { name: 'cancelComment' }))(Comment));
