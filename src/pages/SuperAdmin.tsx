import { useState, useMemo } from "react";
import TopNav from "@/components/TopNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Users, Shield, Ship, Building2, Search, Plus, Edit2, Trash2, Eye, ChevronRight,
  UserCheck, UserX, Globe, Anchor, MoreHorizontal, CheckCircle2, XCircle, Clock,
} from "lucide-react";
import {
  mockRoles, mockSAUsers, mockVessels, mockCompanies, permissionModules,
  designations, departments, countries,
  type Role, type SAUser, type Vessel, type Company,
} from "@/data/superAdminData";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// ━━━━━━━━━━━ USERS TAB ━━━━━━━━━━━
function UsersTab() {
  const [users, setUsers] = useState<SAUser[]>(mockSAUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editUser, setEditUser] = useState<SAUser | null>(null);
  const [showAssignment, setShowAssignment] = useState<SAUser | null>(null);

  const filtered = useMemo(() => users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (filterStatus !== "all" && u.status !== filterStatus) return false;
    return true;
  }), [users, search, filterRole, filterStatus]);

  const statusIcon = (s: string) => s === "active" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : s === "inactive" ? <XCircle className="w-3.5 h-3.5 text-muted-foreground" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "text-primary" },
          { label: "Active", value: users.filter(u => u.status === "active").length, icon: UserCheck, color: "text-emerald-500" },
          { label: "Inactive", value: users.filter(u => u.status !== "active").length, icon: UserX, color: "text-muted-foreground" },
          { label: "On-Board", value: users.filter(u => u.userType === "On-Board").length, icon: Anchor, color: "text-blue-500" },
        ].map(s => (
          <Card key={s.label} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-44 h-9 text-sm"><SelectValue placeholder="All Roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {mockRoles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowCreateUser(true)} className="ml-auto">
          <Plus className="w-4 h-4 mr-1" /> Add User
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Vessels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u, i) => (
              <TableRow key={u.id}>
                <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{u.role}</Badge></TableCell>
                <TableCell className="text-sm">{u.company}</TableCell>
                <TableCell>
                  <Badge variant={u.userType === "On-Board" ? "default" : "outline"} className="text-xs">
                    {u.userType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button onClick={() => setShowAssignment(u)} className="text-xs text-primary hover:underline">
                    {u.assignedVessels.length} vessel{u.assignedVessels.length !== 1 ? "s" : ""}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {statusIcon(u.status)}
                    <span className="text-xs capitalize">{u.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditUser(u)}><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowAssignment(u)}><Ship className="w-3.5 h-3.5 mr-2" /> Assign Vessels</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));
                        toast({ title: `User ${u.status === "active" ? "deactivated" : "activated"}` });
                      }}>
                        {u.status === "active" ? <><UserX className="w-3.5 h-3.5 mr-2" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5 mr-2" /> Activate</>}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit User Dialog */}
      <UserFormDialog
        open={showCreateUser || !!editUser}
        onClose={() => { setShowCreateUser(false); setEditUser(null); }}
        user={editUser}
        onSave={(u) => {
          if (editUser) {
            setUsers(prev => prev.map(x => x.id === editUser.id ? { ...x, ...u } : x));
            toast({ title: "User updated successfully" });
          } else {
            setUsers(prev => [...prev, { ...u, id: `u${Date.now()}`, status: "active", assignedVessels: [], createdAt: new Date().toISOString() } as SAUser]);
            toast({ title: "User created successfully" });
          }
          setShowCreateUser(false);
          setEditUser(null);
        }}
      />

      {/* Vessel Assignment Dialog */}
      {showAssignment && (
        <VesselAssignmentDialog
          user={showAssignment}
          open={!!showAssignment}
          onClose={() => setShowAssignment(null)}
          onSave={(vesselIds) => {
            setUsers(prev => prev.map(u => u.id === showAssignment.id ? { ...u, assignedVessels: vesselIds } : u));
            toast({ title: "Vessel assignments updated" });
            setShowAssignment(null);
          }}
        />
      )}
    </div>
  );
}

