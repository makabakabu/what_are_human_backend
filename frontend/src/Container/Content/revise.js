import React from 'react';
import { Collapse } from 'antd';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

const allRevises = gql`
    query allRevises{
        allRevises{
            userName
            order
            content
            time
            id
        }
    }
`;

const removeRevise = gql`
    mutation removeRevise($id: String!, $order: Int!){
        visibleRevise(id: $id, order: $order, visibility: false){
            userName,
        }
    }
`;

const { Panel } = Collapse;
const Revise = ({ data, remove, removeRevise }) => {
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
        <div style={{ width: '80%', height: '500px', marginTop: '150px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', overflowX: 'hidden' }}>
            <Collapse bordered={false} style={{ width: '600px', backgroundColor: 'transparent' }}>
                { data.allRevises.length !== 0 && data.allRevises.map(value => (<Panel header={`第${value.order}条   ${value.time}   ${value.userName}`} key={value.id} style={customPanelStyle}>
                    <div style={{ width: '90%', float: 'left' }}>{value.content}</div>
                    <div style={{ width: '10%', float: 'left', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={remove({ item: value, removeRevise })} role="presentation">
                        删除
                    </div>
                                                                                </Panel>)) }
            </Collapse>
        </div>
    );
};

Revise.propTypes = {
    data: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeRevise: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => ({
    remove: ({ item, removeRevise }) => async () => {
        await removeRevise({ variables: { id: item.id, order: item.order } });
        window.location.reload();
    },
});

export default connect(null, mapDispatchToProps)(compose(graphql(allRevises), graphql(removeRevise, { name: 'removeRevise' }))(Revise));
