import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import InputArea from '../InputArea.jsx';

describe('InputArea', () => {
  test('кнопка Отправить disabled при пустом вводе', () => {
    render(<InputArea onSend={() => {}} />);
    expect(screen.getByRole('button', { name: /отправить/i })).toBeDisabled();
  });

  test('кнопка Отправить disabled при пробелах', () => {
    render(<InputArea onSend={() => {}} />);
    const textarea = screen.getByPlaceholderText(/напишите сообщение/i);
    fireEvent.change(textarea, { target: { value: '   \n  ' } });
    expect(screen.getByRole('button', { name: /отправить/i })).toBeDisabled();
  });

  test('клик на Отправить вызывает onSend с текстом', () => {
    const onSend = jest.fn();
    render(<InputArea onSend={onSend} />);
    const textarea = screen.getByPlaceholderText(/напишите сообщение/i);
    fireEvent.change(textarea, { target: { value: 'привет' } });
    fireEvent.click(screen.getByRole('button', { name: /отправить/i }));
    expect(onSend).toHaveBeenCalledWith('привет');
  });

  test('Enter с непустым вводом вызывает onSend', () => {
    const onSend = jest.fn();
    render(<InputArea onSend={onSend} />);
    const textarea = screen.getByPlaceholderText(/напишите сообщение/i);
    fireEvent.change(textarea, { target: { value: 'привет' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(onSend).toHaveBeenCalledWith('привет');
  });

  test('Shift+Enter НЕ отправляет', () => {
    const onSend = jest.fn();
    render(<InputArea onSend={onSend} />);
    const textarea = screen.getByPlaceholderText(/напишите сообщение/i);
    fireEvent.change(textarea, { target: { value: 'привет' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  test('isLoading=true показывает Стоп вместо Отправить', () => {
    const onStop = jest.fn();
    render(<InputArea onSend={() => {}} onStop={onStop} isLoading={true} />);
    const stopBtn = screen.getByRole('button', { name: /стоп/i });
    expect(stopBtn).toBeInTheDocument();
    fireEvent.click(stopBtn);
    expect(onStop).toHaveBeenCalled();
  });
});
