import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth, Protect } from "@clerk/clerk-react";

import {Toaster} from 'react-hot-toast'

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./pages/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WriteArticle = lazy(() => import("./pages/WriteArticle"));
const BlogTitle = lazy(() => import("./pages/BlogTitle"));
const GenerateImages = lazy(() => import("./pages/GenerateImages"));
const RemoveBg = lazy(() => import("./pages/RemoveBg"));
const RemoveObj = lazy(() => import("./pages/RemoveObj"));
const ReviewResume = lazy(() => import("./pages/ReviewResume"));
const Community = lazy(() => import("./pages/Community"));

const App = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => {
      if (token) {
        console.log("Token fetched successfully");
        // You can store or attach token to API headers if needed
      }
    });
  }, [getToken]);

  return (
    
    <div>
      {/* Suspense fallback for lazy loading */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen text-lg font-semibold">
            Loading...
          </div>
        }
      >
        <Toaster/>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="/ai"
            element={
              <Protect>
                <Layout />
              </Protect>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="write-article" element={<WriteArticle />} />
            <Route path="blog-titles" element={<BlogTitle />} />
            <Route path="generate-images" element={<GenerateImages />} />
            <Route path="remove-bg" element={<RemoveBg />} />
            <Route path="remove-object" element={<RemoveObj />} />
            <Route path="review-resume" element={<ReviewResume />} />
            <Route path="community" element={<Community />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
