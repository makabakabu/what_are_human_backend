import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { List } from 'antd';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

const allReviews = gql`
    query {
        operationRecord(kind: "review"){
            id
            userName
            content
            time
        }
    }
`;

const cancelReview = gql`
    mutation cancelReview($id: String!){
        visibleReview (id: $id, title: "ASfasf", visibility: true) {
            userName
        }
    }
`;

const removeReview = gql`
    mutation removeReview($id: String!){
        removeReview(id: $id){
            userName
        }
    }
`;

const { Item } = List;
const Cancel = ({ id, remove, cancel, removeReview, cancelReview }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px' }} onClick={remove({ id, removeReview })} role="presentation">
            删除
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px' }} onClick={cancel({ id, cancelReview })} role="presentation">
            撤销
        </div>
    </div>
);

Cancel.propTypes = {
    id: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    removeReview: PropTypes.func.isRequired,
    cancelReview: PropTypes.func.isRequired,
};

const Review = ({ data, remove, cancel, removeReview, cancelReview }) => {
    if (data.loading) {
        return <Spinner name="ball-scale-ripple-multiple" color="coral" />;
    }
    return (
        <div style={{ width: '600px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center' }}>
            <List
              itemLayout="horizontal"
              dataSource={data.operationRecord}
              renderItem={item => (
                <Item actions={[<Cancel id={item.id} remove={remove} cancel={cancel} removeReview={removeReview} cancelReview={cancelReview} />]} style={{ width: '580px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7f7f7', marginTop: '10px', borderRadius: '4px' }}>
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
Review.propTypes = {
    data: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    cancelReview: PropTypes.func.isRequired,
    removeReview: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    speechControl: state.get('speechControl'),
});

const mapDispatchToProps = () => ({
    remove: ({ id, removeReview }) => async () => {
        await removeReview({ variables: { id } });
        window.location.reload();
    },
    cancel: ({ id, cancelReview }) => async () => {
        await cancelReview({ variables: { id } });
        window.location.reload();
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(allReviews), graphql(removeReview, { name: 'removeReview' }), graphql(cancelReview, { name: 'cancelReview' }))(Review));
