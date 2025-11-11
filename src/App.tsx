import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UsersData from "./pages/users/UsersData";
import Languages from "./pages/languages/Languages";
import Categories from "./pages/categories/Categories";
import Orders from "./pages/orders/Orders";
import { ToastContainer } from "react-toastify";
import Products from "./pages/products/products";
import ContactUs from "./pages/contactUs/ContactUs.tsx";
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
            <Route path="/blogs/:blogSlug" element={<BlogDetails />} />
            <Route path="/blogs/addBlog" element={<BlogDetails />} />
            <Route path="/contactUs" element={<ContactUs />} />

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
