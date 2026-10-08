"use client"

import { MyCancel, MyOptionalParams, MySave, MySubstring } from "@/components/myFunction"
import PermissionGuard from "@/components/PermissionGuard"
import PageHeader from "@/components/shared/PageHeader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "@/context/AuthContext"
import api from '@/lib/axios'
import { PERMISSIONS } from "@/src/constants/permissions"
import { Edit, Eye, Plus, RefreshCw, Search, Settings, Shield, Trash2, Users, X } from "lucide-react"
import { useEffect, useState } from "react"
import { UserTypes } from "../role"
import UserSelect from "@/components/user/FindUser"
import { PersonT } from "../../person/person"
import { UserT } from "../utility"
import DateSelect from "@/components/SelectDate"

interface Permission {
  id: number
  name: string
  description: string
  path: string
  httpMethod: string
  createdAt: string
  groupName: any
}

export interface UserDTO {
  id: string
  googleId: any
  name: string
  email: string
  firstName: string
  lastName: string
  gender: any
  enabled: boolean
  failedPinAttempts: number
  phone: string
  createdAt: string
  updatedAt: string
  roles: Role[]
}

interface Role {
  id: number
  name: string
  description: string
  permissions: Permission[]
  userCount: number
  isSystem: boolean
  createdAt: string
  updatedAt: string
  userType: string
}
export interface AssignRolesBatch {
  userId: string
  roleIds: number[]
}

const defaultPermissions: Permission[] = [
  {
    "id": 1,
    "name": "USER_READ",
    "description": "Can view users",
    "path": "/api/v1/users/{id}",
    "httpMethod": "GET",
    "createdAt": "2026-05-04T06:49:37.025669Z",
    "groupName": null
  }
]

const defaultRoles: Role[] = []

export interface PermissionGroup {
  id: number
  name: string
  description: string
  permissions: Permission[]
}

