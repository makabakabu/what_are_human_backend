import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { List } from 'antd';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const query = gql`
    query {
        openTime{
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
const Cancel = ({ item, remove, removeOpenTime }) => (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }} onClick={remove({ item, removeOpenTime })} role="presentation">删除</div>);

Cancel.propTypes = {
    item: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeOpenTime: PropTypes.func.isRequired,
};

const OpenTime = ({ data, remove, removeOpenTime }) => {
    if (data.loading) {
        return (<div>Loading...</div>);
    }
    const temp = [];
    data.openTime.map(value => temp.splice(0, 0, value));
    return (
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
    );
};

OpenTime.propTypes = {
    data: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired,
    removeOpenTime: PropTypes.func.isRequired,
};

const mapDispatchToProps = () => ({
    remove: ({ item, removeOpenTime }) => async () => {
        await removeOpenTime({ variables: { date: item.date, start: item.start, end: item.end } });
        window.location.reload();
    },
});

export default connect(null, mapDispatchToProps)(compose(
    graphql(query),
    graphql(removeOpenTime, {
        name: 'removeOpenTime',
    }),
)(OpenTime));
