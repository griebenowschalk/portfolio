import useSWR from 'swr';
import apiClient from '../lib/api-client';
import type { EntityConfig } from '../config/types';

interface ApiResponse<T> {
  success: boolean;
  data: T[];
}

async function fetcher<T>(url: string): Promise<T[]> {
  const { data } = await apiClient.get<ApiResponse<T>>(url, {
    params: { limit: 100 },
  });
  return data.data || [];
}

export function useEntity<T>(config: EntityConfig<T>) {
  const { data, error, isLoading, mutate } = useSWR<T[], Error>(
    config.endpoints.list,
    () => fetcher<T>(config.endpoints.list),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    entities: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}