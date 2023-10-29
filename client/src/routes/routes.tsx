import { BrowserRouter, Routes as Routing, Route } from "react-router-dom";

import Login from "../components/pages/login/Login";
import { RegisterRoute, DashboardRoute } from "./redirect";
import Candidates from "../components/pages/candidates/Candidates";
import Associations from "../components/pages/associations/Associations";
import Authenticated from "../components/layout/authenticated/Authenticated";
import Settings from "../components/pages/settings/Settings";

import Jobs from "../components/pages/jobs/Jobs";
import PublicJob from "../components/pages/jobDetails/PublicJob";
import Companies from "../components/pages/companies/Companies";
import Shortlist from "../components/pages/shortlist/Shortlist";
import CandidateProfile from "../components/pages/candidateProfile/CandidateProfile";

import CompanyProfile from "../components/pages/companyProfile/CompanyProfile";
import NotFound from "../components/pages/notfound/NotFound";
import DashboardAssociations from "../components/pages/dashboardAssociations/DashboardAssociations";
import CompanyPublicProfile from "../components/pages/companyPublicProfile/CompanyPublicProfile";
import AssociationProfile from "../components/pages/associationProfile/AssociationProfile";
import CandidatePublicProfile from "../components/pages/candidatePublicProfile/CandidatePublicProfile";
import AssociationPublicProfile from "../components/pages/associationPublicProfile/AssociationPublicProfile";
import FAQ from "../components/pages/faq/FAQ";
import Invite from "../components/UI/Invite";

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routing>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterRoute />} />
        <Route
          path="/"
          element={<Authenticated content={<DashboardRoute />} />}
        />
        <Route path="/jobs" element={<Authenticated content={<Jobs />} />} />
        <Route
          path="/companies"
          element={<Authenticated content={<Companies />} />}
        />
        <Route
          path="/saved"
          element={<Authenticated content={<Shortlist />} />}
        />
        <Route
          path="/candidates"
          element={<Authenticated content={<Candidates />} />}
        />
        <Route
          path="/candidate-profile/:id"
          element={<Authenticated content={<CandidateProfile />} />}
        />
        <Route
          path="/company-profile/:id"
          element={<Authenticated content={<CompanyProfile />} />}
        />
        <Route
          path="/associations"
          element={<Authenticated content={<Associations />} />}
        />
        <Route
          path="/association-profile/:id" //TODO
          element={<Authenticated content={<AssociationProfile />} />}
        />
        <Route
          path="/association/:id"
          element={<Authenticated content={<AssociationPublicProfile />} />}
        />
        <Route
          path="/dashboard-association"
          element={<Authenticated content={<DashboardAssociations />} />}
        />
        <Route
          path="/company/:id"
          element={<Authenticated content={<CompanyPublicProfile />} />}
        />
        <Route
          path="/job/:id"
          element={<Authenticated content={<PublicJob />} />}
        />
        <Route
          path="/candidate/:id"
          element={<Authenticated content={<CandidatePublicProfile />} />}
        />
        <Route
          path="/settings"
          element={<Authenticated content={<Settings />} />}
        />
        <Route path="/faq" element={<Authenticated content={<FAQ />} />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/invite" element={<Invite />} />
      </Routing>
    </BrowserRouter>
  );
};

export default Routes;
