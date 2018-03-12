import React from 'react';
import { AutoComplete } from 'antd';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Spinner from 'react-spinkit';

const query = gql`
    query {
        allUsers{
            userName
            gender
        }
    }
`;

const createSystemNews = gql`
    mutation createSystemNews($userName: String!, $content: String!){
      createSystemNews(userName: $userName, content: $content){
        userName
        content
      }
    }
`;

const SystemNews = ({ data, systemNews, selectContent, createSystemNews, deleteContent, createContent }) => {
    if (data.loading) {
      return <Spinner name="ball-scale-ripple-multiple" color="coral" />;
    }
    const dataSource = ['全部用户'];
    data.allUsers.map(value => dataSource.push(value.userName));
    return (
      <div style={styles.main} >
        <div style={styles.header} >
          <div>
            <AutoComplete
              placeholder="全部用户"
              style={{ width: 200 }}
              dataSource={dataSource}
              value={systemNews.get('userName')}
              filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              onSelect={value => selectContent({ value })}
            />
          </div>
          <div style={{ width: '100px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={styles.option} onClick={deleteContent} role="presentation">
              <i className="fa fa-trash" style={{ transform: 'scale(1.8)', marginBottom: '5px' }} />
              <div>清空</div>
            </div>
            <div style={styles.option} onClick={createContent({ createSystemNews, userName: systemNews.get('userName') })} role="presentation">
              <i className="fa fa-send fa-1x" style={{ transform: 'scale(1.5)', marginBottom: '5px' }} />
              <div>发送</div>
            </div>
          </div>
        </div>
        <textarea
          id="systemNewsText"
          style={styles.textarea}
        />
      </div>
    );
};

SystemNews.propTypes = {
    data: PropTypes.object.isRequired,
    systemNews: ImmutablePropTypes.map.isRequired,
    selectContent: PropTypes.func.isRequired,
    createSystemNews: PropTypes.func.isRequired,
    deleteContent: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
};


const styles = {
  main: {
    height: '700px',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '12px',
    color: '#aaa',
  },
  header: {
    height: '150px',
    width: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  option: {
    width: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#6a6a6a',
  },
  textarea: {
    width: '600px',
    height: '400px',
    fontSize: '20px',
    borderRadius: '3px',
    borderColor: 'transparent',
    outline: 'none',
  },
};

const mapStateToProps = state => ({
      systemNews: state.get('systemNews'),
  });

const mapDispatchToProps = dispatch => ({
    selectContent: ({ value }) => {
        dispatch({
        type: 'SYSTEMNEWS_SELECT_USER',
        userName: value,
      });
    },
    createContent: ({ createSystemNews, userName }) => async () => {
        await createSystemNews({ variables: { userName, content: document.getElementById('systemNewsText').value } });
        window.location.reload();
    },
    deleteContent: () => {
        document.getElementById('systemNewsText').value = '';
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(compose(
    graphql(query),
    graphql(createSystemNews, {
        name: 'createSystemNews',
    }),
)(SystemNews));
