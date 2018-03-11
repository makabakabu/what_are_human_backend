import React from 'react';
import {
  Link,
  Route,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';

const LinkComponent = ({ id, view, panelNameMap }) => <div style={{ ...styles.item, backgroundColor: view === id ? '#ededed' : '#6a6a6a', color: view === id ? '#6a6a6a' : '#ededed' }}>{ panelNameMap[id] }</div>;

LinkComponent.propTypes = {
    id: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    panelNameMap: PropTypes.object.isRequired,
};

const LeftPanel = ({ params }) => {
  const panelNameMap = {
    pieceADay: '每日一条',
    systemNews: '系统消息',
    revise: '修订',
    speechControl: '言论控制',
    openTime: '开放时间',
    operationRecord: '操作记录',
    data: '数据图表',
  };
  const { view } = params;
  return (
    <Route>
      <div style={styles.main}>
        <Link to="/pieceADay" style={styles.link} href="/pieceADay">{ <LinkComponent id="pieceADay" view={view} panelNameMap={panelNameMap} /> }</Link>
        <Link to="/systemNews" style={styles.link} href="/systemNews">{ <LinkComponent id="systemNews" view={view} panelNameMap={panelNameMap} /> }</Link>
        <Link to="/revise" style={styles.link} href="/revise">{ <LinkComponent id="revise" view={view} panelNameMap={panelNameMap} /> }</Link>
        <Link to="/speechControl" style={styles.link} href="/speechControl">{ <LinkComponent id="speechControl" view={view} panelNameMap={panelNameMap} /> }</Link>
        <Link to="/openTime" style={styles.link} href="/openTime">{ <LinkComponent id="openTime" view={view} panelNameMap={panelNameMap} /> }</Link>
        <Link to="/operationRecord" style={styles.link} href="/operationRecord">{ <LinkComponent id="operationRecord" view={view} panelNameMap={panelNameMap} /> }</Link>
        <Link to="/data" style={styles.link} href="/data">{ <LinkComponent id="data" view={view} panelNameMap={panelNameMap} /> }</Link>
      </div>
    </Route>
  );
};

LeftPanel.propTypes = {
    params: PropTypes.object.isRequired,
};

let styles = {
    main: {
        width: '20%',
        height: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        textDecoration: 'none',
    },
    item: {
        width: '200px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ededed',
        backgroundColor: '#6a6a6a',
        transition: 'all 0.4s ease-out',
        cursor: 'pointer',
    },
};
export default withRouter(LeftPanel);