// ━━━━━━━━━━━ USER FORM DIALOG ━━━━━━━━━━━
function UserFormDialog({ open, onClose, user, onSave }: { open: boolean; onClose: () => void; user: SAUser | null; onSave: (u: Partial<SAUser>) => void }) {
  const [form, setForm] = useState<Partial<SAUser>>(user || {
    name: "", email: "", username: "", designation: "", department: "",
    userType: "On-Shore", role: "", company: "", country: "",
  });

  const set = (k: keyof SAUser, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>Fill in user details. Role determines module access permissions.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Row 1: Company */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Primary Company</Label>
              <Select value={form.company || ""} onValueChange={v => set("company", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select company" /></SelectTrigger>
                <SelectContent>{mockCompanies.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Country</Label>
              <Select value={form.country || ""} onValueChange={v => set("country", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Name & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input className="h-9 text-sm" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full Name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input className="h-9 text-sm" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Email" />
            </div>
          </div>

          {/* Row 3: Username & Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Username</Label>
              <Input className="h-9 text-sm" value={form.username} onChange={e => set("username", e.target.value)} placeholder="Username" />
            </div>
            {!user && (
              <div className="space-y-1.5">
                <Label className="text-xs">Password</Label>
                <Input className="h-9 text-sm" type="password" placeholder="Set password" />
              </div>
            )}
          </div>

          {/* Row 4: User Type & Role */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">User Type</Label>
              <Select value={form.userType || "On-Shore"} onValueChange={v => set("userType", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-Shore">On-Shore</SelectItem>
                  <SelectItem value="On-Board">On-Board</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Designation</Label>
              <Select value={form.designation || ""} onValueChange={v => set("designation", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{designations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Select value={form.department || ""} onValueChange={v => set("department", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 5: Role */}
          <div className="space-y-1.5">
            <Label className="text-xs">Role</Label>
            <Select value={form.role || ""} onValueChange={v => set("role", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Assign a role" /></SelectTrigger>
              <SelectContent>{mockRoles.map(r => (
                <SelectItem key={r.id} value={r.name}>
                  <div className="flex items-center gap-2">
                    <span>{r.name}</span>
                    <span className="text-[10px] text-muted-foreground">— {r.description}</span>
                  </div>
                </SelectItem>
              ))}</SelectContent>
            </Select>
            {form.role && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Permissions inherited from role. Manage in Roles tab.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>{user ? "Update" : "Create User"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ━━━━━━━━━━━ VESSEL ASSIGNMENT DIALOG ━━━━━━━━━━━
function VesselAssignmentDialog({ user, open, onClose, onSave }: { user: SAUser; open: boolean; onClose: () => void; onSave: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(user.assignedVessels));
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const g: Record<string, Vessel[]> = {};
    mockVessels.forEach(v => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return;
      if (!g[v.company]) g[v.company] = [];
      g[v.company].push(v);
    });
    return g;
  }, [search]);

  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleCompany = (vessels: Vessel[]) => {
    const ids = vessels.map(v => v.id);
    const allSelected = ids.every(id => selected.has(id));
    setSelected(prev => {
      const n = new Set(prev);
      ids.forEach(id => allSelected ? n.delete(id) : n.add(id));
      return n;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vessel Assignment</DialogTitle>
          <DialogDescription>{user.name} — assign vessels this user can access</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search vessels..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={mockVessels.length > 0 && mockVessels.every(v => selected.has(v.id))}
              onCheckedChange={() => {
                const all = mockVessels.every(v => selected.has(v.id));
                setSelected(all ? new Set() : new Set(mockVessels.map(v => v.id)));
              }}
            />
            <span className="text-xs text-muted-foreground">Select All</span>
          </div>
        </div>

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {Object.entries(grouped).map(([company, vessels]) => (
            <div key={company} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={vessels.every(v => selected.has(v.id))}
                  onCheckedChange={() => toggleCompany(vessels)}
                />
                <span className="font-medium text-sm">{company}</span>
                <Badge variant="outline" className="text-[10px] ml-auto">{vessels.length} vessels</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vessels.map(v => (
                  <label key={v.id} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30 hover:bg-muted/60 cursor-pointer transition-colors">
                    <Checkbox checked={selected.has(v.id)} onCheckedChange={() => toggle(v.id)} />
                    <span className="text-sm">{v.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <p className="text-xs text-muted-foreground mr-auto">{selected.size} vessel{selected.size !== 1 ? "s" : ""} selected</p>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(Array.from(selected))}>Save Assignment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ━━━━━━━━━━━ ROLES TAB ━━━━━━━━━━━
function RolesTab() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Roles & Permissions</h3>
          <p className="text-xs text-muted-foreground">Define roles with granular module-level permissions</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {roles.map(role => {
          const totalPerms = Object.values(role.permissions).reduce((s, a) => s + a.length, 0);
          const totalAvail = Object.values(permissionModules).reduce((s, m) => s + m.permissions.length, 0);
          return (
            <Card key={role.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setEditRole(role)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{role.name}</CardTitle>
                  {role.isSystem && <Badge variant="outline" className="text-[10px]">System</Badge>}
                </div>
                <CardDescription className="text-xs">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{role.userCount} users</span>
                  <span>{totalPerms}/{totalAvail} permissions</span>
                </div>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(totalPerms / totalAvail) * 100}%` }} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.keys(role.permissions).slice(0, 4).map(m => (
                    <Badge key={m} variant="secondary" className="text-[10px] capitalize">{m}</Badge>
                  ))}
                  {Object.keys(role.permissions).length > 4 && (
                    <Badge variant="secondary" className="text-[10px]">+{Object.keys(role.permissions).length - 4}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role Editor */}
      <RoleEditorDialog
        open={showCreate || !!editRole}
        role={editRole}
        onClose={() => { setShowCreate(false); setEditRole(null); }}
        onSave={(r) => {
          if (editRole) {
            setRoles(prev => prev.map(x => x.id === editRole.id ? { ...x, ...r } : x));
            toast({ title: "Role updated" });
          } else {
            setRoles(prev => [...prev, { ...r, id: `r${Date.now()}`, userCount: 0, createdAt: new Date().toISOString().split("T")[0] } as Role]);
            toast({ title: "Role created" });
          }
          setShowCreate(false);
          setEditRole(null);
        }}
      />
    </div>
  );
}

// ━━━━━━━━━━━ ROLE EDITOR DIALOG ━━━━━━━━━━━
function RoleEditorDialog({ open, role, onClose, onSave }: { open: boolean; role: Role | null; onClose: () => void; onSave: (r: Partial<Role>) => void }) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [perms, setPerms] = useState<Record<string, string[]>>(role?.permissions || {});
  const [searchMod, setSearchMod] = useState("");

  const togglePerm = (mod: string, key: string) => {
    setPerms(prev => {
      const current = prev[mod] || [];
      const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
      return { ...prev, [mod]: next };
    });
  };

  const toggleModule = (mod: string) => {
    const allKeys = permissionModules[mod].permissions.map(p => p.key);
    const current = perms[mod] || [];
    const allSelected = allKeys.every(k => current.includes(k));
    setPerms(prev => ({ ...prev, [mod]: allSelected ? [] : allKeys }));
  };

  const selectAll = () => {
    const all: Record<string, string[]> = {};
    Object.entries(permissionModules).forEach(([k, v]) => { all[k] = v.permissions.map(p => p.key); });
    setPerms(all);
  };

  const filteredModules = Object.entries(permissionModules).filter(([, v]) =>
    !searchMod || v.label.toLowerCase().includes(searchMod.toLowerCase()) ||
    v.permissions.some(p => p.label.toLowerCase().includes(searchMod.toLowerCase()))
  );

  const totalPerms = Object.values(perms).reduce((s, a) => s + a.length, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? `Edit Role: ${role.name}` : "Create New Role"}</DialogTitle>
          <DialogDescription>Configure role name and select module permissions</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Role Name</Label>
              <Input className="h-9 text-sm" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fleet Manager" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Input className="h-9 text-sm" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold">Module Permissions ({totalPerms} selected)</Label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input placeholder="Search modules..." value={searchMod} onChange={e => setSearchMod(e.target.value)} className="pl-7 h-8 w-48 text-xs" />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={selectAll}>Select All</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setPerms({})}>Clear All</Button>
              </div>
            </div>

            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
              {filteredModules.map(([modKey, mod]) => {
                const current = perms[modKey] || [];
                const allSelected = mod.permissions.every(p => current.includes(p.key));
                return (
                  <div key={modKey} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox checked={allSelected} onCheckedChange={() => toggleModule(modKey)} />
                      <span className="font-medium text-sm">{mod.label}</span>
                      <Badge variant="outline" className="text-[10px] ml-auto">
                        {current.length}/{mod.permissions.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {mod.permissions.map(p => (
                        <label key={p.key} className="flex items-center gap-2 p-1.5 rounded border bg-muted/20 hover:bg-muted/50 cursor-pointer text-xs transition-colors">
                          <Checkbox checked={current.includes(p.key)} onCheckedChange={() => togglePerm(modKey, p.key)} />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ name, description, permissions: perms })} disabled={!name}>
            {role ? "Update Role" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ━━━━━━━━━━━ VESSELS TAB ━━━━━━━━━━━
function VesselsTab() {
  const [search, setSearch] = useState("");
  const filtered = mockVessels.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.company.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s: string) => s === "active" ? "bg-emerald-500" : s === "dry-dock" ? "bg-amber-500" : "bg-muted-foreground";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Vessels", value: mockVessels.length },
          { label: "Active", value: mockVessels.filter(v => v.status === "active").length },
          { label: "Dry Dock", value: mockVessels.filter(v => v.status === "dry-dock").length },
          { label: "Companies", value: mockCompanies.length },
        ].map(s => (
          <Card key={s.label} className="p-3">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search vessels..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
        </div>
        <Button size="sm" className="ml-auto"><Plus className="w-4 h-4 mr-1" /> Add Vessel</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Vessel Name</TableHead>
              <TableHead>IMO</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Flag</TableHead>
              <TableHead>Crew</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v, i) => (
              <TableRow key={v.id}>
                <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium text-sm">{v.name}</TableCell>
                <TableCell className="text-sm">{v.imo}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{v.type}</Badge></TableCell>
                <TableCell className="text-sm">{v.company}</TableCell>
                <TableCell className="text-sm">{v.flag}</TableCell>
                <TableCell className="text-sm">{v.crew}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${statusColor(v.status)}`} />
                    <span className="text-xs capitalize">{v.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ━━━━━━━━━━━ COMPANY TAB ━━━━━━━━━━━
function CompanyTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Company Management</h3>
          <p className="text-xs text-muted-foreground">Manage companies and their vessel assignments</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Company</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mockCompanies.map(c => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{c.name}</CardTitle>
                <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-[10px]">{c.status}</Badge>
              </div>
              <CardDescription className="text-xs flex items-center gap-1">
                <Globe className="w-3 h-3" /> {c.country} · {c.shortName}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Ship className="w-3 h-3" /> {c.vesselCount} vessels</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.userCount} users</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Eye className="w-3 h-3 mr-1" /> View
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━ MAIN SA PAGE ━━━━━━━━━━━
export default function SuperAdmin() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav breadcrumb="SA / Super Admin" />
      <div className="p-4 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold">Super Admin</h1>
            <p className="text-xs text-muted-foreground">Manage users, roles, vessels, and companies</p>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users" className="text-xs gap-1.5"><Users className="w-3.5 h-3.5" /> Users</TabsTrigger>
            <TabsTrigger value="roles" className="text-xs gap-1.5"><Shield className="w-3.5 h-3.5" /> Roles</TabsTrigger>
            <TabsTrigger value="vessels" className="text-xs gap-1.5"><Ship className="w-3.5 h-3.5" /> Vessels</TabsTrigger>
            <TabsTrigger value="company" className="text-xs gap-1.5"><Building2 className="w-3.5 h-3.5" /> Company</TabsTrigger>
          </TabsList>

          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="roles"><RolesTab /></TabsContent>
          <TabsContent value="vessels"><VesselsTab /></TabsContent>
          <TabsContent value="company"><CompanyTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
