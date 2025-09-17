import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


const BASE_URL = "http://127.0.0.1:8000/access"; // backend URL


interface Action {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  actions: Action[];
}

export default function RoleActionManager() {
  const { token } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const rolesRes = await axios.get<Role[]>(`${BASE_URL}/roles`, { headers });
        const actionsRes = await axios.get<Action[]>(`${BASE_URL}/actions`, { headers });
        setRoles(rolesRes.data);
        setActions(actionsRes.data);
      } catch (err: any) {
        console.error(err.response?.data || err.message);
        setMessage("Failed to load roles or actions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleToggle = (roleId: number, actionId: number) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? {
              ...role,
              actions: role.actions.some((a) => a.id === actionId)
                ? role.actions.filter((a) => a.id !== actionId)
                : [...role.actions, actions.find((a) => a.id === actionId)!],
            }
          : role
      )
    );
  };

  const handleSubmit = async (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    const actionIds = role.actions.map((a) => a.id);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(`${BASE_URL}/roles/${roleId}/actions`, actionIds, { headers });
      setMessage(`Updated permissions for role: ${role.name}`);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setMessage(`Failed to update permissions for role: ${role.name}`);
    }
  };

  if (loading) return <p>Loading roles and actions...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Role Action Manager</h2>
      {message && (
        <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded text-blue-700">
          {message}
        </div>
      )}
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Role</th>
            {actions.map((action) => (
              <th key={action.id} className="border border-gray-400 px-4 py-2">
                {action.name}
              </th>
            ))}
            <th className="border border-gray-400 px-4 py-2">Save</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="border border-gray-400 px-4 py-2 font-semibold">{role.name}</td>
              {actions.map((action) => (
                <td
                  key={action.id}
                  className="border border-gray-400 px-4 py-2 text-center"
                >
                  <input
                    type="checkbox"
                    checked={role.actions.some((a) => a.id === action.id)}
                    onChange={() => handleToggle(role.id, action.id)}
                  />
                </td>
              ))}
              <td className="border border-gray-400 px-4 py-2 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleSubmit(role.id)}
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
