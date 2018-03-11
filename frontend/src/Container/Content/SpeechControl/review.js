import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { List } from 'antd';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const allReviews = gql`
    query allReviews($userName: String!, $title: String!){
        allReviews(userName: $userName, title: $title){
            userName
            content
            time
            id
            title
        }
    }
`;

const removeReview = gql`
    mutation removeReview($id: String!, $title: String!){
        visibleReview(id: $id, title: $title, visibility: false){
            time
        }
    }
`;

const { Item } = List;
const Cancel = ({ id, title, remove, removeReview }) => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }} onClick={remove({ id, title, removeReview })} role="presentation">删除</div>
);

Cancel.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    removeReview: PropTypes.func.isRequired,
};

const Review = ({ data, remove, removeReview }) => {
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    return (
        <div style={{ width: '600px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center' }}>
            <List
              itemLayout="horizontal"
              dataSource={data.allReviews}
              renderItem={item => (
                <Item actions={[<Cancel id={item.id} title={item.title} remove={remove} removeReview={removeReview} />]} style={{ width: '600px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7f7f7', marginTop: '10px', borderRadius: '4px' }}>
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
    removeReview: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    speechControl: state.get('speechControl'),
});

const mapDispatchToProps = () => ({
    remove: ({ id, title, removeReview }) => async () => {
        await removeReview({ variables: { id, title } });
        window.location.reload();
    },
});

const queryOptions = {
    options: props => ({
        variables: {
            userName: props.speechControl.get('right'),
            title: props.speechControl.get('title'),
        },
    }),
};

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(allReviews, queryOptions), graphql(removeReview, { name: 'removeReview' }))(Review));
