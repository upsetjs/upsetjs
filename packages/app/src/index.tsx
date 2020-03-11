import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import UpSet from '@upsetjs/react';
import { extractSets } from '@upsetjs/model';

const data = [
  { name: 'Lisa', sets: ['School'] },
  { name: 'Bart', sets: ['School', 'Male'] },
  { name: 'Homer', sets: ['Duff Fan', 'Male'] },
  { name: 'Marge', sets: ['Blue Hair'] },
  { name: 'Maggie', sets: [] },
  { name: 'Barney', sets: ['Duff Fan', 'Male'] },
  { name: 'Mr. Burns', sets: ['Evil', 'Male'] },
  { name: 'Mo', sets: ['Duff Fan', 'Male'] },
  { name: 'Ned', sets: ['Male'] },
  { name: 'Milhouse', sets: ['School', 'Blue Hair', 'Male'] },
  { name: 'Grampa', sets: ['Male'] },
  { name: 'Krusty', sets: ['Duff Fan', 'Evil', 'Male'] },
  { name: 'Smithers', sets: ['Evil', 'Male'] },
  { name: 'Ralph', sets: ['School', 'Male'] },
  { name: 'Sideshow Bob', sets: ['Evil', 'Male'] },
  { name: 'Kent Brockman', sets: ['Male'] },
  { name: 'Fat Tony', sets: ['Evil', 'Male'] },
  { name: 'Jacqueline Bouvier ', sets: ['Blue Hair'] },
  { name: 'Patty Bouvier', sets: [] },
  { name: 'Selma Bouvier', sets: [] },
  { name: 'Lenny Leonard', sets: ['Duff Fan', 'Male'] },
  { name: 'Carl Carlson', sets: ['Duff Fan', 'Male'] },
  { name: 'Nelson', sets: ['School', 'Evil', 'Male'] },
  { name: 'Martin Prince', sets: ['School', 'Male'] },
];

const sets = extractSets(data);

function App() {
  return (
    <div>
      <Button color="primary">Hello World</Button>
      <UpSet sets={sets} width={1200} height={300} />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
