import React, { Component } from 'react';
import Person from './Person';
import './App.css';
import connectionTypes from './connectionTypes';

const GRID_SPACING = 250;

const connections = [
  {
    id: 1,
    from: { id: 1 },
    to: [
      { id: 2, x: 400, y: 400, type: connectionTypes.CHILD },
      { id: 3, x: 400, y: 400, type: connectionTypes.CHILD },
      { id: 4, x: 400, y: 400, type: connectionTypes.CHILD },
      { id: 5, x: 200, y: 200, type: connectionTypes.LOVER }
    ]
  },
  {
    id: 2,
    from: { id: 5 },
    to: [
      { id: 2, x: 400, y: 400, type: connectionTypes.CHILD },
      { id: 3, x: 400, y: 400, type: connectionTypes.CHILD },
      { id: 4, x: 400, y: 400, type: connectionTypes.CHILD }
    ]
  },
  {
    id: 3,
    root: true,
    from: { id: 6 },
    to: [{ id: 1, x: 400, y: 400, type: connectionTypes.CHILD }]
  }
];

const family = [
  {
    id: 6,
    first: 'Bill',
    last: 'Uhl'
  },
  {
    id: 1,
    first: 'Curtis',
    last: 'Uhl'
  },
  {
    id: 2,
    first: 'Daniel',
    last: 'Uhl'
  },
  {
    id: 3,
    first: 'David',
    last: 'Uhl'
  },
  {
    id: 4,
    first: 'Kendra',
    last: 'Uhl'
  },
  {
    id: 5,
    first: 'Lisa',
    last: 'Uhl'
  }
];

class App extends Component {
  state = {
    family,
    connections
  };
  componentDidMount() {
    this.setAllCoordinates();
  }
  updatePersonCoordinates = ({ id: personId, x, y }) => {
    personId = parseInt(personId, 10);
    this.setState(({ family, connections }) => {
      const newConnections = [...connections];
      // update anything going from or to any of this persons connections
      newConnections.forEach(connection => {
        if (connection.from.id === personId) {
          connection.from = { ...connection.from, x, y };
        } else {
          // loop over all possible to ids
          connection.to = connection.to.map(con => {
            if (con.id === personId) {
              con = { ...con, x, y };
            }
            return con;
          });
        }
      });
      return { family, connections: newConnections };
    });
  };

  // setAllCoordinates = () => {
  //   // array of children and lovers
  //   const getConnections = (person, connections) =>
  //     connections.find(con => con.from.id === person.id);

  //   const addCoordinates = (person, connections, family, location) => {
  //     person.location = person.location || location;

  //     const personConnections = getConnections(person, connections, family);
  //     // if no connections and has a location, do nothing
  //     if (!personConnections) {
  //       return;
  //     }
  //     const children = personConnections.to.map(({ id, type }) =>
  //       family.find(
  //         person => person.id === id && type === connectionTypes.CHILD
  //       )
  //     ).filter(Boolean);
  //     const lovers = personConnections.to.map(({ id, type }) =>
  //       family.find(
  //         person => person.id === id && type === connectionTypes.LOVER
  //       )
  //     ).filter(Boolean);

  //     lovers.forEach(lover => {
  //       addCoordinates(lover, connections, family, { ...location, x: (location.x + 1) * GRID_SPACING });
  //     });
  //     children.forEach(child => {
  //       addCoordinates(child, connections, family, { ...location, y: (location.y + 1) * GRID_SPACING });
  //     });
  //   };

  //   this.setState(
  //     prevState => {
  //       // root must be manually defined in the data
  //       const newFamily = [...prevState.family];
  //       const roots = newFamily.filter(person => person.root);
  //       const location = { x: 0, y: 0 };

  //       // mutating the tree heavily here
  //       roots.forEach(person =>
  //         addCoordinates(person, prevState.connections, newFamily, location)
  //       );
  //       return { family: newFamily };
  //     },
  //     () => {
  //       console.log(this.state);
  //     }
  //   );
  // };

  setAllCoordinates = () => {
    this.setState(
      prevState => {
        // root must be manually defined in the data
        const newConnections = [...prevState.connections];

        const roots = newConnections.filter(con => con.root);

        const setAllToConnections = (fromId, { x, y }) => {
          // set any tos
          newConnections.forEach(connection => {
            // loop over all possible to ids
            connection.to = connection.to.map(con => {
              if (con.id === fromId) {
                con = { ...con, x, y };
              }
              return con;
            });
          });
        };

        const addConnections = (node, { x, y }) => {
          // if we're already set, don't set again
          if (!node) {
            return;
          }
          // set the from
          if (!node.from.x) {
            node.from = { ...node.from, x, y };
          }
          setAllToConnections(node.from.id, { x, y });

          const children = node.to.filter(
            ({ type }) => type === connectionTypes.CHILD
          );
          const lovers = node.to.filter(
            ({ type }) => type === connectionTypes.LOVER
          );

          lovers.forEach((lover, i) => {
            addConnections(
              newConnections.find(con => con.from.id === lover.id),
              { x: x + i * GRID_SPACING, y }
            );
            setAllToConnections(lover.id, { x: x + i * GRID_SPACING, y });
          });
          children.forEach((child, i) => {
            addConnections(
              newConnections.find(con => con.from.id === child.id),
              { x, y: y + i * GRID_SPACING }
            );
            setAllToConnections(child.id, { x, y: y + i * GRID_SPACING });
          });
        };

        roots.forEach((root, i) => {
          addConnections(root, { x: i * GRID_SPACING, y: 0 });
        });

        return { connections: newConnections };
      },
      () => {
        console.log(this.state.connections);
      }
    );
  };

  render() {
    return (
      <div className="App">
        {this.state.family.map(person => {
          return (
            <Person
              key={person.id}
              id={person.id}
              updatePersonCoordinates={this.updatePersonCoordinates}
              personInfo={person}
              connections={this.state.connections.filter(
                con => con.from.id === person.id
              )}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
