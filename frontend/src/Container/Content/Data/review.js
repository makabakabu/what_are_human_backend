import React from 'react';
import { connect } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

const reviewChart = gql`
    query reviewChart ($start: String!, $end: String!) {
        reviewChart (start: $start, end: $end) {
            date
            number
        }
    }
`;

const Review = ({ data }) => {
    if (data.loading) {
        return <Spinner name="ball-scale-ripple-multiple" color="coral" />;
    }
    const dataSource = data.reviewChart.map(value => ({ name: value.date, 回复: value.number }));
    return (
        <div style={{ width: '600px', height: '400px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center' }}>
            <LineChart
              width={600}
              height={300}
              data={dataSource}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="回复" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </div>
    );
};

Review.propTypes = {
    data: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    start: state.getIn(['data', 'start']),
    end: state.getIn(['data', 'end']),
});

const queryOptions = {
    options: ({ start, end }) => ({
        variables: {
            start,
            end,
        },
    }),
};

export default connect(mapStateToProps)(graphql(reviewChart, queryOptions)(Review));
