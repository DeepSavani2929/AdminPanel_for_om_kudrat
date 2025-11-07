import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
// import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/users/UsersData";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UsersData from "./pages/users/UsersData";
import Languages from "./pages/languages/Languages";
import Categories from "./pages/categories/Categories";
import Orders from "./pages/orders/Orders";
import { ToastContainer } from "react-toastify";
import Products from "./pages/products/products";
import Blog from "./pages/blog/Blog";
import BlogDetails from "./components/blogs/BlogDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element = {<ProtectedRoute/>}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/users" element={<UsersData />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blogs/:blogId" element={<BlogDetails />} />
            <Route path="/blogs/addBlog" element={<BlogDetails />} />
{/* 
            <Route path="/form-elements" element={<FormElements />} />

            <Route path="/basic-tables" element={<BasicTables />} /> */}

            {/* <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>
          </Route>


          <Route element = {<PublicRoute/>}>

              <Route path="/signin" element={<SignIn />} />
          </Route>


          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
        theme="colored"
        style={{
          zIndex: 99999,
          top: "70px",
        }}
      />
    </>
  );
}
