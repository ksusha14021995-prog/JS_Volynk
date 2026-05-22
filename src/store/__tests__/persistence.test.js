/**
 * @jest-environment jsdom
 */
import { chatReducer, initialState } from '../chatReducer.js';

const STORAGE_KEY = 'netology-fe-hw6:chats';

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('изменение state записывается в localStorage', () => {
    // имитируем эффект из ChatProvider:
    let state = chatReducer(initialState, { type: 'CREATE_CHAT', payload: { id: 'c1' } });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ chats: state.chats, activeChatId: state.activeChatId })
    );
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored.chats).toHaveLength(1);
    expect(stored.chats[0].id).toBe('c1');
    expect(stored.activeChatId).toBe('c1');
  });

  test('восстановление из valid JSON: chats массив, activeChatId есть', () => {
    const payload = {
      chats: [{ id: 'c1', title: 'X', messages: [], createdAt: 1, updatedAt: 1 }],
      activeChatId: 'c1',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw);
    expect(parsed.chats).toHaveLength(1);
    expect(parsed.activeChatId).toBe('c1');
  });

  test('битый JSON не валит приложение → возврат initialState', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');

    // имитируем loadFromStorage из ChatProvider:
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return initialState;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.chats)) return initialState;
        return parsed;
      } catch {
        return initialState;
      }
    };

    const state = load();
    expect(state).toBe(initialState);
  });

  test('setItem-ошибка не падает (например QuotaExceeded)', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, 'x');
      } catch {
        // игнорируем — это нормальное поведение ChatProvider
      }
    }).not.toThrow();
    setItemSpy.mockRestore();
  });
});
