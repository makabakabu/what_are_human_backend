import React from 'react';
import moment from 'moment';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { TimePicker, DatePicker, List } from 'antd';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const query = gql`
    query {
        openTime{
            date
            start
            end
        }
    }
`;
const createOpenTime = gql`
    mutation CreateOpenTime($date: String!, $start: String!, $end: String! ){
        createOpenTime(date: $date, start: $start, end: $end){
            date
            start
            end
        }
    }
`;

const removeOpenTime = gql`
    mutation removeOpenTime($date: String!, $start: String!, $end: String! ){
        removeOpenTime(date: $date, start: $start, end: $end){
            date
            start
            end
        }
    }
`;

const { Item } = List;
const Cancel = ({ item, remove, removeOpenTime }) => (
    <div style={styles.cancel} onClick={remove({ item, removeOpenTime })} role="presentation">删除</div>
);

Cancel.propTypes = {
    item: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeOpenTime: PropTypes.func.isRequired,
};

const OpenTime = ({ openTime, data, dataPicker, timePicker, createOpenTimeFunc, createOpenTime, remove, removeOpenTime }) => {
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    const temp = [];
    console.log(data.openTime);
    data.openTime.map(value => temp.splice(0, 0, value));
    return (
        <div style={{ height: '700px', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: '#6a6a6a' }} >
            <div style={{ height: '150px', width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <DatePicker placeholder="日期" defaultValue={moment()} value={moment(openTime.get('date'), 'YYYY-MM-DD')} onChange={date => dataPicker({ date })} />
                </div>
                <div>
                    <TimePicker placeholder="开始" defaultValue={moment('20:00', 'HH:mm')} value={moment(openTime.get('start'), 'HH:mm')} onChange={value => timePicker({ value, kind: 'start' })} />
                </div>
                <div>
                    <TimePicker placeholder="结束" defaultValue={moment('21:00', 'HH:mm')} value={moment(openTime.get('end'), 'HH:mm')} onChange={value => timePicker({ value, kind: 'end' })} />
                </div>
                <div style={{ width: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'green', backgroundColor: 'transparent', border: 'none' }} onClick={createOpenTimeFunc({ openTime, createOpenTime })} role="presentation">
                    <i className="fa fa-check fa-2x" />
                    <div>确定</div>
                </div>
            </div>
            <div style={{ width: '600px', height: '500px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', overflowX: 'hidden' }}>
                <List
                  itemLayout="horizontal"
                  dataSource={temp}
                  split
                  renderItem={item => (
                    <Item actions={[<Cancel item={item} remove={remove} removeOpenTime={removeOpenTime} />]} style={{ width: '580px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f7f7f7', marginBottom: '10px', borderRadius: '4px' }}>
                        <Item.Meta
                          title={<a href="https://ant.design">{ item.date }</a>}
                          description={`${item.start}  ~  ${item.end}`}
                          style={{ marginLeft: '10px' }}
                        />
                    </Item>
                )}
                />
            </div>
        </div>
    );
};

OpenTime.propTypes = {
    openTime: ImmutablePropTypes.map.isRequired,
    data: PropTypes.object.isRequired,
    dataPicker: PropTypes.func.isRequired,
    timePicker: PropTypes.func.isRequired,
    createOpenTimeFunc: PropTypes.func.isRequired,
    createOpenTime: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    removeOpenTime: PropTypes.func.isRequired,
};

const styles = {
    cancel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '10px',
        color: '#46cff2',
    },
};

const mapStateToProps = state => ({
    openTime: state.get('openTime'),
});

const mapDispatchToProps = dispatch => ({
    dataPicker: ({ date }) => {
        dispatch({
            type: 'OPENTIME_SELECT_DATE',
            date: date.format('YYYY-MM-DD'),
        });
    },
    timePicker: ({ value, kind }) => {
        dispatch({
            type: 'OPENTIME_SELECT_TIME',
            kind,
            time: value.format('HH:mm'),
        });
    },
    createOpenTimeFunc: ({ openTime, createOpenTime }) => async () => {
        await createOpenTime({ variables: { date: openTime.get('date'), start: openTime.get('start'), end: openTime.get('end') } });
        window.location.reload();
    },
    remove: ({ item, removeOpenTime }) => async () => {
        await removeOpenTime({ variables: { date: item.date, start: item.start, end: item.end } });
        window.location.reload();
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(compose(
    graphql(query),
    graphql(createOpenTime, {
        name: 'createOpenTime',
    }),
    graphql(removeOpenTime, {
        name: 'removeOpenTime',
    }),
)(OpenTime));
