import React from 'react';
import { Button } from 'reactstrap';
import { Route } from "react-router-dom";
import ContactModal from './ContactModal';
import './App.scss';

function App(props) {
  return (
    <div className="d-flex align-items-center justify-content-center App">
      <div className='d-flex align-items-center justify-content-center w-100'>
        <Button className='btn-a' onClick={() => props.history.push('modalA')}>Button A</Button>
      </div>
      <div className='d-flex align-items-center justify-content-center w-100'>
        <Button className='btn-b' onClick={() => props.history.push('modalB')}>Button B</Button>
      </div>
      <Route
        path={`/modalA`}
        render={() => {
          return (
            <ContactModal
              header='Modal A'
              history={props.history}
            />
          );
        }}
      />
      <Route
        path={`/modalB`}
        render={() => {
          return (
            <ContactModal
              header='Modal B'
              history={props.history}
            />
          );
        }}
      />
    </div >
  );
}

export default App;
