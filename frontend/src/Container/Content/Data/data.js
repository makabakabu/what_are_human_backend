import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import Comment from './comment';
import Review from './review';
import Account from './account';

const { Option } = Select;
const { RangePicker } = DatePicker;
const Data = ({ viewMode, selectType, selectRange }) => {
    const componentMap = {
        comment: Comment,
        review: Review,
        account: Account,
    };
    if (!viewMode) {
        viewMode = 'comment';
    }
    const ComponentName = componentMap[viewMode];
    return (
        <div style={{ height: '700px', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: '#6a6a6a' }} >
            <div style={{ height: '150px', width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '300px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Select defaultValue={viewMode} style={{ width: 120 }} onSelect={value => selectType({ value })}>
                        <Option value="comment">评论</Option>
                        <Option value="review">回复</Option>
                        <Option value="account">男女比例</Option>
                    </Select>
                </div>
                <div>
                    {
                        viewMode !== 'account' && <RangePicker placeholder={['开始日期', '结束日期']} onChange={dates => selectRange({ dates })} />
                    }
                </div>
            </div>
            <ComponentName />
        </div>
    );
};

Data.propTypes = {
    viewMode: PropTypes.string.isRequired,
    selectType: PropTypes.func.isRequired,
    selectRange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    viewMode: state.getIn(['data', 'viewMode']),
});

const mapDispatchToProps = dispatch => ({
    selectType: ({ value }) => dispatch({
        type: 'DATA_SELECT_VIEWMODE',
        viewMode: value,
    }),
    selectRange: ({ dates }) => dispatch({
        type: 'DATA_SELECT_RANGE',
        dates,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Data);
