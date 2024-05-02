import {
  AuthBindings,
  Authenticated,
  Refine,
} from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AccountCircleOutlined,
        ChatBubbleOutline,
        PeopleAltOutlined,
        StarBorderOutlined,
        VillaOutlined,
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import RoofingIcon from '@mui/icons-material/Roofing';
import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";
import { Sider } from "./components/layout/sider";
import { Title } from "./components/layout/title";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/layout/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { 
  Login, } from "./pages/login";
import { parseJwt } from "./utils/parse-jwt";
import  Home  from './pages/home';
import { AllProperties } from "./pages/all-properties";
import Requirement from "./pages/requirement";
import  MyProfile  from "./pages/my-profile";
import { CreateProperty } from "./pages/create-property";
import { EditProperty } from "./pages/edit-property";
import  PropertyDetails  from "./pages/property-details";
import { AgentProfile } from "./pages/agent-profile";
import routerProvider from "@refinedev/react-router-v6";


const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

const theme = createTheme({
  palette: {
    primary: {
      light: '#FCFCFC',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#FCFCFC',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});


function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        const response = await fetch(
            "https://refine-dashboard-3gx3.onrender.com/api/v1/users",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profileObj.name,
                    email: profileObj.email,
                    avatar: profileObj.picture,
                }),
            },
        );
        const data = await response.json();
        if (response.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id,
            })
          );
        }
        else {
          return Promise.reject();
      }
      
        

        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
        
      },
    
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    
    <BrowserRouter>
      <ThemeProvider theme={theme}>
      <RefineKbarProvider>
      
        <ColorModeContextProvider>
        
          <CssBaseline />
          <GlobalStyles styles={{ body: { backgroundColor: '#FCFCFC' } }} />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
             
              <Refine
                dataProvider={dataProvider("http://localhost:8080/api/v1")}
                notificationProvider={notificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "Home",
                    options: { label: 'Home'},
                    list: "/",
                    icon: <DashboardIcon/>
                  },
                  {
                    name: "properties",
                    list: "/allProperties",

                    icon: <VillaOutlined />,
                  },
                  {
                    name: "requirement",
                    list: "/requirement",
                    icon: <RoofingIcon/>,
                  },
                  {
                    name: "agent",
                    list: "/agent",
                    icon: <PeopleAltOutlined />,
                  },
                  
                  {
                    name: "message",
                    list: "/message",
                    icon: <ChatBubbleOutline />,
                  },
                  {
                    name: "my-profile",
                    options: { label: 'My Profile'},
                    list: "/my-profile",
                    icon: <AccountCircleOutlined />,
                  },
                ]}
              

                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "9ZwJQG-jx6vU5-n7SNKo",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >    
                      <ThemeProvider theme={theme}>                  
                        <ThemedLayoutV2 Header={() => <Header sticky />} Sider={()=><Sider />}>
                          <Outlet />
                        </ThemedLayoutV2>
                        </ThemeProvider> 
                      </Authenticated>
                    }
                  >
                    
                    <Route index element={<Home />} />
                    <Route path="/allProperties">
                      <Route index element={<AllProperties />} />
                      <Route path="properties/create" element={<CreateProperty />} />
                      <Route path="properties/edit/:id" element={<EditProperty />} />
                      <Route index path="properties/show/:id" element={<PropertyDetails />} />
                    </Route>
                    <Route index path="properties/show/:id" element={<PropertyDetails />} />
                    <Route path="/requirement">
                      <Route index element={<Requirement />} />
                    </Route>
                    <Route path="/agent">
                      <Route index element={<AgentProfile/>} />
                    </Route>
                    <Route path="/message">
                      <Route index element={<AgentProfile/>} />
                    </Route>
                    <Route path="/my-profile">
                      <Route index element={<MyProfile />} />
                    </Route>
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoryList />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show/:id" element={<CategoryShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              
            </DevtoolsProvider>
           
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
        
      </RefineKbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
