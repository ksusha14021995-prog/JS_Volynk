import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar.jsx';

const chats = [
  {
    id: 'c1',
    title: 'React Optimization',
    messages: [{ id: 'm1', role: 'user', content: 'hello world' }],
    updatedAt: Date.now(),
  },
  {
    id: 'c2',
    title: 'Python algorithms',
    messages: [{ id: 'm2', role: 'user', content: 'binary search' }],
    updatedAt: Date.now(),
  },
  {
    id: 'c3',
    title: 'Diploma ideas',
    messages: [],
    updatedAt: Date.now(),
  },
];

function renderSidebar(props = {}) {
  return render(
    <Sidebar
      chats={chats}
      activeChatId="c1"
      onSelectChat={() => {}}
      onCreateChat={() => {}}
      onDeleteChat={() => {}}
      onRenameChat={() => {}}
      {...props}
    />
  );
}

describe('Sidebar', () => {
  test('при пустом поиске показаны все чаты', () => {
    renderSidebar();
    expect(screen.getByText('React Optimization')).toBeInTheDocument();
    expect(screen.getByText('Python algorithms')).toBeInTheDocument();
    expect(screen.getByText('Diploma ideas')).toBeInTheDocument();
  });

  test('поиск фильтрует по названию', () => {
    renderSidebar();
    const search = screen.getByPlaceholderText(/поиск по чатам/i);
    fireEvent.change(search, { target: { value: 'react' } });
    expect(screen.getByText('React Optimization')).toBeInTheDocument();
    expect(screen.queryByText('Python algorithms')).toBeNull();
    expect(screen.queryByText('Diploma ideas')).toBeNull();
  });

  test('поиск находит по содержимому последнего сообщения', () => {
    renderSidebar();
    const search = screen.getByPlaceholderText(/поиск по чатам/i);
    fireEvent.change(search, { target: { value: 'binary' } });
    expect(screen.queryByText('React Optimization')).toBeNull();
    expect(screen.getByText('Python algorithms')).toBeInTheDocument();
  });

  test('Удалить → confirm OK → onDeleteChat вызывается', () => {
    const onDeleteChat = jest.fn();
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    renderSidebar({ onDeleteChat });
    // мы рендерим Sidebar напрямую, и его confirm проверяется не здесь —
    // delete-кнопка вызывает onDelete=> onDeleteChat(id). Confirm в AppLayout.
    const deleteBtns = screen.getAllByRole('button', { name: /удалить/i });
    fireEvent.click(deleteBtns[0]);
    expect(onDeleteChat).toHaveBeenCalledWith('c1');
    confirmSpy.mockRestore();
  });
});
