import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import PrincipalMessage from './pages/PrincipalMessage';
import DirectorMessage from './pages/DirectorMessage';
import Management from './pages/Management';
import Academics from './pages/Academics';
import Admission from './pages/Admission';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Rules from './pages/Rules';
import Downloads from './pages/Downloads';
import Career from './pages/Career';
import ApplyAdmission from './pages/ApplyAdmission';
import ApplyJob from './pages/ApplyJob';
import AdvisoryBoard from './pages/AdvisoryBoard';
import Teachers from './pages/Teachers';

import AdminLayout from './layouts/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManageNews from './pages/admin/ManageNews';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageGallery from './pages/admin/ManageGallery';
import ManageDownloads from './pages/admin/ManageDownloads';
import ViewApplications from './pages/admin/ViewApplications';
import ManageBanners from './pages/admin/ManageBanners';
import ManageVacancies from './pages/admin/ManageVacancies';
import ManageAdvisoryBoard from './pages/admin/ManageAdvisoryBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<PrincipalMessage />} />
          <Route path="about/principal" element={<PrincipalMessage />} />
          <Route path="about/director" element={<DirectorMessage />} />
          <Route path="about/management" element={<Management />} />
          <Route path="academics" element={<Academics />} />
          <Route path="admission" element={<Admission />} />
          <Route path="admission/apply" element={<ApplyAdmission />} />
          <Route path="rules" element={<Rules />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="news" element={<Home />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="contact" element={<Contact />} />
          <Route path="career" element={<Career />} />
          <Route path="career/apply" element={<ApplyJob />} />
          <Route path="about" element={<Navigate to="/about/principal" replace />} />
          <Route path="team" element={<Navigate to="/team/advisory-board" replace />} />
          <Route path="team/advisory-board" element={<AdvisoryBoard />} />
          <Route path="team/teachers" element={<Teachers />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="vacancies" element={<ManageVacancies />} />
          <Route path="advisory" element={<ManageAdvisoryBoard />} />
          <Route path="teachers" element={<ManageTeachers />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="downloads" element={<ManageDownloads />} />
          <Route path="admissions" element={<ViewApplications type="admission" />} />
          <Route path="jobs" element={<ViewApplications type="job" />} />
          <Route path="banners" element={<ManageBanners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
