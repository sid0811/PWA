import createApiClient from './Client';
import {API_ENDPOINTS} from '../constants/APIEndPoints';

/**
 * Get profile image data
 * @param userId - User ID
 * @param enteredUserName - User name
 * @returns Profile image data
 */
export const getImageData = async (userId: string, enteredUserName: string): Promise<any> => {
  const apiClient = await createApiClient();

  // PWA: Use x-custom- prefixed headers which proxy converts to actual header names
  const customHeaders = {
    'Content-Type': 'application/json',
    'x-custom-UserID': userId,
    'x-custom-UserName': enteredUserName,
  };

  const response = await apiClient.get<any>(
    API_ENDPOINTS.PROFILE_GET_IMAGE,
    {
      headers: customHeaders,
    }
  );

  return response.data;
};

/**
 * Post/upload profile image
 * @param userId - User ID
 * @param enteredUserName - User name
 * @param imageFile - Base64 encoded image data
 * @returns Response data
 */
export const postImageData = async (
  userId: string,
  enteredUserName: string,
  imageFile: string
): Promise<any> => {
  const apiClient = await createApiClient();

  const formData = {
    UserID: userId,
    UserName: enteredUserName,
    ImageByte: imageFile,
  };

  const response = await apiClient.post<any>(
    API_ENDPOINTS.PROFILE_POST_IMAGE,
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export default {
  getImageData,
  postImageData,
};