export default function RolesPermissionsPage() {
  const authService = `auth-service/api`
  const roleUrl = `${authService}/roles`
  const userUrl = `${authService}/users`
  const permGroupUrl = `${authService}/permissions/permission-group`
  const pageSize = 2000

  const permissionsUrl = `${authService}/permissions`
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [permissionsGroup, setPermissionsGroup] = useState<PermissionGroup[]>([])

  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [isAssignRoleOpen, setIsAssignRoleOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [editPermissionSearch, setEditPermissionSearch] = useState("");
  const [searchUser, setSearchUser] = useState("")
  // const [filterUserByRole, setFilterUserByRole] = useState<User[]>([])
  const [filterByRole, setFilterByRole] = useState<string>('all')

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [date, setDate] = useState(new Date());
  const [selectedPerson, setSelectedPerson] = useState<PersonT | null>(null);
  const [personSearch, setPersonSearch] = useState("");
  const [personList, setPersonList] = useState<PersonT[]>([]);

  const getEmptyPerson = (): PersonT => ({
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    photo: null,
    gender: "",
    dateOfBirth: new Date(),
    personType: [],
    photos: [],
  });

  const updateSelectedPerson = (updates: Partial<PersonT>) => {
    setSelectedPerson((prev) => ({
      ...(prev ?? getEmptyPerson()),
      ...updates,
    }));
  };

  const [user, setUser] = useState<UserT>({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    name: "",
    phone: "",
    pin: "",
    confirmPin: "",
    roleIds: [
      0
    ],
    countryCode: "+855",
    userTypes: ["operator"]
  });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const handleRoleChange = (roleId: number, checked: boolean) => {
    setSelectedRoles((prev) =>
      checked ? [...prev, roleId] : prev.filter((id) => id !== roleId)
    );
  };

  // Form states
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissionIds: [] as number[],
    userType: "OPERATOR"
  })

  useEffect(() => {
    getAll();
  }, [])

  const handleRefresh = () => {
    // postUser();
    // getAll();
  };

  const getUser = () => {
    api.get(`${userUrl}`, { params: { page: 0, size: pageSize, search: searchUser == '' ? undefined : searchUser } }).then(response => {
      const users = response.data.data.content;
      setUsers(users)
    }).catch((err) => {
      setUsers([])
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getUser()
    }, 480);
    return () => clearTimeout(timer);
  }, [searchUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      findUser();
    }, 380);

    return () => clearTimeout(timer);
  }, [personSearch]);

  const findUser = async () => {
    try {
      const res = await api.get(
        "person-service/api/v1/persons?page=0&size=5",
        {
          params: { name: personSearch, },
        }
      );
      setPersonList(res.data.data.result);
    } catch (error) {
      console.error("Failed to find users:", error);
      setPersonList([]);
    }
  };

  const handleCreateUser = () => {
    // if(user.pin !== user.confirmPin) return;
    let _user = {
      ...user,
      ...selectedPerson,
      pin: MyOptionalParams(user.pin),
      roleIds: selectedRoles,
    };

    console.log("user::", _user);
    api.post(`${userUrl}`, _user).then(response => {

    })
    api.put(`${userUrl}/${selectedPerson?.id}`, _user).then(response => {

    })
  }

  const usersFilteredByRole = users.filter((user) => {
    if (filterByRole == 'all') return users

    const selectedRole = user.roles.some((role) => role.name === filterByRole);
    return (selectedRole);
  });

  const getRoles = () => {
    api.get(`${roleUrl}`, { params: { page: 0, size: pageSize } }).then(response => {
      const data = response.data.data;
      const modifyGroupNameByFirstName = data.map((role: Role) => {
        const modifiedPermissions = role.permissions.map((permission) => {
          const groupName = permission.name.split("_")[0];
          return { ...permission, groupName };
        });
        return { ...role, permissions: modifiedPermissions };
      });
      setRoles(modifyGroupNameByFirstName)
    }).catch(() => {
      setRoles(defaultRoles)
    })
  }

  const getPermissionsNGroup = () => {
    api.get(`${permissionsUrl}`, { params: { page: 0, size: pageSize } }).then(response => {
      const data = response.data.data.content;
      setPermissions(data)
    }).catch(() => {
      setPermissions(defaultPermissions)
    }).finally(() => {
      setIsRefreshing(false)
    });

    api.get(`${permGroupUrl}`, { params: { page: 0, size: pageSize } }).then(response => {
      const data = response.data.data.content;
      setPermissionsGroup(data)
    }).catch(() => {
      setPermissionsGroup([])
    })
  }

  const getAll = () => {
    getRoles();
    getPermissionsNGroup();
    getUser();
  }

  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [assignRole, setAssignRole] = useState<AssignRolesBatch | null>(null)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUserRole, setNewUserRole] = useState("")
  // const categories = ["all", ...Array.from(new Set(permissions.map((p) => p.groupName)))]
  const [originalRoleIds, setOriginalRoleIds] = useState<number[]>([]);
  const [permissionSearch, setPermissionSearch] = useState("");

  const filteredPermissions = permissions.filter((permission) => {
    const selected = newRole.permissionIds.includes(permission.id);
    const matchesSearch =
      permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      permission.description
        ?.toLowerCase()
        .includes(permissionSearch.toLowerCase());

    return (selected || matchesSearch);
  });

  const handleCreateRole = () => {
    const payload = {
      name: newRole.name,
      description: newRole.description,
      permissionIds: newRole.permissionIds,
      userType: newRole.userType || "OPERATOR"
    }

    api.post(`${roleUrl}`, payload).then(response => {
      const role = response.data.data; // Update with actual ID from backend
      setRoles([...roles, role])
      setNewRole({ name: "", description: "", permissionIds: [], userType: "OPERATOR" })
      setIsCreateRoleOpen(false)
      getRoles();
    }).catch(() => {

    })
  }

  const handleEditRole = () => {
    if (!editingRole) return
    let _editingRoleIds = editingRole.permissions.map((p) => p.id)
    let payload = {
      ...editingRole,
      permissionIds: _editingRoleIds,
      updatedAt: new Date().toISOString().split("T")[0]
    }

    api.put(`${roleUrl}/${editingRole.id}`, payload).then((res) => {
      setIsEditRoleOpen(false)
      setEditingRole(null)
      getRoles();
    }).catch(() => {

    })
  }

  type Action = "READ" | "WRITE" | "CREATE" | "DELETE" | "OTHER";

  const handleDeleteRole = (roleId: number) => {
    api.delete(`${roleUrl}/${roleId}`).then(() => {
      setRoles(roles.filter((role) => role.id !== roleId))
    }).catch(() => {

    })
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const group = permission.name.split("_")[0].toUpperCase();

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(permission);

    return acc;
  }, {} as Record<string, typeof permissions>);


  const categories = [
    "all",
    ...Array.from(
      new Set(permissions.map((p) => p.groupName))
    ),
    ...Array.from(
      new Set(groupedPermissions ? Object.keys(groupedPermissions) : [])
    )
  ];

  const editingRolePermissionIds = editingRole?.permissions.map((p) => p.id) ?? [];

  const getEditingRolePermissionToggle = (permissionId: number) => () => {
    togglePermission(
      permissionId,
      editingRolePermissionIds,
      (permissionIds) => {
        if (!editingRole) return;
        setEditingRole({ ...editingRole, permissions: permissions.filter((p) => permissionIds.includes(p.id)) });
      },
    );
  };

  const handleRemoveRoleFromUser = (role: User) => {
    console.log("user::", role);
  }

  const handleAssignRole = async () => {
    if (!selectedUser) return;
    if (!assignRole) return;

    const addedRoles = assignRole.roleIds.filter(
      (id) => !originalRoleIds.includes(id)
    );

    const removedRoles = originalRoleIds.filter(
      (id) => !assignRole.roleIds.includes(id)
    );

    let updatedUser = selectedUser;

    if (addedRoles.length > 0) {
      const res = await api.post(
        `${userUrl}/${selectedUser.id}/roles/batch`,
        { roleIds: addedRoles }
      );

      updatedUser = res.data.data;
    }

    if (removedRoles.length > 0) {
      const res = await api.delete(
        `${userUrl}/${selectedUser.id}/roles/batch`,
        {
          data: { roleIds: removedRoles },
        }
      );

      updatedUser = res.data.data;
    }

    setSelectedUser(updatedUser);
    setOriginalRoleIds(updatedUser.roles.map((r: any) => r.id));
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setIsAssignRoleOpen(false)
  };

  const togglePermission = (
    permissionId: number,
    rolePermissions: number[],
    setPermissions: (permissions: number[]) => void,
  ) => {
    if (rolePermissions.includes(permissionId)) {
      setPermissions(rolePermissions.filter((id) => id !== permissionId))
    } else {
      setPermissions([...rolePermissions, permissionId])
    }
  }

  const toggleRole = (
    roleId: number,
    roleIds: number[],
    setRoles: (roleIds: number[]) => void,
  ) => {
    if (roleIds.includes(roleId)) {
      setRoles(roleIds.filter((id) => id !== roleId))
    } else {
      setRoles([...roleIds, roleId])
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader pageTitle="Roles & Permissions" pageDes="Manage user roles and system permissions" />

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="flex flex-wrap justify-start sm:w-max h-max">
          <PermissionGuard permission={PERMISSIONS.ROLE_READ}>
            <TabsTrigger value="roles">Roles Management</TabsTrigger>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.USER_READ}>
            <TabsTrigger value="users">User Assignments</TabsTrigger>
          </PermissionGuard>
          <TabsTrigger value="permissions">Permissions Overview</TabsTrigger>
          <TabsTrigger value="permissions-group">Permissions Group</TabsTrigger>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing} >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </TabsList>

        <PermissionGuard permission={PERMISSIONS.ROLE_READ}>
          <TabsContent value="roles" className="space-y-6">
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search roles..."
                    value={searchTerm}
                    type="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <PermissionGuard permission={PERMISSIONS.ROLE_WRITE}>
                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen} >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-8xl max-h-[100vh] overflow-y-auto" >
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Define a new role with specific permissions for your team members.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role-name">Role Name</Label>
                          <Input
                            id="role-name"
                            type="text"
                            value={newRole.name}
                            pattern="^[A-Za-z0-9_]+$"
                            required
                            onChange={(e) => setNewRole({ ...newRole, name: e.target.value = e.target.value.replace(/[^A-Za-z0-9_]/g, "") })}
                            placeholder="Enter role name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role-description">Description</Label>
                          <Input
                            id="role-description"
                            value={newRole.description}
                            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                            placeholder="Enter role description"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="edit-role-user-type">User Type</Label>
                          <RadioGroup value={newRole.userType} required
                            onValueChange={(value) => setNewRole({ ...newRole, userType: value })} className="flex flex-wrap gap-4">
                            {UserTypes.map((type) => (
                              <div key={type.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={type.value} id={type.value} />
                                <Label htmlFor={type.value}>{type.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 items-center ">
                          <Label>Permissions</Label>

                          <Input
                            placeholder="Search permissions..."
                            type="search"
                            value={permissionSearch}
                            onChange={(e) => setPermissionSearch(e.target.value)}
                            className=" w-48"
                          />

                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.filter((cat) => cat !== null).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category === "all" ? "All Categories" : category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
                          {Object.entries(groupedPermissions)
                            .filter(([group, items]) => {
                              const groupMatchesFilter =
                                filterCategory === "all" ||
                                group.toLowerCase() === filterCategory.toLowerCase();

                              if (!groupMatchesFilter) return false;

                              const filteredItems = items.filter((permission) => {
                                const matchesSearch =
                                  permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                                  permission.description
                                    ?.toLowerCase()
                                    .includes(permissionSearch.toLowerCase());

                                return matchesSearch;
                              });

                              return filteredItems.length > 0;
                            })
                            .map(([group, items]) => {
                              const filteredItems = items.filter((permission) => {
                                const matchesSearch =
                                  permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
                                  permission.description
                                    ?.toLowerCase()
                                    .includes(permissionSearch.toLowerCase());

                                return matchesSearch;
                              });

                              return (
                                <div key={group} className="mb-2" >
                                  <div key={`new-${group}-name`} className="flex items-center space-x-2">
                                    <Checkbox id={`new-${group}-name`} checked={items.every((permission) => newRole.permissionIds.includes(permission.id))}
                                      onCheckedChange={() => {
                                        const allSelected = items.every((permission) => newRole.permissionIds.includes(permission.id));
                                        if (allSelected) {
                                          // Deselect all permissions in this group
                                          const updatedPermissionIds = newRole.permissionIds.filter((id) => !items.some((permission) => permission.id === id));
                                          setNewRole({ ...newRole, permissionIds: updatedPermissionIds });
                                        } else {
                                          // Select all permissions in this group
                                          const updatedPermissionIds = [...newRole.permissionIds, ...items.filter((permission) => !newRole.permissionIds.includes(permission.id)).map((permission) => permission.id)];
                                          setNewRole({ ...newRole, permissionIds: updatedPermissionIds });
                                        }
                                      }}
                                    />

                                    <Label htmlFor={`new-${group}-name`} className="text-sm font-medium">
                                      {group}
                                    </Label>
                                  </div>
                                  <div className="space-y-2 ml-6 flex flex-row gap-2 flex-wrap">
                                    {filteredItems.map((permission) => (
                                      <div key={permission.id} className="flex items-center space-x-2 ml-4">
                                        <Checkbox
                                          id={`new-${permission.id}`}
                                          checked={newRole.permissionIds.includes(permission.id)}
                                          onCheckedChange={() =>
                                            togglePermission(permission.id, newRole.permissionIds, (permissionIds) =>
                                              setNewRole({ ...newRole, permissionIds }),
                                            )
                                          }
                                        />
                                        <div className="flex-1">
                                          <Label htmlFor={`new-${permission.id}`} className="text-sm font-medium">
                                            <span className="text-xs text-gray-700">{permission.description}</span>
                                          </Label>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRole} disabled={!newRole.name.trim()}>
                        Create Role
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </PermissionGuard>
            </div>

            <div className="grid gap-4">
              {roles
                .filter(
                  (role) =>
                    role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    role.description?.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-wrap gap-3 items-center">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{role.name}</span>
                              {role.isSystem && <Badge variant="secondary">System</Badge>}
                            </CardTitle>
                            <CardDescription>{role.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{role.userCount} users</span>
                          </Badge>
                          <PermissionGuard permission={PERMISSIONS.ROLE_WRITE}>
                            <Dialog
                              open={isEditRoleOpen && editingRole?.id === role.id}
                              onOpenChange={(open) => {
                                setIsEditRoleOpen(open)
                                if (!open) setEditingRole(null)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingRole({ ...role })}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-10xl max-h-[100vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Role: {role.name}</DialogTitle>
                                  <DialogDescription>Modify role permissions and details.</DialogDescription>
                                </DialogHeader>

                                {editingRole && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-role-name">Role Name</Label>
                                        <Input
                                          id="edit-role-name"
                                          type="text"
                                          required
                                          pattern="^[A-Za-z0-9_]+$"
                                          value={editingRole.name}
                                          onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value = e.target.value.replace(/[^A-Za-z0-9_]/g, "") })}
                                          disabled={role.isSystem}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-role-description">Description</Label>
                                        <Input
                                          id="edit-role-description"
                                          required
                                          value={editingRole.description}
                                          onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                                        />
                                      </div>
                                      <div className="space-y-2 col-span-2">
                                        <Label htmlFor="edit-role-user-type">User Type</Label>
                                        <RadioGroup value={editingRole.userType} required
                                          onValueChange={(value) => setEditingRole({ ...editingRole, userType: value })} className="flex flex-wrap gap-4">
                                          {UserTypes.map((type) => (
                                            <div key={type.value} className="flex items-center space-x-2">
                                              <RadioGroupItem value={type.value} id={type.value} />
                                              <Label htmlFor={type.value}>{type.label}</Label>
                                            </div>
                                          ))}
                                        </RadioGroup>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <div className="flex flex-wrap gap-2 items-center ">
                                        <Label>Permissions</Label>

                                        <Input
                                          className="w-48"
                                          placeholder="Search permissions..."
                                          value={editPermissionSearch}
                                          onChange={(e) => setEditPermissionSearch(e.target.value)}
                                        />

                                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                                          <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Filter by category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {categories.filter((cat) => cat !== null).map((category) => (
                                              <SelectItem key={category} value={category}>
                                                {category === "all" ? "All Categories" : category}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>

                                      </div>
                                      <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
                                        {Object.entries(groupedPermissions)
                                          .filter(([group, items]) => {
                                            const groupMatchesFilter =
                                              filterCategory === "all" ||
                                              group.toLowerCase() === filterCategory.toLowerCase();

                                            if (!groupMatchesFilter) return false;

                                            const filteredItems = items.filter((permission) => {
                                              const matchesSearch =
                                                permission.name.toLowerCase().includes(editPermissionSearch.toLowerCase()) ||
                                                permission.description
                                                  ?.toLowerCase()
                                                  .includes(editPermissionSearch.toLowerCase());

                                              return matchesSearch;
                                            });

                                            return filteredItems.length > 0;
                                          })
                                          .map(([group, items]) => {
                                            const filteredItems = items.filter((permission) => {
                                              const matchesSearch =
                                                permission.name.toLowerCase().includes(editPermissionSearch.toLowerCase()) ||
                                                permission.description
                                                  ?.toLowerCase()
                                                  .includes(editPermissionSearch.toLowerCase());

                                              return matchesSearch;
                                            });

                                            return (
                                              <div key={group} className="mb-4">
                                                <div className="flex items-center space-x-2 mb-2">
                                                  <Checkbox
                                                    id={`edit-${group}-name`}
                                                    checked={items.every((permission) => editingRole.permissions.some((p) => p.id === permission.id))}
                                                    onCheckedChange={() => {
                                                      const allSelected = items.every((permission) => editingRole.permissions.some((p) => p.id === permission.id));
                                                      if (allSelected) {
                                                        const updatedPermissionIds = editingRole.permissions
                                                          .map((p) => p.id)
                                                          .filter((id) => !items.some((permission) => permission.id === id));
                                                        setEditingRole({
                                                          ...editingRole,
                                                          permissions: permissions.filter((p) => updatedPermissionIds.includes(p.id)),
                                                        });
                                                      } else {
                                                        const updatedPermissionIds = [
                                                          ...editingRole.permissions.map((p) => p.id),
                                                          ...items
                                                            .filter((permission) => !editingRole.permissions.some((p) => p.id === permission.id))
                                                            .map((permission) => permission.id),
                                                        ];
                                                        setEditingRole({
                                                          ...editingRole,
                                                          permissions: permissions.filter((p) => updatedPermissionIds.includes(p.id)),
                                                        });
                                                      }
                                                    }}
                                                    disabled={role.isSystem}
                                                  />
                                                  <Label htmlFor={`edit-${group}-name`} className="text-sm font-medium">
                                                    {group}
                                                  </Label>
                                                </div>

                                                <div className="space-y-2 ml-6 flex flex-row gap-2 flex-wrap">
                                                  {filteredItems.map((permission) => (
                                                    <div key={permission.id} className="flex items-center space-x-2">
                                                      <Checkbox
                                                        id={`edit-${permission.id}`}
                                                        checked={editingRole.permissions.some((p) => p.id === permission.id)}
                                                        onCheckedChange={getEditingRolePermissionToggle(permission.id)}
                                                        disabled={role.isSystem}
                                                      />
                                                      <div className="flex-1">
                                                        <p className="text-xs text-gray-700">{permission.description}</p>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )
                                          })}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
                                    <MyCancel />
                                  </Button>
                                  <Button disabled={editingRole?.name == ''} onClick={handleEditRole}>
                                    <MySave />
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </PermissionGuard>

                          <PermissionGuard permission={PERMISSIONS.ROLE_DELETE}>
                            {!role.isSystem && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the "{role.name}" role? This action cannot be undone.
                                      Users with this role will need to be reassigned.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteRole(role.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete Role
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </PermissionGuard>

                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Permissions: {role.userType} </span>
                          <span className="font-medium">{role.permissions.length} assigned</span>
                        </div>
                        <div className="flex flex-wrap gap-1">

                          {role.permissions.slice(0, 8).map((permission) => {
                            return (
                              <Badge key={permission.id} variant="secondary" className="text-xs">
                                {permission.name}
                              </Badge>
                            )
                          })}

                          {/* {role.permissions.slice(0, 8).map((permissionId) => {
                          const permission = permissions.find((p) => p.id === permissionId)
                          return permission ? (
                            <Badge key={permissionId} variant="secondary" className="text-xs">
                              {permission.name}
                            </Badge>
                          ) : null
                        })} */}
                          {role.permissions.length > 8 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 8} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created: {role.createdAt}</span>
                          <span>Updated: {role.updatedAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </PermissionGuard>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2 md:gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search (name, email, first/last name)..." className="pl-10 w-64" type="search"
                  value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
              </div>
              <Select value={filterByRole} onValueChange={(value) => setFilterByRole(value)}>
                <SelectTrigger className="w-48" >
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ROLES</SelectItem>
                  {roles.filter((cat) => cat !== null).map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="justify-end">
                <PermissionGuard permission={PERMISSIONS.USER_WRITE}>
                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen} >
                    <DialogTrigger asChild>
                      <Button >
                        <Plus className="h-4 w-4 mr-2" />
                        New User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-8xl max-h-[100vh] overflow-y-auto" >
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Define a user with specific permissions for your team members.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid pb-4 px-2 space-y-4 sm:h-max overflow-y-auto">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label >Person</Label>
                            <UserSelect
                              value={selectedPerson}
                              name="id"
                              onChange={setSelectedPerson}
                              placeholder="Import person info..."
                            />
                            <Button disabled={selectedPerson == null} variant={'outline'} type="button" onClick={() => setSelectedPerson(null)}>
                              Reset person
                            </Button>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="firstName">Username</Label>
                            <Input
                              id="firstName"
                              name="name"
                              type="text"
                              defaultValue={selectedUser?.name}
                              value={user?.name}
                              onChange={(e) => setUser({ ...user, name: e.target.value })}
                            />
                            <Button disabled variant={'ghost'} type="button"  >
                            </Button>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              // readOnly
                              id="firstName"
                              name="firstName"
                              type="text"
                              defaultValue={selectedUser?.firstName}
                              value={selectedPerson?.firstName}
                              onChange={(e) => setSelectedPerson((person) => person ? { ...person, firstName: e.target.value } : person)}

                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              // readOnly
                              id="lastName"
                              name="lastName"
                              defaultValue={selectedUser?.lastName}
                              value={selectedPerson?.lastName}
                              onChange={(e) => setSelectedPerson((person) => person ? { ...person, lastName: e.target.value } : person)}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select defaultValue={selectedUser?.gender} name="gender"
                              value={selectedPerson?.gender}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                {["M", "F"].map((g) => (
                                  <SelectItem key={g} value={g}>
                                    {g}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <DateSelect value={selectedPerson?.dateOfBirth ? new Date(selectedPerson.dateOfBirth) : date} onChange={setDate} />
                            <input type="hidden" name="dateOfBirth" value={date.toISOString()} />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="phone">Phone number *</Label>
                            <div className="flex">
                              <Input
                                // readOnly
                                type="tel"
                                name="phone"
                                value={selectedPerson?.phone}
                                onChange={(e) => setSelectedPerson((person) => person ? { ...person, phone: e.target.value } : person)}
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" required
                              // readOnly
                              value={selectedPerson?.email}
                              type="email"
                              onChange={(e) => setSelectedPerson((person) => person ? { ...person, email: e.target.value } : person)}
                            />
                          </div>
                          {!selectedPerson && <div className="grid gap-2">
                            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                              PIN *
                            </label>
                            <Input
                              type="password"
                              required
                              minLength={6}
                              maxLength={8}
                              pattern="[0-9]{6,8}"
                              value={user.pin}
                              onChange={(e) => setUser({ ...user, pin: e.target.value.replace(/\D/g, "") })}
                              // className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                              placeholder="Enter your PIN"
                            />
                          </div>}
                          {!selectedPerson && <div className="grid gap-2">
                            <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm PIN *
                            </label>
                            <Input
                              type="password"
                              required
                              minLength={6}
                              maxLength={8}
                              pattern="[0-9]{6,8}"
                              value={user?.confirmPin ?? ""}
                              onChange={(e) =>
                                setUser({ ...user, confirmPin: e.target.value.replace(/\D/g, "") })
                              }
                              // className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                              placeholder="Confirm your PIN"
                            />
                          </div>}
                        </div>
                        {!selectedPerson &&
                          <div className="space-y-2 flex-1">
                            <Label>Available Roles</Label>
                            <div className="border rounded-lg p-4 ">
                              {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2 mb-3">
                                  <Checkbox
                                    id={`user-${role.id}`}
                                    checked={selectedRoles.includes(role.id)}
                                    onCheckedChange={(checked) =>
                                      handleRoleChange(role.id, checked === true)
                                    }
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={`user-${role.id}`}>
                                      {role.name}
                                    </Label>
                                    <p className="text-xs text-gray-500">
                                      {role.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        }

                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleCreateUser}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </PermissionGuard>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Role Assignments</CardTitle>
              <CardDescription>Manage user role assignments and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table className="whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Failed Attempts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersFilteredByRole.map((user, idex) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium"><MySubstring item={user.name} /></TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={JSON.stringify(user.roles).includes("ROLE_ADMIN") ? "default" : "secondary"}>
                          {user.roles[0]?.name}  {user.roles.length > 1 && `[ ${user.roles.length - 1}...]`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={user.enabled ? "secondary" : "destructive"}>{user.enabled ? "Enabled" : "Disabled"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 text-center">{user.failedPinAttempts > 0 ? user.failedPinAttempts : ''}</TableCell>
                      <TableCell>
                        <PermissionGuard permission={PERMISSIONS.USER_UPDATE}>
                          <Dialog
                            open={isAssignRoleOpen && selectedUser?.id === user.id}
                            onOpenChange={(open) => {
                              setIsAssignRoleOpen(open)
                              if (!open) {
                                setSelectedUser(null)
                                setNewUserRole("")
                              }
                            }}
                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Role</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove the "{user?.name}" role? This action cannot be undone.
                                    Users with this role will need to be reassigned.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveRoleFromUser(user)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remove Role
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  const roleIds = user.roles.map((r) => r.id);
                                  setOriginalRoleIds(roleIds);
                                  setAssignRole({
                                    userId: user.id,
                                    roleIds,
                                  });
                                }}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Modify Role
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl ">
                              <DialogHeader>
                                <DialogTitle>Assign Role to {user.name}</DialogTitle>
                                <DialogDescription>
                                  Select a new role for this user. This will change their system permissions.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-4 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-2 flex-1">
                                  <Label>Current Roles</Label>
                                  <div className="border rounded-lg p-4">
                                    {assignRole && selectedUser &&
                                      roles
                                        .filter((role) => assignRole.roleIds.includes(role.id))
                                        .map((role) => (
                                          <div key={role.id} className="flex items-center space-x-2 mb-3">
                                            <Checkbox
                                              id={`current-${role.id}`}
                                              checked={true}
                                              onCheckedChange={() =>
                                                toggleRole(
                                                  role.id,
                                                  assignRole.roleIds,
                                                  (roleIds) =>
                                                    setAssignRole({
                                                      ...assignRole,
                                                      roleIds,
                                                    })
                                                )
                                              }
                                            />
                                            <div className="flex-1">
                                              <Label htmlFor={`current-${role.id}`}>
                                                {role.name}
                                              </Label>
                                              <p className="text-xs text-gray-500">
                                                {role.description}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                  </div>
                                </div>
                                <div className="space-y-2 flex-1">
                                  <Label>Available Roles</Label>
                                  <div className="border rounded-lg p-4">
                                    {assignRole && selectedUser &&
                                      roles
                                        .filter((role) => !assignRole.roleIds.includes(role.id))
                                        .map((role) => (
                                          <div key={role.id} className="flex items-center space-x-2 mb-3">
                                            <Checkbox
                                              id={`available-${role.id}`}
                                              checked={false}
                                              onCheckedChange={() =>
                                                toggleRole(
                                                  role.id,
                                                  assignRole.roleIds,
                                                  (roleIds) =>
                                                    setAssignRole({
                                                      ...assignRole,
                                                      roleIds,
                                                    })
                                                )
                                              }
                                            />
                                            <div className="flex-1">
                                              <Label htmlFor={`available-${role.id}`}>
                                                {role.name}
                                              </Label>
                                              <p className="text-xs text-gray-500">
                                                {role.description}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAssignRoleOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAssignRole} >
                                  Assign Role
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </PermissionGuard>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select defaultValue="all-categories" value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter((cat) => cat !== null).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category == 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-6">

            {categories
              .filter((cat) => cat !== "all-categories")
              .map((category, index) => {
                let categoryPermissions
                if (filterCategory == 'all') {
                  categoryPermissions = filteredPermissions.filter((p) => p.groupName === category)
                } else if (category == filterCategory) {
                  categoryPermissions = filteredPermissions.filter((p) => p.name.includes(filterCategory))
                } else { return null }
                if (categoryPermissions.length === 0) return null

                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>{category}</span>
                        <Badge variant="outline">{categoryPermissions.length} of {permissions.length} permissions</Badge>
                      </CardTitle>
                      <CardDescription>Permissions related to {category?.toLowerCase()} functionality</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {categoryPermissions.map((permission) => {
                          const rolesWithPermission = roles.filter((role) => role.permissions.some((p) => p.id === permission.id))

                          return (
                            <div
                              key={permission.id}
                              className="flex flex-wrap gap-2 items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="">
                                <h4 className="font-medium">{permission.name}</h4>
                                <p className="text-sm text-gray-600">{permission.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-sm text-gray-500">
                                  {rolesWithPermission.length} role{rolesWithPermission.length !== 1 ? "s" : ""}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {rolesWithPermission.slice(0, 6).map((role) => (
                                    <Badge key={role.id} variant="secondary" className="text-xs">
                                      {role.name}
                                    </Badge>
                                  ))}
                                  {rolesWithPermission.length > 6 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{rolesWithPermission.length - 6}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

        </TabsContent>

        <TabsContent value="permissions-group" className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  disabled
                  placeholder="Search group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {permissionsGroup?.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{group.name}</span>
                          {<Badge variant="secondary">System</Badge>}
                        </CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Permissions:</span>
                      <span className="font-medium">{group.permissions.length} permission{group.permissions.length > 2 && 's'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.permissions.slice(0, group.permissions.length).map((permission) => {
                        return (
                          <Badge key={permission.id} variant="secondary" className="text-xs">
                            {permission.name}
                          </Badge>
                        )
                      })}

                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {/* <span>Created: {role.createdAt}</span> */}
                      {/* <span>Updated: {role.updatedAt}</span> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div >
  )
}
