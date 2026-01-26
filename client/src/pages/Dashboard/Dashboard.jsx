import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerDashboard from '../../components/DashboardComponents/CustomerDashboard/CustomerDashboard';
import CreatorDashboard from '../../components/DashboardComponents/CreatorDashboard/CreatorDashboard';
import CONSTANTS from '../../constants';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const params = useParams();

  const { role } = useSelector((state) => state.userStore.data);
  return role === CONSTANTS.CUSTOMER ? (
    <CustomerDashboard navigate={navigate} params={params} />
  ) : (
    <CreatorDashboard navigate={navigate} params={params} />
  );
};

export default Dashboard;
