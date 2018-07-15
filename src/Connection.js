import React, { Component } from 'react';
import styled from 'styled-components';
import types from './connectionTypes';

const StyledConnection = styled.div`
  height: 2px;
  position: absolute;
  background: ${props =>
    props.type === types.CHILD
      ? 'rgba(50, 50, 100, .3)'
      : 'rgba(200, 50, 50, .3)'};
  width: ${props => Math.floor(props.dist)}px;
  top: ${props => Math.floor(props.yMid)}px;
  left: ${props => Math.floor(props.xMid - props.dist / 2)}px;
  transform: rotate(${props => Math.floor(props.slopeInDegrees)}deg);
`;

const Connection = ({ fromX = 0, fromY = 0, toX = 0, toY = 0, type }) => {
  const dist = Math.sqrt(
    (fromX - toX) * (fromX - toX) + (fromY - toY) * (fromY - toY)
  );
  const xMid = (fromX + toX) / 2;
  const yMid = (fromY + toY) / 2;

  const slopeInRadian = Math.atan2(fromY - toY, fromX - toX);
  const slopeInDegrees = slopeInRadian * 180 / Math.PI;

  return (
    <StyledConnection
      dist={dist}
      yMid={yMid}
      xMid={xMid}
      slopeInDegrees={slopeInDegrees}
      type={type}
    />
  );
};

export default Connection;
