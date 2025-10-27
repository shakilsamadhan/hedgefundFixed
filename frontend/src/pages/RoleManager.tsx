import React, { useEffect, useState } from "react";
import axios from "axios";
import { Role, useAuth, User } from "../context/AuthContext";

const BASE_URL = "http://127.0.0.1:8000/access";

export default function UserRoleManager() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const usersRes = await axios.get<User[]>(`${BASE_URL}/users`, { headers });
        const rolesRes = await axios.get<Role[]>(`${BASE_URL}/roles`, { headers });
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      } catch (err: any) {
        console.error(err.response?.data || err.message);
        setMessage("Failed to load users or roles.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleToggle = (userId: number, roleId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              roles: user.roles.some((r) => r.id === roleId)
                ? user.roles.filter((r) => r.id !== roleId) // remove role
                : [...user.roles, roles.find((r) => r.id === roleId)!], // add role
            }
          : user
      )
    );
  };

  const handleSubmit = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const roleIds = user.roles.map((r) => r.id);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${BASE_URL}/users/${userId}/roles`, roleIds, { headers });
      setMessage(`Updated roles for user: ${user.username}`);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setMessage(`Failed to update roles for user: ${user.username}`);
    }
  };

  if (loading) return <p>Loading users and roles...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Role Manager</h2>
      {message && (
        <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded text-blue-700">
          {message}
        </div>
      )}
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">User</th>
            {roles.map((role) => (
              <th key={role.id} className="border border-gray-400 px-4 py-2">
                {role.name}
              </th>
            ))}
            <th className="border border-gray-400 px-4 py-2">Save</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-400 px-4 py-2 font-semibold">
                {user.username}
              </td>
              {roles.map((role) => (
                <td
                  key={role.id}
                  className="border border-gray-400 px-4 py-2 text-center"
                >
                  <input
                    type="checkbox"
                    checked={user.roles.some((r) => r.id === role.id)}
                    onChange={() => handleToggle(user.id, role.id)} 
                  />
                </td>
              ))}
              <td className="border border-gray-400 px-4 py-2 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleSubmit(user.id)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
