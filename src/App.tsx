import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import RouteScrollReset from "@/components/RouteScrollReset";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";
import { SiteContentProvider } from "@/hooks/useSiteContent";
import AnalyticsInjector from "@/components/AnalyticsInjector";
import Index from "./pages/Index.tsx";
import ServicesIndex from "./pages/ServicesIndex.tsx";
import Category from "./pages/Category.tsx";
import SubCategory from "./pages/SubCategory.tsx";
import CategoryState from "./pages/CategoryState.tsx";
import LanePage, { LanesIndex } from "./pages/Lane.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import NotFound from "./pages/NotFound.tsx";
import CmsCatchAll from "./pages/CmsCatchAll.tsx";

// Admin — trimmed to the pieces WordPress doesn't replace (leads/CRM, redirects, users).
// Page/section editing, blog, media, SEO, and navigation now live in wp-admin.
import AdminLogin from "./pages/admin/Login.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import UsersPage from "./pages/admin/Users.tsx";
import RedirectsPage from "./pages/admin/Redirects.tsx";
import RedirectHandler from "./components/RedirectHandler";
import HubSpotSettings from "./pages/admin/HubSpotSettings.tsx";
import FormSubmissions from "./pages/admin/FormSubmissions.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SiteSettingsProvider>
              <SiteContentProvider>
                <AnalyticsInjector />
                <RouteScrollReset />
                <RedirectHandler />
                <Routes>
                  {/* Admin (no public layout) */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="redirects" element={<RedirectsPage />} />
                    <Route path="hubspot" element={<HubSpotSettings />} />
                    <Route path="submissions" element={<FormSubmissions />} />
                  </Route>

                  {/* Public site */}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/services" element={<ServicesIndex />} />
                          <Route path="/services/:categorySlug" element={<Category />} />
                          <Route path="/services/:categorySlug/state/:stateSlug" element={<CategoryState />} />
                          <Route path="/services/:categorySlug/:subSlug" element={<SubCategory />} />
                          <Route path="/lanes" element={<LanesIndex />} />
                          <Route path="/lanes/:laneSlug" element={<LanePage />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogPost />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="*" element={<CmsCatchAll />} />
                        </Routes>
                      </Layout>
                    }
                  />
                </Routes>
              </SiteContentProvider>
            </SiteSettingsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
