import React from 'react';
import { Collapse } from 'antd';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const allSpeechs = gql`
    query {
        operationRecord(kind: "speech"){
            id
            userName
            title
            content
            time
        }
    }
`;

const cancelSpeech = gql`
    mutation cancelSpeech($id: String!){
        visibleSpeech(id: $id, visibility: true){
            userName
        }
    }
`;

const removeSpeech = gql`
    mutation removeSpeech($id: String!){
        removeSpeech(id: $id){
            userName
        }
    }
`;

const { Panel } = Collapse;
const Speech = ({ data, remove, removeSpeech, cancel, cancelSpeech }) => {
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
                { data.operationRecord.map(value => (<Panel header={`${value.title}   ${value.time}`} key={value.id} style={customPanelStyle}>
                        <div style={{ width: '83%', float: 'left' }}>{value.content}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px', cursor: 'pointer' }} onClick={remove({ id: value.id, removeSpeech })} role="presentation">
                                删除
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px', marginLeft: '20px', cursor: 'pointer' }} onClick={cancel({ id: value.id, cancelSpeech })} role="presentation">
                                撤销
                            </div>
                        </div>
                                                     </Panel>))}
            </Collapse>
        </div>
    );
};

Speech.propTypes = {
    data: PropTypes.object.isRequired,
    cancel: PropTypes.func.isRequired,
    cancelSpeech: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    removeSpeech: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    speechControl: state.get('speechControl'),
});

const mapDispatchToProps = () => ({
    remove: ({ id, removeSpeech }) => async () => {
        await removeSpeech({ variables: { id } });
        window.location.reload();
    },
    cancel: ({ id, cancelSpeech }) => async () => {
        await cancelSpeech({ variables: { id } });
        window.location.reload();
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(allSpeechs), graphql(removeSpeech, { name: 'removeSpeech' }), graphql(cancelSpeech, { name: 'cancelSpeech' }))(Speech));
