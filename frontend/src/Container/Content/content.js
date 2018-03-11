import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import PieceADay from './pieceADay';
import SystemNews from './systemNews';
import Revise from './revise';
import SpeechControl from './SpeechControl/speechControl';
import OpenTime from './openTime';
import OperationRecord from './OperationRecord/operationRecord';
import Data from './Data/data';

const Content = ({ params }) => {
  const componentMap = {
    pieceADay: PieceADay,
    systemNews: SystemNews,
    revise: Revise,
    speechControl: SpeechControl,
    openTime: OpenTime,
    operationRecord: OperationRecord,
    data: Data,
  };
  const { view } = params;
  const ComponentName = componentMap[view];
  return (
    <Route>
      <ComponentName params={params} />
    </Route>
  );
};
Content.propTypes = {
    params: PropTypes.object.isRequired,
};

export default Content;
