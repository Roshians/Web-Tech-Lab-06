import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Dashboard: {user.role}</h2>
      <p>Welcome, <strong>{user.name}</strong>!</p>
      <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #007bff' }}>
        <h3>Your Profile Information</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Assigned Role:</strong> {user.role}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Available Actions</h3>
        <ul>
          <li>View My Profile (this page)</li>
          {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
            <li>
              <Link to="/users" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Manage Users & Roles &rarr;</Link>
            </li>
          )}
          {user.role === 'USER' && (
            <li style={{ color: '#666' }}><i>Access Restricted: USER role cannot manage users.</i></li>
          )}
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: 'small' }}>
        <p><strong>Role Features Info:</strong></p>
        <ul>
          <li><strong>SUPER_ADMIN:</strong> Can view all users, create new ADMINs/USERs, change any role, and delete accounts.</li>
          <li><strong>ADMIN:</strong> Can view only USERs, create new USERs, and delete USERs. Restricted from seeing or managing other ADMINs or SUPER_ADMINs.</li>
          <li><strong>USER:</strong> Access restricted to own profile only.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
