import * as React from 'react';
import { Link } from 'react-router-dom';

interface MyProps {
  history?: any;
  children?: any;
  key?: any;
};

const Course: React.StatelessComponent<MyProps> = (props: MyProps) => {
  const from = "localhost:3000/"; 
  return (
  <div key={props.history.id}>
    <Link to={`${props.history.number}`} {...from}>{`Page: ${
        props.history.number
      }`}</Link>
  </div>
)};

export default Course;