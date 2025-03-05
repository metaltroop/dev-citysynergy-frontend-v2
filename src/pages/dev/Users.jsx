"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import SearchBar from "../../components/dev/SearchBar";
import {
  Trash2,
  Key,
  UserPlus,
  Filter,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  Users as UsersIcon,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Button from "../../components/dept/Button";
import Modal from "../../components/dept/Modal";
import Toast from "../../components/common/Toast";

const isDeleteProtected = (user) => {
  return user.roles.some(
    (role) =>
      role.id === "DROL001" || // DevAdmin
      role.id === "ROLE_HEAD" // Department Head
  );
};

const isResetProtected = (user) => {
  return user.roles.some((role) => role.id === "DROL001"); // Only DevAdmin
};


const roleColorMap = {
  DROL001: "blue",
  DROL002: "purple",
  DROL003: "green",
  ROLE_HEAD: "purple",
  ROLE_MANAGER: "blue",
  ROLE_STAFF: "gray",
  ROLE_SUPERVISOR: "green",
  // Add other role IDs and colors as needed
};


export default function UsersPage() {
  const [userType, setUserType] = useState("dev");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  const getUniqueDepartments = () => {
    const departments = users
      .filter((user) => user.type === "dept" && user.department?.name)
      .map((user) => ({
        id: user.department.id,
        name: user.department.name
      }));
    return Array.from(new Map(departments.map(item => [item.id, item])).values());
  };
  
  // Add function to get unique roles for department users
  const getUniqueRoles = () => {
    const roles = users
      .filter((user) => user.type === "dept" && user.roles?.length > 0)
      .flatMap((user) => user.roles)
      .filter((role) => role.id.startsWith('ROLE_')); // Only department roles
    return Array.from(new Map(roles.map(item => [item.id, item])).values());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
    const response = await apiClient.get("/users");

    if (response.data.success) {
      setUsers(response.data.data);
      // Add success toast
      setToasts((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: "Users list refreshed successfully",
          type: "success",
        },
      ]);
    } else {
      throw new Error(response.data.message || "Failed to fetch users");
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    setError(err.message);
    // Add error toast
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: err.message || "Failed to refresh users list",
        type: "error",
      },
    ]);
  } finally {
    setLoading(false);
  }
};
  // Apply all filters
