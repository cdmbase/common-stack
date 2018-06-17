import * as React from 'react';
import { renderRoutes } from 'react-router-config';
const Child = ({ route }) => (
    <div>
        <h2>Child</h2>
        {/* child routes won't render without this */}
        {renderRoutes(route.routes, { someProp: 'these extra props are optional' })}
    </div>
);

export default Child;
