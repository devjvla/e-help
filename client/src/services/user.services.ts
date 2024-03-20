import axios from "axios";

interface responseData {
	status: false;
	result: {};
	error: any;
}

interface userSigninParams {
	email_address?: string;
	password?: string;
}

export default (function UserServices(){
  async function userSignin(params: userSigninParams) {
    let response_data : responseData = { status: false, result: {}, error: null }

    try {
      let user_signin = await axios.post("http://localhost:3000/api_ehelp_v1/user/signin", params);
      console.log("USER SIGNIN: ", user_signin);

    } catch (error) {
      response_data.error = error;
    }

    return response_data;
  }

	// async function googleSignIn(access_token) {
    //     let response_data = {status: false, result: {}, error: null}

    //     try {
    //         let get_user_info = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
    //             headers: { Authorization: `Bearer ${access_token}`},
    //         });

    //         if(get_user_info.status != 200){
    //             throw new Error("Failed to fetch user info.");
    //         }

    //         let url = `${process.env.REACT_APP_BASE_URL}/users/get_user`;

    //         await axios.post(url, get_user_info.data)
    //         .then(res => response_data = {...res.data});

    //     } catch (error) {
    //         response_data.error = error;
    //     }
        
    //     return response_data;
    // }

    // async function signoutUser() {
    //     let response_data = {status: false, result: {}, error: null}

    //     try {
    //         let url = `${process.env.REACT_APP_BASE_URL}/users/signout`;

    //         await axios.post(url, {})
    //         .then(res => response_data = {...res.data});

    //     } catch (error) {
    //         response_data.error = error;
    //     }
        
    //     return response_data;
	// }

	return { userSignin }
})();