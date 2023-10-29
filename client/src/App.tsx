import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/auth";
import { ConfigProvider } from "antd";
import Routes from "./routes/routes";
import "./config";

function App() {
  return (
    <GoogleOAuthProvider clientId="<your_client_id>">
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#10239e",
            },
          }}
        >
          <Routes />
        </ConfigProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
