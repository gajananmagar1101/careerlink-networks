import { AxiosError, type AxiosAdapter } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../api/apiClient';

const unauthorized: AxiosAdapter = async (config) => {
  throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
    data: { message: 'Unauthorized' }, status: 401, statusText: 'Unauthorized', headers: {}, config
  });
};

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('API session handling', () => {
  it('rejects anonymous 401s without broadcasting a session logout', async () => {
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    await expect(apiClient.get('/api/jobs/search', { adapter: unauthorized })).rejects.toMatchObject({ status: 401 });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('clears an authenticated session and broadcasts logout on 401', async () => {
    localStorage.setItem('careerlink.token', 'test-token');
    localStorage.setItem('careerlink.user', '{}');
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    await expect(apiClient.get('/api/jobs/search', { adapter: unauthorized })).rejects.toMatchObject({ status: 401 });
    expect(localStorage.getItem('careerlink.token')).toBeNull();
    expect(localStorage.getItem('careerlink.user')).toBeNull();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'careerlink:unauthorized' }));
  });
});
