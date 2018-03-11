import React from 'react';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import PieceADay from './pieceADay';
import SystemNews from './systemNews';
import Revise from './revise';
import SpeechControl from './SpeechControl/speechControl';
import OpenTime from './openTime';

const { Option } = Select;
const OperationRecord = ({ params }) => {
    const componentMap = {
        pieceADay: PieceADay,
        systemNews: SystemNews,
        speechControl: SpeechControl,
        openTime: OpenTime,
        revise: Revise,
    };
    let selector = params.secondPath;
    let childSelector = params.thirdPath;
    if (!selector) {
        selector = 'pieceADay';
    } else if (!childSelector) {
            childSelector = 'comment';
        }
    const ComponentName = componentMap[selector];
    return (
        <div style={{ height: '700px', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: '#6a6a6a' }} >
            <div style={{ height: '150px', width: '600px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Select value={selector} style={{ width: 120 }} >
                    <Option value="pieceADay"><Link to="/operationRecord/pieceADay" href="/operationRecord/pieceADay" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>每日一条</div></Link></Option>
                    <Option value="systemNews"><Link to="/operationRecord/systemNews" href="/operationRecord/systemNews" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>系统消息</div></Link></Option>
                    <Option value="revise"><Link to="/operationRecord/revise" href="/operationRecord/revise" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>修订</div></Link></Option>
                    <Option value="speechControl"><Link to="/operationRecord/speechControl" href="/operationRecord/speechControl" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>言论控制</div></Link></Option>
                    <Option value="openTime"><Link to="/operationRecord/openTime" href="/operationRecord/openTime" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>开放时间</div></Link></Option>
                </Select>
                { selector === 'speechControl' && <Select defaultValue="comment" value={childSelector} style={{ width: 120 }} >
                        <Option value="comment"><Link to="/operationRecord/speechControl/comment" href="/operationRecord/speechControl/comment" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>评论</div></Link></Option>
                        <Option value="review"><Link to="/operationRecord/speechControl/review" href="/operationRecord/speechControl/review" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>回复</div></Link></Option>
                        <Option value="speech"><Link to="/operationRecord/speechControl/speech" href="/operationRecord/speechControl/speech" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>演讲</div></Link></Option>
                        <Option value="account"><Link to="/operationRecord/speechControl/account" href="/operationRecord/speechControl/account" style={{ color: '#6a6a6a' }}><div style={{ width: '120px' }}>账号</div></Link></Option>
                                                  </Select> }
            </div>
            <ComponentName params={params} />
        </div>
    );
};

OperationRecord.propTypes = {
    params: PropTypes.object.isRequired,
};

export default OperationRecord;
