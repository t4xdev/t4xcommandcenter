import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Users, Shield, Ship, Search, Plus, Edit2, Eye,
  UserCheck, UserX, Anchor, MoreHorizontal, CheckCircle2, XCircle, Clock, ArrowLeft,
} from "lucide-react";
import {
  mockRoles, mockSAUsers, mockVessels, mockCompanies, permissionModules,
  designations, departments, countries,
  type SAUser, type Vessel,
} from "@/data/superAdminData";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// ── Vessel Assignment Dialog ──
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
                <Checkbox checked={vessels.every(v => selected.has(v.id))} onCheckedChange={() => toggleCompany(vessels)} />
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

// ── User Form (inline page, not dialog) ──
function UserForm({ user, onSave, onCancel }: { user: SAUser | null; onSave: (u: Partial<SAUser>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<SAUser>>(user || {
    name: "", email: "", username: "", designation: "", department: "",
    userType: "On-Shore", role: "", company: "", country: "",
  });
  const set = (k: keyof SAUser, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-base font-semibold">{user ? "Edit User" : "Create New User"}</h2>
          <p className="text-xs text-muted-foreground">Fill in user details. Role determines module access permissions.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-5 max-w-3xl">
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input className="h-9 text-sm" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full Name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input className="h-9 text-sm" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="Email" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
            </div>
            <div className="grid grid-cols-3 gap-4">
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
              </div>
            </div>
            {form.role && (
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium mb-1">Permissions inherited from "{form.role}" role:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(mockRoles.find(r => r.name === form.role)?.permissions || {}).map(m => (
                    <Badge key={m} variant="secondary" className="text-[10px] capitalize">{m}</Badge>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  To change permissions, edit the role from SA → Roles.
                </p>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(form)}>{user ? "Update User" : "Create User"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── User Detail View ──
function UserDetail({ user, onBack, onEdit, onAssignVessels }: { user: SAUser; onBack: () => void; onEdit: () => void; onAssignVessels: () => void }) {
  const role = mockRoles.find(r => r.name === user.role);
  const vessels = mockVessels.filter(v => user.assignedVessels.includes(v.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-base font-semibold">{user.name}</h2>
          <p className="text-xs text-muted-foreground">{user.email} · {user.username}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}><Edit2 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Company</span><span className="text-xs font-medium">{user.company}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Designation</span><span className="text-xs font-medium">{user.designation}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Department</span><span className="text-xs font-medium">{user.department}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Country</span><span className="text-xs font-medium">{user.country}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Type</span><Badge variant={user.userType === "On-Board" ? "default" : "outline"} className="text-[10px]">{user.userType}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground text-xs">Status</span>
              <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-[10px] capitalize">{user.status}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role & Permissions</h3>
          </div>
          <Badge variant="secondary">{user.role}</Badge>
          {role && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{role.description}</p>
              <div className="space-y-1">
                {Object.entries(role.permissions).map(([mod, perms]) => (
                  <div key={mod} className="flex items-center justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{mod}</span>
                    <Badge variant="outline" className="text-[10px]">{perms.length} perms</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned Vessels</h3>
            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={onAssignVessels}>Edit</Button>
          </div>
          {vessels.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No vessels assigned</p>
          ) : (
            <div className="space-y-1.5">
              {vessels.map(v => (
                <div key={v.id} className="flex items-center gap-2 p-1.5 rounded border text-xs">
                  <Ship className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{v.name}</span>
                  <span className="text-muted-foreground ml-auto">{v.type}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ── Main Page ──
type View = "list" | "create" | "edit" | "view";

export default function SAUsers() {
  const [users, setUsers] = useState<SAUser[]>(mockSAUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState<View>("list");
  const [selectedUser, setSelectedUser] = useState<SAUser | null>(null);
  const [showAssignment, setShowAssignment] = useState<SAUser | null>(null);

  const filtered = useMemo(() => users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (filterStatus !== "all" && u.status !== filterStatus) return false;
    return true;
  }), [users, search, filterRole, filterStatus]);

  const statusIcon = (s: string) => s === "active" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : s === "inactive" ? <XCircle className="w-3.5 h-3.5 text-muted-foreground" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />;

  const handleSave = (u: Partial<SAUser>) => {
    if (view === "edit" && selectedUser) {
      setUsers(prev => prev.map(x => x.id === selectedUser.id ? { ...x, ...u } : x));
      toast({ title: "User updated successfully" });
    } else {
      const newUser = { ...u, id: `u${Date.now()}`, status: "active" as const, assignedVessels: [], createdAt: new Date().toISOString() } as SAUser;
      setUsers(prev => [...prev, newUser]);
      toast({ title: "User created successfully" });
    }
    setView("list");
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav breadcrumb={`SA / Users${view === "create" ? " / New" : view === "edit" && selectedUser ? ` / ${selectedUser.name} / Edit` : view === "view" && selectedUser ? ` / ${selectedUser.name}` : ""}`} />
      <div className="p-4 max-w-[1400px] mx-auto">

        {view === "create" && (
          <UserForm user={null} onSave={handleSave} onCancel={() => setView("list")} />
        )}

        {view === "edit" && selectedUser && (
          <UserForm user={selectedUser} onSave={handleSave} onCancel={() => setView("list")} />
        )}

        {view === "view" && selectedUser && (
          <UserDetail
            user={selectedUser}
            onBack={() => { setView("list"); setSelectedUser(null); }}
            onEdit={() => setView("edit")}
            onAssignVessels={() => setShowAssignment(selectedUser)}
          />
        )}

        {view === "list" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <h1 className="text-lg font-bold">User Management</h1>
                <p className="text-xs text-muted-foreground">Create, edit, and manage system users</p>
              </div>
            </div>

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
              <Button size="sm" onClick={() => setView("create")} className="ml-auto">
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
                    <TableRow key={u.id} className="cursor-pointer" onClick={() => { setSelectedUser(u); setView("view"); }}>
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
                        <Badge variant={u.userType === "On-Board" ? "default" : "outline"} className="text-xs">{u.userType}</Badge>
                      </TableCell>
                      <TableCell>
                        <button onClick={(e) => { e.stopPropagation(); setShowAssignment(u); }} className="text-xs text-primary hover:underline">
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
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => e.stopPropagation()}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedUser(u); setView("view"); }}>
                              <Eye className="w-3.5 h-3.5 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedUser(u); setView("edit"); }}>
                              <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { setShowAssignment(u); }}>
                              <Ship className="w-3.5 h-3.5 mr-2" /> Assign Vessels
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: x.status === "active" ? "inactive" as const : "active" as const } : x));
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
          </div>
        )}

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
    </div>
  );
}
