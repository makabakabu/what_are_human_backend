import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { PieChart, Pie, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

const allUsers = gql`
    query allUsers {
        allUsers {
            gender
        }
    }
`;

const Account = ({ data }) => {
    if (data.loading) {
        return (<div>loading...</div>);
    }
    let female = 0;
    let male = 0;
    data.allUsers.forEach((value) => {
        if (value.gender === 'female') {
            female += 1;
        } else {
            male += 1;
        }
    });
    const pie = [{ name: '男', value: male }, { name: '女', value: female }];
    return (
        <div style={{ width: '600px', height: '400px', display: 'flex', justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center' }}>
            <PieChart width={600} height={400}>
                <Pie isAnimationActive data={pie} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="value" label />
                <Tooltip />
            </PieChart>
        </div>
    );
};

Account.propTypes = {
    data: PropTypes.object.isRequired,
};

export default graphql(allUsers)(Account);
