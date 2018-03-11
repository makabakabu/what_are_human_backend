import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { List } from 'antd';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const allSystemNews = gql`
    query allSystemNews{
        allSystemNews{
            id
            userName
            content
            time
            kind
        }
    }
`;

const removeSystemNews = gql`
    mutation removeSystemNews($id: String!){
        removeSystemNews(id: $id){
            userName
            content
            time
            kind
        }
    }
`;

const cancelSystemNews = gql`
    mutation cancelSystemNews($id: String!){
        cancelSystemNews(id: $id){
            userName
            content
            time
            kind
        }
    }
`;

const { Item } = List;
const Cancel = ({ id, remove, removeSystemNews, cancel, cancelSystemNews }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px' }} onClick={remove({ id, removeSystemNews })} role="presentation">删除</div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px' }} onClick={cancel({ id, cancelSystemNews })} role="presentation">撤销</div>
    </div>
);

Cancel.propTypes = {
    id: PropTypes.string.isRequired,
    remove: PropTypes.func.isRequired,
    removeSystemNews: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    cancelSystemNews: PropTypes.func.isRequired,
};

const SystemNews = ({ data, remove, removeSystemNews, cancel, cancelSystemNews }) => {
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    return (
        <div style={{ width: '600px', height: '500px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', overflowX: 'hidden' }}>
            <List
              itemLayout="horizontal"
              dataSource={data.allSystemNews}
              renderItem={item => (
                <Item actions={[<Cancel id={item.id} remove={remove} removeSystemNews={removeSystemNews} cancel={cancel} cancelSystemNews={cancelSystemNews} />]} style={{ width: '580px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7f7f7', marginTop: '10px', borderRadius: '4px' }}>
                    <Item.Meta
                      title={`${item.userName}   ${item.time} ${item.kind}`}
                      description={item.content}
                      style={{ marginLeft: '10px' }}
                    />
                </Item>
            )}
            />
        </div>
    );
};

SystemNews.propTypes = {
    data: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeSystemNews: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    cancelSystemNews: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => ({
    remove: ({ id, removeSystemNews }) => async () => {
        await removeSystemNews({ variables: { id } });
        window.location.reload();
    },
    cancel: ({ id, cancelSystemNews }) => async () => {
        await cancelSystemNews({ variables: { id } });
        window.location.reload();
    },
});

export default connect(null, mapDispatchToProps)(compose(graphql(allSystemNews), graphql(removeSystemNews, { name: 'removeSystemNews' }), graphql(cancelSystemNews, { name: 'cancelSystemNews' }))(SystemNews));
