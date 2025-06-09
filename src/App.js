import React from "react";
import "./App.css";
import {
  Routes,
  Route,
} from "react-router-dom";
import VideoKyc from "./pages/VideoKyc/videoKyc.js"
import Sdloader from "./components/Loader/FullPageLoader.js";
const AppLayout = React.lazy(() => import("./layouts"));
const TabsComp = React.lazy(() => import("./pages/tabs/Tabs"));
const Login = React.lazy(() => import("./pages/loginPage/Login"));
const CreditxDashboard = React.lazy(() => import("./pages/lmsDashboard/lmsDashboard.js"));
const DisbursementView = React.lazy(() => import("./pages/loanApplication/disbursmentView.js"));
const ProductCatalogue = React.lazy(() => import("./pages/Products/productCatalogue.js"));
const DateScheduler = React.lazy(() => import("./components/ActivityTracker.js"))
const TodoTracker = React.lazy(() => import("./components/Todo/TodoTracker.js"))
const NotifyPage = React.lazy(() => import("./components/NotificationComp/NotificationComp"));
const QueriesApprovals = React.lazy(() => import("./pages/QueriesApprovals/QueriesApprovals.js"));
const ApplicationListing = React.lazy(() => import("./pages/reward-corner/ApplicationListing"));
const CollectionListing = React.lazy(() => import("./pages/CollectionListing/CollectionListing.js"));
const CollectionView = React.lazy(() => import("./pages/CollectionListing/CollectionView.js"));
const LoanApplication = React.lazy(() => import("./pages/loanApplication/LoanApplication"));
const ViewDetails = React.lazy(() => import("./pages/loanApplication/ViewDetails.js"))

function App() {
  return (
    <AppLayout>
      <React.Suspense
        fallback={<Sdloader sdloader={false} />}>
        {/* {akshay activity Tracker from B2B-v2 implementation} */}
        <Routes><Route path="/Calendar" element={<DateScheduler />}></Route></Routes>
        <Routes><Route path="/Todo" element={<TodoTracker />}></Route></Routes>
        <Routes><Route path="/videoKyc/capture" element={<VideoKyc />} /></Routes>
        {/* {end} */}
        <Routes><Route path="/tabs" element={<TabsComp />} /></Routes>
        <div className="body_content">
          <Routes><Route exact path="/" element={<Login />} /></Routes>
          <Routes><Route path="/Dashboard" element={<CreditxDashboard />} /></Routes>
          <Routes><Route path="/Application-Listing" element={<ApplicationListing />} /></Routes>
          <Routes><Route path="/Application-Listing/Application" element={<LoanApplication />} /></Routes>
          <Routes><Route path="/product-catalogue" element={<ProductCatalogue />} /></Routes>
          <Routes><Route path="/disbursement-view" element={<DisbursementView />} /></Routes>
          <Routes><Route path="/Collection-Listing" element={<CollectionListing />} /></Routes>
          <Routes><Route path="/Collection-Listing/CollectionView" element={<CollectionView />} /></Routes>
          <Routes><Route path="/queries-approvals" element={<QueriesApprovals />} /></Routes>
          <Routes><Route path="/ViewDetails" element={<ViewDetails />} /></Routes>
          <Routes><Route path="/notifypage" element={<NotifyPage />} /></Routes>
        </div>
      </React.Suspense>
    </AppLayout>
  );
}

export default App;
