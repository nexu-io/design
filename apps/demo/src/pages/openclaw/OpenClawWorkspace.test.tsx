// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OpenClawWorkspace from './OpenClawWorkspace';

vi.mock('../../hooks/useGitHubStars', () => ({
  useGitHubStars: () => ({ stars: 4200, repo: 'refly-ai/nexu' }),
}));

describe('OpenClawWorkspace bot manager panel', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('nexu_channel_connected', 'feishu');
    localStorage.setItem('nexu_welcome_last_shown', Date.now().toString());

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(cleanup);

  it('opens settings providers with anthropic selected from query params', () => {
    render(
      <MemoryRouter initialEntries={['/openclaw/workspace?view=settings&tab=providers&provider=anthropic']}>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getByText('设置')).toBeTruthy();
    expect(screen.getByRole('button', { name: /AI 模型服务商/i })).toBeTruthy();
    expect(screen.getAllByText('Anthropic').length).toBeGreaterThan(0);
    expect(screen.getByText('Claude 系列模型，擅长推理、编码和长文本理解')).toBeTruthy();
    expect(screen.getByDisplayValue('https://api.anthropic.com')).toBeTruthy();

    const modelListSection = screen.getByText(/模型列表/).parentElement;
    const enabledModelsSection = within(modelListSection as HTMLElement).getByText('已启用').closest('div')?.parentElement;
    const disabledModelsSection = within(modelListSection as HTMLElement).getByText('未启用').closest('div')?.parentElement;

    expect(enabledModelsSection).toBeTruthy();
    expect(disabledModelsSection).toBeTruthy();
    expect(within(enabledModelsSection as HTMLElement).getByText('暂无')).toBeTruthy();
    expect(within(disabledModelsSection as HTMLElement).getByText('Claude Opus 4.6')).toBeTruthy();
  });

  it('shows a login guide for nexu official provider', () => {
    render(
      <MemoryRouter initialEntries={['/openclaw/workspace?view=settings&tab=providers&provider=nexu']}>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('nexu 官方').length).toBeGreaterThan(0);
    expect(screen.getByText(/登录 nexu 账号后，即可直接使用官方无限量高级模型/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /登录 nexu 账号/i })).toBeTruthy();

    const modelListSection = screen.getByText(/模型列表/).parentElement;
    const enabledModelsSection = within(modelListSection as HTMLElement).getByText('已启用').closest('div')?.parentElement;
    const disabledModelsSection = within(modelListSection as HTMLElement).getByText('未启用').closest('div')?.parentElement;

    expect(enabledModelsSection).toBeTruthy();
    expect(disabledModelsSection).toBeTruthy();
    expect(within(enabledModelsSection as HTMLElement).getByText('暂无')).toBeTruthy();
    expect(within(disabledModelsSection as HTMLElement).getByText('Claude Opus 4.6')).toBeTruthy();
  });

  it('shows channel and model tabs inside the existing manager panel', () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /更改配置/i }));

    expect(screen.getByRole('button', { name: '渠道' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '模型 & Key' })).toBeTruthy();
    expect(screen.getByText('飞书 / Feishu')).toBeTruthy();
    expect(screen.getByText('Slack')).toBeTruthy();
    expect(screen.getByText('Discord')).toBeTruthy();
    expect(screen.queryByText('连接其他渠道')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '模型 & Key' }));
    expect(screen.getAllByText('Claude Opus 4.6').length).toBeGreaterThan(0);
  });

  it('hides the top stats cards after workspace is configured', () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Active channels')).toBeNull();
    expect(screen.queryByText('Total messages')).toBeNull();
    expect(screen.queryByText('Skills enabled')).toBeNull();
  });

  it('shows three compact action cards without the open workspace entry', () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Quick actions')).toBeNull();
    expect(screen.queryByText('Open 飞书')).toBeNull();
    expect(screen.getByText('View conversations')).toBeTruthy();
    expect(screen.getByText('Manage skills')).toBeTruthy();
    expect(screen.getByText('Star on GitHub')).toBeTruthy();
    expect(screen.getByText('Follow updates, code, and releases')).toBeTruthy();
    expect(screen.queryByText(/stars/i)).toBeNull();
    expect(screen.queryByText('Open source')).toBeNull();
    expect(screen.queryByText(/MIT/i)).toBeNull();
  });
});
