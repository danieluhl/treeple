import './App.css';
import React, { Component, Fragment } from 'react';
import Connection from './Connection';
import styled from 'styled-components';

const getPlaceholderImage = () => {
  // number between 1 and 1084
  const num = Math.floor(Math.random() * 100) + 1;
  return `https://picsum.photos/200/200?image=${num}`;
};

const StyledPerson = styled.div`
  height: 200px;
  width: 200px;
  display: inline-block;
`;

class Person extends Component {
  state = {
    x: 0,
    y: 0
  };
  render() {
    const {
      imageUrl = getPlaceholderImage(),
      first,
      last
    } = this.props.personInfo;
    const { connections } = this.props;
    const { x: fromX, y: fromY } = this.state;

    return (
      <Fragment>
        <StyledPerson>
          <p>
            {first} {last}
          </p>
          <img src={imageUrl} />
        </StyledPerson>
        {connections &&
          connections.map(connection =>
            connection.to.map(con => (
              <Connection
                key={`${connection.id}_${con.id}`}
                id={connection.id}
                fromX={fromX}
                fromY={fromY}
                toX={con.x}
                toY={con.y}
                type={con.type}
              />
            ))
          )}
      </Fragment>
    );
  }
}

export default Person;
