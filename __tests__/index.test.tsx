import { render } from '@testing-library/react-native';
import Index from '../app/index';

describe('Index screen', () => {
  it('renders heading', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Morning Check-In')).toBeTruthy();
  });
});
