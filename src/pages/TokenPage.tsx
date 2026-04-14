import { useNavigate } from 'react-router-dom';
import TokenModal from '../components/TokenModal';

function TokenPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/', { replace: true });
  };

  return <TokenModal onClose={handleClose} />;
}

export default TokenPage;
