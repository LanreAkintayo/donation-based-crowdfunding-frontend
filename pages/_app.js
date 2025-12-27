// import "../styles/globals.css";
// import { MoralisProvider } from "react-moralis";
// import { NotificationProvider } from "web3uikit";
// import { ToastContainer } from 'react-toastify';

// function MyApp({ Component, pageProps }) {
//   const getLayout = Component.getLayout ?? ((page) => page);
  
//   return (
//     <MoralisProvider initializeOnMount={false}>
//       {getLayout(<Component {...pageProps} />)}

//       <ToastContainer />
//     </MoralisProvider>
//   );
// }

// export default MyApp;




import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { GoogleOAuthProvider } from '@react-oauth/google';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
  // console.log("Google Client ID:", googleClientId);
  return (
    <MoralisProvider initializeOnMount={false}>
      <GoogleOAuthProvider clientId={googleClientId}>
    
            {getLayout(<Component {...pageProps} />)}
            <ToastContainer />

      </GoogleOAuthProvider>
    </MoralisProvider>
  );
}

export default MyApp;