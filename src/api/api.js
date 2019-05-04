import axios from 'axios';

let base = '';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };



export const getUserListPage = params => { return axios.get(`${base}/user/listUser`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

//用户界面
export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/editUserBySelect`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/addUser`, { params: params }); };
//文章界面
// export const addNews = params => { return axios.get(`${base}/news/addNews`, { params: params }); };
export const getNewsList = params => { return axios.get(`${base}/news/getNewsList`, { params: params }); };
export const editNews = params => { return axios.get(`${base}/news/editNewsById`, { params: params }); };
export const removeNews  = params => { return axios.get(`${base}/news/deleteNews`, { params: params }); };
export const batchRemoveNews  = params => { return axios.get(`${base}/news/batchDeleteNews`, { params: params }); };
export const getNewsDetail  = params => { return axios.get(`${base}/news/getNews`, { params: params }); };

//视频列表
export const getVideoList = params => { return axios.get(`${base}/video/listVideo`, { params: params }); };
export const removeVideo  = params => { return axios.get(`${base}/video/deleteVideo`, { params: params }); };
export const batchRemoveVideo  = params => { return axios.get(`${base}/video/batchDeleteVideo`, { params: params }); };

//积分列表
export const getUserScoreList = params =>{return axios.get(`${base}/score/getUserScoreList`,{ params: params });};
