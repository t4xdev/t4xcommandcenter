import { useState } from "react";
import TopNav from "@/components/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Ship, Search, Plus, ArrowLeft, Edit2, Eye, MoreHorizontal, Anchor, Users,
} from "lucide-react";
import { mockVessels, mockCompanies, type Vessel } from "@/data/superAdminData";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

type View = "list" | "create" | "edit" | "view";

function VesselForm({ vessel, onSave, onCancel }: { vessel: Vessel | null; onSave: (v: Partial<Vessel>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<Vessel>>(vessel || { name: "", imo: "", type: "", company: "", flag: "", status: "active", crew: 0 });
  const set = (k: keyof Vessel, v: string | number) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h2 className="text-base font-semibold">{vessel ? "Edit Vessel" : "Add New Vessel"}</h2>
          <p className="text-xs text-muted-foreground">Enter vessel details</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 max-w-3xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Vessel Name</Label><Input className="h-9 text-sm" value={form.name} onChange={e => set("name", e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">IMO Number</Label><Input className="h-9 text-sm" value={form.imo} onChange={e => set("imo", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Type</Label>
                <Select value={form.type || ""} onValueChange={v => set("type", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {["Bulk Carrier", "Tanker", "Container", "Tug", "Shore Office"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Company</Label>
                <Select value={form.company || ""} onValueChange={v => set("company", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>{mockCompanies.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Flag</Label><Input className="h-9 text-sm" value={form.flag} onChange={e => set("flag", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Crew Count</Label><Input className="h-9 text-sm" type="number" value={form.crew} onChange={e => set("crew", parseInt(e.target.value) || 0)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Status</Label>
                <Select value={form.status || "active"} onValueChange={v => set("status", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="laid-up">Laid Up</SelectItem>
                    <SelectItem value="dry-dock">Dry Dock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(form)}>{vessel ? "Update Vessel" : "Add Vessel"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VesselDetail({ vessel, onBack, onEdit }: { vessel: Vessel; onBack: () => void; onEdit: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="flex-1">
          <h2 className="text-base font-semibold">{vessel.name}</h2>
          <p className="text-xs text-muted-foreground">IMO: {vessel.imo} · {vessel.company}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}><Edit2 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Type", value: vessel.type },
          { label: "Flag", value: vessel.flag },
          { label: "Crew", value: vessel.crew.toString() },
          { label: "Company", value: vessel.company },
          { label: "Status", value: vessel.status },
          { label: "IMO", value: vessel.imo },
        ].map(item => (
          <Card key={item.label} className="p-3">
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium capitalize">{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function SAVessels() {
  const [vessels, setVessels] = useState<Vessel[]>(mockVessels);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<View>("list");
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const filtered = vessels.filter(v => !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.company.toLowerCase().includes(search.toLowerCase()));
  const statusColor = (s: string) => s === "active" ? "bg-emerald-500" : s === "dry-dock" ? "bg-amber-500" : "bg-muted-foreground";

  const handleSave = (v: Partial<Vessel>) => {
    if (view === "edit" && selectedVessel) {
      setVessels(prev => prev.map(x => x.id === selectedVessel.id ? { ...x, ...v } : x));
      toast({ title: "Vessel updated" });
    } else {
      setVessels(prev => [...prev, { ...v, id: `v${Date.now()}` } as Vessel]);
      toast({ title: "Vessel added" });
    }
    setView("list");
    setSelectedVessel(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav breadcrumb={`SA / Vessels${view === "create" ? " / New" : view === "edit" && selectedVessel ? ` / ${selectedVessel.name} / Edit` : view === "view" && selectedVessel ? ` / ${selectedVessel.name}` : ""}`} />
      <div className="p-4 max-w-[1400px] mx-auto">

        {view === "create" && <VesselForm vessel={null} onSave={handleSave} onCancel={() => setView("list")} />}
        {view === "edit" && selectedVessel && <VesselForm vessel={selectedVessel} onSave={handleSave} onCancel={() => setView("list")} />}
        {view === "view" && selectedVessel && <VesselDetail vessel={selectedVessel} onBack={() => { setView("list"); setSelectedVessel(null); }} onEdit={() => setView("edit")} />}

        {view === "list" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Ship className="w-5 h-5 text-primary" />
              <div>
                <h1 className="text-lg font-bold">Vessel Management</h1>
                <p className="text-xs text-muted-foreground">Manage fleet vessels and their assignments</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Total Vessels", value: vessels.length, icon: Ship },
                { label: "Active", value: vessels.filter(v => v.status === "active").length, icon: Anchor },
                { label: "Dry Dock", value: vessels.filter(v => v.status === "dry-dock").length, icon: Ship },
                { label: "Companies", value: mockCompanies.length, icon: Users },
              ].map(s => (
                <Card key={s.label} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      <p className="text-xl font-bold">{s.value}</p>
                    </div>
                    <s.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search vessels..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
              </div>
              <Button size="sm" onClick={() => setView("create")} className="ml-auto"><Plus className="w-4 h-4 mr-1" /> Add Vessel</Button>
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
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((v, i) => (
                    <TableRow key={v.id} className="cursor-pointer" onClick={() => { setSelectedVessel(v); setView("view"); }}>
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
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => e.stopPropagation()}><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedVessel(v); setView("view"); }}><Eye className="w-3.5 h-3.5 mr-2" /> View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedVessel(v); setView("edit"); }}><Edit2 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
