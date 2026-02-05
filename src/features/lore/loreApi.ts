import { api } from '../../app/api';
import type { Lore, UpdateLoreContentPayload } from '../../types';
import type { CreateLorePayload } from './loreTypes';

export const loreApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLores: builder.query<Lore[], void>({
      query: () => '/lores',
    }),

    getLore: builder.query<Lore, string>({
      query: (id) => `/lores/${id}`,
    }),

    createLore: builder.mutation<Lore, CreateLorePayload>({
      query: (body) => ({
        url: '/lores',
        method: 'POST',
        body,
      }),
    }),

    updateLore: builder.mutation<
      Lore,
      { id: string; data: UpdateLoreContentPayload }
    >({
      query: ({ id, data }) => ({
        url: `/lores/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteLore: builder.mutation<void, string>({
      query: (id) => ({
        url: `/lores/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});
