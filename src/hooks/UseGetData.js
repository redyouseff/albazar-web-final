import BaseUrl from "../api/BaseUrl";

const useGetData = async (url, params) => {
  try {
    const response = await BaseUrl.get(url, { params });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const useGetDataWithToken = async (url, params) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params,
    };

    const response = await BaseUrl.get(url, config);
    return response;
  } catch (error) {
    console.error('Error fetching data with token:', error);
    throw error;
  }
};

export { useGetData, useGetDataWithToken };   




