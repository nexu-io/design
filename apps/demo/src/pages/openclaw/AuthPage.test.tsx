// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LocaleProvider } from '../../hooks/useLocale';
import AuthPage from './AuthPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('../../hooks/useGitHubStars', () => ({
  useGitHubStars: () => ({ stars: 4200, repo: 'refly-ai/nexu' }),
}));

describe('AuthPage', () => {
  it('reuses the same positioning rail as the welcome page', () => {
    window.localStorage.clear();
    window.localStorage.setItem('nexu_locale', 'zh');
    render(
      <LocaleProvider>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </LocaleProvider>,
    );

    expect(screen.getByRole('heading', { name: /Your mind,\s*extended\./i })).toBeTruthy();
    expect(screen.getByText('对 OpenClaw 做到真正开箱即用')).toBeTruthy();
    expect(screen.getByText('完美支持飞书的各种工具能力')).toBeTruthy();
    expect(screen.getByText('连接顶级模型与本地模型')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /简体中文/i }).length).toBeGreaterThan(0);
  });

  it('updates auth copy when switching language', () => {
    window.localStorage.clear();
    window.localStorage.setItem('nexu_locale', 'zh');
    render(
      <LocaleProvider>
        <MemoryRouter>
          <AuthPage />
        </MemoryRouter>
      </LocaleProvider>,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /简体中文/i })[0]);
    fireEvent.click(screen.getAllByRole('menuitem', { name: 'English' })[0]);

    expect(screen.getAllByText('Create account').length).toBeGreaterThan(0);
    expect(screen.getByText('Continue with Google')).toBeTruthy();
    expect(screen.getByText('Terms of Service')).toBeTruthy();
  });
});
