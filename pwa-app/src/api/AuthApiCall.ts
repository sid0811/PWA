import createAuthApiClient from './Auth';

export const postAuthApi = async (headers: any) => {
  const apiClient = await createAuthApiClient();
  const response = await apiClient.post('', null, {
    headers,
  });
  return response;
};

export default {postAuthApi};
