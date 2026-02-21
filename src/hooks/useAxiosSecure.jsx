// import axios from "axios";
// import { useContext, useEffect } from "react";
// import { AuthContext } from "../provider/AuthProvider";

// const useAxiosSecure = () => {
//   const { user } = useContext(AuthContext);

//   const axiosSecure = axios.create({
//     baseURL: "http://localhost:5000",
//   });

//   useEffect(() => {
//     const reqInterceptor = axiosSecure.interceptors.request.use(
//       (config) => {
//         if (user?.accessToken) {
//           config.headers.Authorization = `Bearer ${user.accessToken}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     const resInterceptor = axiosSecure.interceptors.response.use(
//       (res) => res,
//       (err) => Promise.reject(err)
//     );

//     return () => {
//       axiosSecure.interceptors.request.eject(reqInterceptor);
//       axiosSecure.interceptors.response.eject(resInterceptor);
//     };
//   }, [user]);

//   return axiosSecure;
// };

// export default useAxiosSecure;

import axios from "axios";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const token = await user.getIdToken(); // ✅ Firebase ID Token
          config.headers.authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
    };
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;

