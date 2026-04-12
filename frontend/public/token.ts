
export const setToken = (newToken : string) =>{
    sessionStorage.setItem("token",newToken);
};
export const getToken = () => sessionStorage.getItem("token") ?? "";

export const removeToken = () => 
    sessionStorage.removeItem("token");
export const viderSessionStorage = () => sessionStorage.clear();