import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseURL } from '../utils/baseURL';
import UseLogout from '../hooks/useLogout';

type Args = {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
};

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

const refreshAuthToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${baseURL}/user/recreateAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Unable to refresh token');
    }

    const data: TokenResponse = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
};

const customBaseQuery = fetchBaseQuery({ baseUrl: baseURL });

const customBaseQueryWithReauth: BaseQueryFn = async (
    args: Args,
    api,
    extraOptions
) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        args.headers = {
            ...args.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    let result = await customBaseQuery(args, api, extraOptions);

    if (result.error && 'status' in result.error && result.error.status === 401) {
        try {
            const newToken = await refreshAuthToken();
            args.headers = {
                ...args.headers,
                Authorization: `Bearer ${newToken}`,
            };
            result = await customBaseQuery(args, api, extraOptions);
        } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            UseLogout();
            window.location.href = '/login';
        }
    }

    return result;
};

export default customBaseQueryWithReauth;