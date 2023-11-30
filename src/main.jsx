import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import About from "./pages/About";
import Admin from "./pages/Admin";
import AdminAbout from "./pages/Admin/AdminAbout";
import Checkout from "./pages/Admin/Checkout";
import Chat from "./pages/Chat";
import AdminChat from "./pages/Chat/AdminChat";
import Paint from "./pages/Paint";
import Post from "./pages/Post";
import UserPost from "./pages/Post/UserPost";
import Profile from "./pages/Profile";
import UserPage from "./pages/UserPage";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="profile" element={<Profile />} />
      <Route path="post" element={<Post />} />
      <Route path="userpost" element={<UserPost />} />
      <Route path="paint" element={<Paint />} />
      <Route path="admin" element={<Admin />} />
      <Route path="userpage" element={<UserPage />} />
      <Route path="cart" element={<Cart />} />
      <Route path="chat" element={<Chat />} />
      <Route path="about" element={<About />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="adminchat" element={<AdminChat />} />
      <Route path="adminabout" element={<AdminAbout />} />
    </Routes>
    <Footer />
  </BrowserRouter>,
);
