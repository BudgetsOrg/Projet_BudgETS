
export const setToken = (newToken : string) =>{
    localStorage.setItem("token",newToken);
};
export const getToken = () => localStorage.getItem("token") ?? "";

export const removeToken = () => 
    localStorage.removeItem("token");