const filteredUsers = users.filter((user) => {
  // Base filter for user type
  if (user.type !== userType) return false;

  // Search filter
  const searchLower = searchTerm.toLowerCase();
  const matchesSearch = 
    user.username.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower);
  if (!matchesSearch) return false;

  // Only apply department and role filters for dept users
  if (user.type === "dept") {
    // Department filter
    if (departmentFilter !== "all" && user.department?.id !== departmentFilter) {
      return false;
    }

    // Role filter
    if (roleFilter !== "all") {
      if (!user.roles?.some(role => role.id === roleFilter)) {
        return false;
      }
    }
  }

  return true;
});

  // Get role display info
  // Replace the existing getRoleInfo function
  const getRoleInfo = (role) => {
    if (!role) return { name: "User", color: "gray" };
    const color = roleColorMap[role.id] || "gray";
    return {
      name: role.name,
      color: color,
    };
  };

  // Status based on isFirstLogin
  const getUserStatus = (user) => {
    if (user.state.isFirstLogin && user.state.needsPasswordChange)
      return "inactive";
    if (!user.state.isFirstLogin && user.state.needsPasswordChange)
      return "partially-inactive";
    if (!user.state.isFirstLogin && !user.state.needsPasswordChange)
      return "active";
    return "inactive";
  };

  // Status badge colors
  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      "partially-inactive": "bg-amber-100 text-amber-800",
      inactive: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Role badge colors
  const getRoleBadgeColor = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      green: "bg-green-100 text-green-800 border-green-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[color] || colors.gray;
  };



  const isResetDisabled = (user) => {
    const status = getUserStatus(user);
    return isResetProtected(user) || status === "partially-inactive";
  };
  
  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const confirmResetPassword = async () => {
    setIsResetting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.post(
        `/auth/reset-password/${selectedUser.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToasts((prev) => [
          ...prev,
          {
            id: Date.now(),
            message: response.data.message || "Password reset successful",
            type: "success",
          },
        ]);
        setIsResetPasswordModalOpen(false);
      }
    } catch (err) {
      setToasts((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Error resetting password",
          type: "error",
        },
      ]);
    } finally {
      setIsResetting(false);
      setIsResetPasswordModalOpen(false);
      fetchUsers();
    }
  };
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await apiClient.put(`/users/${userToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setToasts((prev) => [
          ...prev,
          {
            id: Date.now(),
            message: response.data.message,
            type: "success",
          },
        ]);
        setDeleteModalOpen(false);
      }
    } catch (err) {
      setToasts((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: err.response?.data?.message || "Error resetting password",
          type: "error",
        },
      ]);
    } finally {
      setIsResetting(false);
      setIsResetPasswordModalOpen(false);
      fetchUsers();
    }
  };
  // Format last login date
  const formatLastLogin = (lastLoginDate) => {
    if (!lastLoginDate) return "Never";

    const lastLogin = new Date(lastLoginDate);
    const now = new Date();
    const diffMs = now - lastLogin;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;

    return lastLogin.toLocaleDateString();
  };

  // Get user avatar initials
  const getUserInitials = (username) => {
    if (!username) return "??";
    return username.substring(0, 2).toUpperCase();
  };

  const CustomSelect = ({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    loading = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    return (
      <div className="relative w-full" ref={selectRef}>
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            flex items-center justify-between 
            w-full px-3 py-2 
            border rounded-md 
            ${disabled
              ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              : "bg-white dark:bg-gray-700 cursor-pointer"
            }
            ${disabled
              ? "border-gray-300 dark:border-gray-600"
              : "border-gray-300 dark:border-gray-600"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        >
          <span className={`${value ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}`}>
            {options.find((opt) => opt.value === value)?.label || placeholder}
          </span>
          <div className="flex items-center">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-400" />
            )}
            <ChevronDown className={`h-4 w-4 ${disabled ? "text-gray-400" : "text-gray-600 dark:text-gray-300"}`} />
          </div>
        </div>
  
        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 rounded-md shadow-lg 
            max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 
                  cursor-pointer text-gray-900 dark:text-gray-100
                  transition-colors duration-200"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-auto mx-auto p-6 dark:bg-gray-900">
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <UsersIcon className="mr-2 h-6 w-6 text-blue-500" />
            User Management
          </h1>
          <p className="text-gray-600">
            Manage system users and their permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/dashboard/dev/users/create")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-500 dark:text-blue-400 mb-2">
            {users.filter((u) => u.type === "dev").length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Developer Users
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-purple-500 mb-2">
            {users.filter((u) => u.type === "dept").length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Department Users
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-green-500 mb-2">
            {users.filter((u) => getUserStatus(u) === "active").length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Active Users</div>
        </div>
        {/*add card for the parially active and total users  */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-amber-500 mb-2">
            {users.filter((u) => getUserStatus(u) === "partially-inactive").length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Partially Inactive Users</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-500 mb-2">
            {users.length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">Total Users</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
            //onclick both setUserType and fetchUsers should be called simultaneously
              onClick={() => setUserType("dev") }
              className={`px-4 py-2 rounded-lg transition-colors ${
                userType === "dev"
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Dev Users
            </button>
            <button
              onClick={() => setUserType("dept")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                userType === "dept"
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Department Users
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
  <SearchBar
    onSearch={setSearchTerm}
    placeholder="Search users..."
    className="w-full sm:w-64"
  />
  <button
    onClick={fetchUsers}
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    title="Refresh users"
  >
    <RefreshCcw className="h-5 w-5 text-gray-600 dark:text-gray-300" />
  </button>
        {userType === "dept" && (
  <div className="relative" ref={filterRef}>
    <button
      onClick={() => setFilterOpen(!filterOpen)}
      className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      <Filter className="h-4 w-4" />
      Filters {(departmentFilter !== "all" || roleFilter !== "all") && (
        <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
          {[
            departmentFilter !== "all" && "Dept",
            roleFilter !== "all" && "Role"
          ].filter(Boolean).join(", ")}
        </span>
      )}
    </button>

    {filterOpen && (
      <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10 p-4">
        <h3 className="font-medium mb-3">Filter Users</h3>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Department
          </label>
          <CustomSelect
            value={departmentFilter}
            onChange={setDepartmentFilter}
            options={[
              { value: "all", label: "All Departments" },
              ...getUniqueDepartments().map(dept => ({
                value: dept.id,
                label: dept.name
              }))
            ]}
            placeholder="Select Department"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <CustomSelect
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: "all", label: "All Roles" },
              ...getUniqueRoles().map(role => ({
                value: role.id,
                label: role.name
              }))
            ]}
            placeholder="Select Role"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setDepartmentFilter("all");
              setRoleFilter("all");
            }}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Reset Filters
          </button>
        </div>
      </div>
    )}
  </div>
)}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <RefreshCcw className="h-12 w-12 mx-auto mb-2 opacity-50 animate-spin" />
              <p className="text-lg font-medium">Loading users...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-400 dark:text-red-500 mb-2">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">Error loading users</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Email
                  </th>
                  {userType === "dept" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Department
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => {
                  const role = user.roles?.[0]; // Get the first role from user's roles array
                  const roleInfo = getRoleInfo(role);
                  const status = getUserStatus(user);
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {getUserInitials(user.username)}
                          </div>
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      {userType === "dept" && (
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {user.department ? user.department.name : "None"}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="inline-flex">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(
                              roleInfo.color
                            )}`}
                          >
                            {roleInfo.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {status === "active" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : status === "partially-inactive" ? (
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span
                            className={`px-2 py-1 rounded-md text-xs ${getStatusColor(
                              status
                            )}`}
                          >
                            {status
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.state && user.state.lastLogin
                          ? formatLastLogin(user.state.lastLogin)
                          : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Delete Button - disabled for both DevAdmin and Department Head */}
                          <button
                            className={`p-1 rounded-full transition-colors ${
                              isDeleteProtected(user)
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                            onClick={() =>
                              !isDeleteProtected(user) && handleDeleteUser(user)
                            }
                            disabled={isDeleteProtected(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          {/* Reset Password Button - disabled only for DevAdmin */}
                          <button
                            className={`p-1 rounded-full transition-colors ${
                              isResetDisabled(user)
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                            }`}
                            onClick={() =>
                              !isResetDisabled(user) &&
                              handleResetPassword(user)
                            }
                            disabled={isResetDisabled(user)}
                            title={
                              isResetProtected(user)
                                ? "Cannot reset DevAdmin password"
                                : getUserStatus(user) === "partially-inactive"
                                ? "Cannot reset password for partially inactive user"
                                : "Reset password"
                            }
                          >
                            <Key className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <RefreshCcw className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">No users found</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div>
            Showing {filteredUsers.length} of{" "}
            {users.filter((u) => u.type === userType).length} users
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 rounded border bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded border bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              1
            </button>
            <button className="px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        title="Reset Password"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-400">
                Are you sure you want to reset the password for{" "}
                <span className="font-bold">{selectedUser.username}</span>?
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-2">
                A temporary password will be generated and sent to their email
                address.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsResetPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmResetPassword} disabled={isResetting}>
                {isResetting ? (
                  <div className="flex items-center">
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>{" "}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
      >
        {userToDelete && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-400">
                Are you sure you want to delete the user{" "}
                <span className="font-bold">{userToDelete.username}</span>?
              </p>
              <p className="text-sm text-red-700 dark:text-red-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-red-800 dark:text-red-400">{deleteError}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete User"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
