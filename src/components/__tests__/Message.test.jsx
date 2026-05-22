import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="md">{children}</div>,
}));
jest.mock('rehype-highlight', () => ({ __esModule: true, default: () => () => {} }));

// eslint-disable-next-line import/first
import Message from '../Message.jsx';

describe('Message', () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });
  beforeEach(() => {
    navigator.clipboard.writeText.mockClear();
  });

  test('variant=user — нет кнопки Копировать', () => {
    render(<Message variant="user" content="Привет" sender="Вы" />);
    expect(screen.queryByRole('button', { name: /копировать/i })).toBeNull();
  });

  test('variant=assistant — есть кнопка, клик вызывает clipboard', async () => {
    render(<Message variant="assistant" content="Ответ" sender="GigaChat" />);
    const btn = screen.getByRole('button', { name: /копировать/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Ответ');
    await waitFor(() => {
      expect(screen.getByText(/скопировано/i)).toBeInTheDocument();
    });
  });
});
