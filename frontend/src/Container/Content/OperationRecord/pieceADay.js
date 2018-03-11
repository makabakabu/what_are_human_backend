import React from 'react';
import { Collapse } from 'antd';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const pieceADay = gql`
    query {
        operationRecord(kind: "pieceADay"){
            id
            order
            content
            time
        }
    }
`;

const removePieceADay = gql`
    mutation removePieceADay($id: String!){
        removeOperationRecord(kind: "pieceADay", id: $id){
            id
        }
    }
`;

const { Panel } = Collapse;
const PieceADay = ({ data, remove, removePieceADay }) => {
    const customPanelStyle = {
        backgroundColor: '#f7f7f7',
        marginBottom: 24,
        border: 4,
        overflow: 'hidden',
    };
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    return (
        <div style={{ width: '600px', height: '500px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', overflowX: 'hidden' }}>
            <Collapse bordered={false} style={{ width: '580px', backgroundColor: 'transparent' }}>
                { data.operationRecord.map(value => (<Panel header={` 第 ${value.order} 条`} key={value.id} style={customPanelStyle}>
                        <div style={{ width: '90%', float: 'left' }}>{value.content}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px', cursor: 'pointer' }} onClick={remove({ item: value, removePieceADay })} role="presentation">
                                删除
                            </div>
                        </div>
                                                     </Panel>))}
            </Collapse>
        </div>
    );
};

PieceADay.propTypes = {
    data: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removePieceADay: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => ({
    remove: ({ item, removePieceADay }) => async () => {
        await removePieceADay({ variables: { id: item.id } });
        window.location.reload();
    },
});

export default connect(null, mapDispatchToProps)(compose(graphql(pieceADay), graphql(removePieceADay, { name: 'removePieceADay' }))(PieceADay));
