import React from 'react';
import { Collapse } from 'antd';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

const allRevises = gql`
    query {
        operationRecord(kind: "revise"){
            userName
            order
            content
            time
            id
        }
    }
`;

const cancelRevise = gql`
    mutation cancelRevise($id: String!){
        visibleRevise(id: $id, order: 1, visibility: true){
            userName,
        }
    }
`;

const removeRevise = gql`
    mutation removeRevise($id: String!){
        removeRevise(id: $id){
            userName
        }
    }
`;

const { Panel } = Collapse;
const Revise = ({ data, remove, removeRevise, cancel, cancelRevise }) => {
    const customPanelStyle = {
        backgroundColor: '#f7f7f7',
        marginBottom: 24,
        border: 4,
        overflow: 'hidden',
    };
    if (data.loading) {
        return <Spinner name="ball-scale-ripple-multiple" color="coral" />;
    }
    return (
        <div style={{ width: '600px', height: '500px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', overflowX: 'hidden' }}>
            <Collapse bordered={false} style={{ width: '600px', backgroundColor: 'transparent' }}>
                { data.operationRecord.length !== 0 && data.operationRecord.map(value => (<Panel header={`第${value.order}条   ${value.time}   ${value.userName}`} key={value.id} style={customPanelStyle}>
                        <div style={{ width: '83%', float: 'left' }}>{value.content}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px', cursor: 'pointer' }} onClick={remove({ item: value, removeRevise })} role="presentation">
                                删除
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px', cursor: 'pointer' }} onClick={cancel({ item: value, cancelRevise })} role="presentation">
                                撤销
                            </div>
                        </div>
                                                                                          </Panel>))}
            </Collapse>
        </div>
    );
};
Revise.propTypes = {
    data: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeRevise: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    cancelRevise: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => ({
    remove: ({ item, removeRevise }) => async () => {
        await removeRevise({ variables: { id: item.id } });
        window.location.reload();
    },
    cancel: ({ item, cancelRevise }) => async () => {
        await cancelRevise({ variables: { id: item.id } });
        window.location.reload();
    },
});

export default connect(null, mapDispatchToProps)(compose(graphql(allRevises), graphql(removeRevise, { name: 'removeRevise' }), graphql(cancelRevise, { name: 'cancelRevise' }))(Revise));
