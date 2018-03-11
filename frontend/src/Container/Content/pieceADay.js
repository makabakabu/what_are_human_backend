import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import uuidv4 from 'uuid';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const pieceADayData = gql`
    query PieceADay($order: Int!){
        pieceADay(order: $order){
            order
            content
        }
    }
`;

const updatePieceADay = gql`
    mutation updatePieceADay($order: Int!, $content: String!, $date: String! ){
        updatePieceADay(order: $order, content: $content, date: $date){
            order
            content
        }
    }
`;

const PieceADay = ({ data, pieceADay, dataPicker, piece, update, deleteContent, textArea, updatePieceADay }) => {
    if (data.loading) {
        return (<div>loading...</div>);
    }
    return (
        <div style={styles.main} >
            <div style={styles.panel}>
                <div style={styles.leftPanel}>
                    <DatePicker placeholder="日期" defaultValue={moment(pieceADay.get('date'), 'YYYY-MM-DD')} onChange={date => dataPicker({ date })} />
                    <InputNumber placeholder="次序" min={1} defaultValue={pieceADay.get('order')} value={pieceADay.get('order')} onChange={num => piece({ num })} />
                </div>
                <div style={styles.rightPanel}>
                    <div style={styles.rightPanleItem} onClick={deleteContent} role="presentation">
                        <i className="fa fa-trash" style={{ transform: 'scale(1.8)', marginBottom: '5px' }} />
                        <div>清空</div>
                    </div>
                    <div style={styles.rightPanleItem} onClick={update({ pieceADay, updatePieceADay })} role="presentation">
                        <i className="fa fa-send fa-1x" style={{ transform: 'scale(1.5)', marginBottom: '5px' }} />
                        <div>发送</div>
                    </div>
                </div>
            </div>
            <div style={styles.content}>
                <textarea
                  id="pieceADayText"
                  style={styles.textArea}
                  key={uuidv4()}
                  defaultValue={data.pieceADay.length === 0 ? '' : data.pieceADay[0].content}
                  onChange={event => textArea({ event })}
                />
                <div id="pieceADayNum" style={{ marginTop: '20px', fontSize: '18px' }}>{ `字数:  ${data.pieceADay.length === 0 ? 0 : data.pieceADay[0].content.length}` }</div>
            </div>
        </div>
    );
};

PieceADay.propTypes = {
    data: PropTypes.object.isRequired,
    pieceADay: ImmutablePropTypes.map.isRequired,
    dataPicker: PropTypes.func.isRequired,
    piece: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    deleteContent: PropTypes.func.isRequired,
    textArea: PropTypes.func.isRequired,
    updatePieceADay: PropTypes.func.isRequired,
};

const styles = {
    main: {
        height: '700px',
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '12px', color: '#6a6a6a',
    },
    panel: {
        height: '150px',
        width: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftPanel: {
        width: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rightPanel: {
        width: '100px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    rightPanleItem: {
        width: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textArea: {
        width: '600px',
        height: '400px',
        fontSize: '20px',
        borderRadius: '3px',
        borderColor: 'transparent',
    },
};

const mapStateToProps = state => ({
    pieceADay: state.get('pieceADay'),
});

const mapDispatchToProps = dispatch => ({
    dataPicker: ({ date }) => {
        dispatch({
            type: 'PIECEADAY_SELECT_DATE',
            date: date.format('YYYY-MM-DD'),
        });
    },
    piece: async ({ num }) => {
        dispatch({
            type: 'PIECEADAY_CHANGE_ORDER',
            order: num,
        });
    },
    update: ({ pieceADay, updatePieceADay }) => async () => {
        await updatePieceADay({ variables: { order: pieceADay.get('order'), content: document.getElementById('pieceADayText').value, date: pieceADay.get('date') } });
        window.location.reload();
    },
    deleteContent: () => {
        document.getElementById('pieceADayText').value = '';
        document.getElementById('pieceADayNum').innerText = '字数:   0';
    },
    textArea: ({ event }) => {
        document.getElementById('pieceADayNum').innerText = `字数:  ${event.target.value.length}`;
    },
});

const queryOptions = {
    options: props => ({
        variables: {
            order: props.pieceADay.get('order'),
        },
    }),
};

export default connect(mapStateToProps, mapDispatchToProps)(compose(graphql(pieceADayData, queryOptions), graphql(updatePieceADay, {
    name: 'updatePieceADay',
}))(PieceADay));
