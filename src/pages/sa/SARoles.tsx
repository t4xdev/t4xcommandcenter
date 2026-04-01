import { useState } from "react";
import TopNav from "@/components/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield, Search, Plus, ArrowLeft, Edit2, Users, Trash2,
} from "lucide-react";
import {
  mockRoles, permissionModules, type Role,
} from "@/data/superAdminData";
import { toast } from "@/hooks/use-toast";

type View = "list" | "create" | "edit" | "view";

function RoleEditor({ role, onSave, onCancel }: { role: Role | null; onSave: (r: Partial<Role>) => void; onCancel: () => void }) {
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
    setPerms(prev => ({ ...prev, [mod]: allKeys.every(k => current.includes(k)) ? [] : allKeys }));
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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-base font-semibold">{role ? `Edit Role: ${role.name}` : "Create New Role"}</h2>
          <p className="text-xs text-muted-foreground">Configure role name and select module permissions</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
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
            <div className="flex items-center justify-between mb-3">
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

            <div className="space-y-3">
              {filteredModules.map(([modKey, mod]) => {
                const current = perms[modKey] || [];
                const allSelected = mod.permissions.every(p => current.includes(p.key));
                return (
                  <div key={modKey} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox checked={allSelected} onCheckedChange={() => toggleModule(modKey)} />
                      <span className="font-medium text-sm">{mod.label}</span>
                      <Badge variant="outline" className="text-[10px] ml-auto">{current.length}/{mod.permissions.length}</Badge>
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

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave({ name, description, permissions: perms })} disabled={!name}>
              {role ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleDetail({ role, onBack, onEdit }: { role: Role; onBack: () => void; onEdit: () => void }) {
  const totalPerms = Object.values(role.permissions).reduce((s, a) => s + a.length, 0);
  const totalAvail = Object.values(permissionModules).reduce((s, m) => s + m.permissions.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">{role.name}</h2>
            {role.isSystem && <Badge variant="outline" className="text-[10px]">System</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{role.description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}><Edit2 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <p className="text-[11px] text-muted-foreground">Users with this role</p>
          <p className="text-xl font-bold">{role.userCount}</p>
        </Card>
        <Card className="p-3">
          <p className="text-[11px] text-muted-foreground">Permissions granted</p>
          <p className="text-xl font-bold">{totalPerms} <span className="text-sm font-normal text-muted-foreground">/ {totalAvail}</span></p>
        </Card>
        <Card className="p-3">
          <p className="text-[11px] text-muted-foreground">Modules accessed</p>
          <p className="text-xl font-bold">{Object.keys(role.permissions).length} <span className="text-sm font-normal text-muted-foreground">/ {Object.keys(permissionModules).length}</span></p>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-3">Permission Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(permissionModules).map(([modKey, mod]) => {
              const granted = role.permissions[modKey] || [];
              return (
                <div key={modKey} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{mod.label}</span>
                    <Badge variant={granted.length > 0 ? "default" : "secondary"} className="text-[10px]">
                      {granted.length}/{mod.permissions.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {mod.permissions.map(p => (
                      <div key={p.key} className={`p-1.5 rounded border text-xs ${granted.includes(p.key) ? "bg-primary/10 border-primary/30 text-foreground" : "bg-muted/20 text-muted-foreground line-through"}`}>
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SARoles() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [view, setView] = useState<View>("list");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSave = (r: Partial<Role>) => {
    if (view === "edit" && selectedRole) {
      setRoles(prev => prev.map(x => x.id === selectedRole.id ? { ...x, ...r } : x));
      toast({ title: "Role updated" });
    } else {
      setRoles(prev => [...prev, { ...r, id: `r${Date.now()}`, userCount: 0, createdAt: new Date().toISOString().split("T")[0] } as Role]);
      toast({ title: "Role created" });
    }
    setView("list");
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav breadcrumb={`SA / Roles${view === "create" ? " / New" : view === "edit" && selectedRole ? ` / ${selectedRole.name} / Edit` : view === "view" && selectedRole ? ` / ${selectedRole.name}` : ""}`} />
      <div className="p-4 max-w-[1400px] mx-auto">

        {view === "create" && <RoleEditor role={null} onSave={handleSave} onCancel={() => setView("list")} />}
        {view === "edit" && selectedRole && <RoleEditor role={selectedRole} onSave={handleSave} onCancel={() => setView("list")} />}
        {view === "view" && selectedRole && (
          <RoleDetail role={selectedRole} onBack={() => { setView("list"); setSelectedRole(null); }} onEdit={() => setView("edit")} />
        )}

        {view === "list" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">Roles & Permissions</h1>
                  <p className="text-xs text-muted-foreground">Define roles with granular module-level permissions</p>
                </div>
              </div>
              <Button size="sm" onClick={() => setView("create")}>
                <Plus className="w-4 h-4 mr-1" /> Create Role
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map(role => {
                const totalPerms = Object.values(role.permissions).reduce((s, a) => s + a.length, 0);
                const totalAvail = Object.values(permissionModules).reduce((s, m) => s + m.permissions.length, 0);
                return (
                  <Card key={role.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedRole(role); setView("view"); }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{role.name}</CardTitle>
                        {role.isSystem && <Badge variant="outline" className="text-[10px]">System</Badge>}
                      </div>
                      <CardDescription className="text-xs">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {role.userCount} users</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
