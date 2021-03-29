import * as React from 'react';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getByText, render, screen, waitFor } from '@testing-library/react';
import { IRoute } from '../interfaces/new-router';
import { renderRoutes2 as renderRoutes } from './render-routes'; 


function TestInitialProps({ foo }: { foo: string }) {
    return <h1 data-testid="test">{foo}</h1>;
}

let mountCount = 0;
function TestInitialPropsWithoutUnmount({ foo }: {foo: string }) {
    React.useEffect(() => {
        return () => {
            mountCount++;
        }
    }, []);
    return (
        <div>
            <h1 data-testid="test2">{foo}</h1>
            <a href="#bar">link-bar</a>
            <Link to="/get-initial-props">change-route</Link>
            <h2 id="bar">h2-bar</h2>
        </div>
    )
}

