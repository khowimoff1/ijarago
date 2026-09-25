import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Listings from './pages/Listings.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import PostListing from './pages/PostListing.jsx';
import Login from './pages/Login.jsx';
import Favorites from './pages/Favorites.jsx';
import Profile from './pages/Profile.jsx';
import OwnerProfile from './pages/OwnerProfile.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/katalog" element={<Listings />} />
        <Route path="/elon/:id" element={<ListingDetail />} />
        <Route path="/elon-berish" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
        <Route path="/kirish" element={<Login />} />
        <Route path="/sevimlilar" element={<Favorites />} />
        <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/egasi/:id" element={<OwnerProfile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
