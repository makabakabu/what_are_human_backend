import React from 'react';
import { Collapse } from 'antd';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const allSpeechs = gql`
    query allSpeechs($title: String!){
        allSpeechs(title: $title){
            userName
            title
            content
            time
            id
        }
    }
`;

const removeSpeech = gql`
    mutation removeSpeech($id: String!){
        visibleSpeech(id: $id, visibility: false){
            userName
        }
    }
`;

const { Panel } = Collapse;
const Speech = ({ data, removeSpeech, remove }) => {
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
            <Collapse bordered={false} style={{ width: '600px', backgroundColor: 'transparent' }}>
                { data.allSpeechs && data.allSpeechs.map(value => (<Panel header={`${value.title}   ${value.time}`} key={value.id} style={customPanelStyle}>
                        <div style={{ width: '90%', float: 'left' }}>{value.content}</div>
                        <div style={{ width: '10%', float: 'left', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={remove({ id: value.id, removeSpeech })} role="presentation">
                            删除
                        </div>
                                                                   </Panel>))}
            </Collapse>
        </div>
    );
};

Speech.propTypes = {
    data: PropTypes.object.isRequired,
    removeSpeech: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
        speechControl: state.get('speechControl'),
    });

const mapDispatchToProps = () => ({
    remove: ({ id, removeSpeech }) => async () => {
        await removeSpeech({ variables: { id } });
        window.location.reload();
    },
});

const queryOptions = {
    options: props => ({
        variables: {
            title: props.speechControl.get('right'),
        },
    }),
};

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(allSpeechs, queryOptions), graphql(removeSpeech, { name: 'removeSpeech' }))(Speech));
