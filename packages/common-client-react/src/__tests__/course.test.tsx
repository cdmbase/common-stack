import * as React from 'react';
import { shallow } from 'enzyme';
import Course from '../connector/course';

describe('Test on Course component', () => {
    const props = {
        history: jest.fn()
    };
    it('should render Link component', () => {
        const wrapper = shallow(<Course {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});