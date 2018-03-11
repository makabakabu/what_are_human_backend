import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { List, Select } from 'antd';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const user = gql`
    query user($userName: String!){
        user(userName: $userName){
            userName
            time
            gender
            quantum
        }
    }
`;

const gag = gql`
    mutation gag ($userName: String!, $quantum: String!) {
        gag (userName: $userName, quantum: $quantum) {
            userName,
        }
    }
`;

const { Item } = List;
const { Option } = Select;
const Operation = ({ item, select, gag, gagIt, speechControl }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select id="accountQuantumTime" size="small" value={speechControl.get('quantum')} style={{ width: 95, marginRight: 20 }} onChange={value => select({ value })}>
            <Option value="无">无</Option>
            <Option value="一天">一天</Option>
            <Option value="一个星期">一个星期</Option>
            <Option value="一个月">一个月</Option>
            <Option value="永久">永久</Option>
        </Select>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }} onClick={gagIt({ item, gag, speechControl })} role="presentation">
            禁言
        </div>
        { item.quantum === '无' ? '' : item.quantum }
    </div>
);
Operation.propTypes = {
    item: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    gag: PropTypes.func.isRequired,
    gagIt: PropTypes.func.isRequired,
    speechControl: ImmutablePropTypes.map.isRequired,
};

const Account = ({ data, speechControl, gag, gagIt, select }) => {
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    return (
        <div style={{ width: '600px', height: '500px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', overflowX: 'hidden' }}>
            <List
              itemLayout="horizontal"
              dataSource={data.user}
              renderItem={item => (
                <Item actions={[<Operation item={item} gag={gag} gagIt={gagIt} speechControl={speechControl} select={select} />]} style={{ width: '600px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7f7f7', marginTop: '10px', borderRadius: '4px' }}>
                    <Item.Meta
                      title={`${item.userName}   ${item.gender}   ${item.time}`}
                      description={item.content}
                      style={{ marginLeft: '10px' }}
                    />
                </Item>
            )}
            />
        </div>
    );
};

Account.propTypes = {
    data: PropTypes.object.isRequired,
    speechControl: ImmutablePropTypes.map.isRequired,
    gag: PropTypes.func.isRequired,
    gagIt: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    speechControl: state.get('speechControl'),
});

const mapDispatchToProps = dispatch => ({
    gagIt: ({ item, gag, speechControl }) => async () => {
        await gag({ variables: { userName: item.userName, quantum: speechControl.get('quantum') } });
        window.location.reload();
    },
    select: ({ value }) => dispatch({
        type: 'SPEECHCONTROL_CHANGE_QUANTUM',
        quantum: value,
    }),
});

const queryOptions = {
    options: props => ({
      variables: {
        userName: props.speechControl.get('right'),
  } }),
};

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(user, queryOptions), graphql(gag, { name: 'gag' }))(Account));
