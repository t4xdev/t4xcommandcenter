import { useState } from "react";
import TopNav from "@/components/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Ship, Search, Plus, ArrowLeft, Edit2, Eye, Anchor, Users, Upload,
} from "lucide-react";
import { mockVessels, mockCompanies, vesselTypes, flags, fuelTypes, countries, type Vessel } from "@/data/superAdminData";
import { toast } from "@/hooks/use-toast";

type View = "list" | "create" | "edit" | "view";

function VesselForm({ vessel, onSave, onCancel }: { vessel: Vessel | null; onSave: (v: Partial<Vessel>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<Vessel>>(vessel || {
    name: "", shortName: "", imo: "", callSign: "", officialNo: "", mmsi: "", portOfRegistry: "",
    type: "", company: "", flag: "", nationality: "", fuelType: "",
    lengthOverall: "", lengthPerpendicular: "", deckMainArea: "", deckArea: "", designDraft: "",
    deadWeight: "", grossTonnage: "", netTonnage: "", cargoDeckArea: "", deckStrength: "",
    vesselEmail: "", status: "active", crew: 0,
  });
  const set = (k: keyof Vessel, v: string | number) => setForm(prev => ({ ...prev, [k]: v }));
  const field = (label: string, key: keyof Vessel, placeholder?: string) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input className="h-9 text-sm" value={(form as any)[key] || ""} onChange={e => set(key, e.target.value)} placeholder={placeholder || label} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h2 className="text-base font-semibold">{vessel ? "Edit Vessel" : "Add New Vessel"}</h2>
          <p className="text-xs text-muted-foreground">Enter vessel registration and technical details</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-5 max-w-4xl">
            {/* Basic Info */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Company</Label>
                  <Select value={form.company || ""} onValueChange={v => set("company", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select company" /></SelectTrigger>
                    <SelectContent>{mockCompanies.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {field("Vessel Name", "name")}
                {field("Short Name", "shortName")}
              </div>
            </div>

            <Separator />

            {/* Registration */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Registration Details</h3>
              <div className="grid grid-cols-3 gap-4">
                {field("IMO No", "imo")}
                {field("Call Sign", "callSign")}
                {field("Official No", "officialNo")}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {field("MMSI", "mmsi")}
                {field("Port of Registry", "portOfRegistry")}
                <div className="space-y-1.5">
                  <Label className="text-xs">Vessel Type</Label>
                  <Select value={form.type || ""} onValueChange={v => set("type", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{vesselTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Flag</Label>
                  <Select value={form.flag || ""} onValueChange={v => set("flag", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select flag" /></SelectTrigger>
                    <SelectContent>{flags.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Nationality</Label>
                  <Select value={form.nationality || ""} onValueChange={v => set("nationality", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select nationality" /></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Fuel Type</Label>
                  <Select value={form.fuelType || ""} onValueChange={v => set("fuelType", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select fuel type" /></SelectTrigger>
                    <SelectContent>{fuelTypes.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dimensions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dimensions & Tonnage</h3>
              <div className="grid grid-cols-3 gap-4">
                {field("Length Overall (m)", "lengthOverall")}
                {field("Length Perpendicular (m)", "lengthPerpendicular")}
                {field("Deck Main Area (m²)", "deckMainArea")}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {field("Deck Area (m²)", "deckArea")}
                {field("Design Draft (m)", "designDraft")}
                {field("Dead Weight (MT)", "deadWeight")}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {field("Gross Tonnage", "grossTonnage")}
                {field("Net Tonnage", "netTonnage")}
                {field("Cargo Deck Area (m²)", "cargoDeckArea")}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {field("Deck Strength (t/m²)", "deckStrength")}
                {field("Vessel Email", "vesselEmail")}
              </div>
            </div>

            <Separator />

            {/* Status & Image */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Status & Media</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Crew Count</Label>
                  <Input className="h-9 text-sm" type="number" value={form.crew} onChange={e => set("crew", parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status || "active"} onValueChange={v => set("status", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="laid-up">Laid Up</SelectItem>
                      <SelectItem value="dry-dock">Dry Dock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Upload Vessel Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs">Click or Drop file</span>
                  </div>
                </div>
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
  const sections = [
    { title: "Basic Information", items: [
      { label: "Company", value: vessel.company },
      { label: "Short Name", value: vessel.shortName },
      { label: "Status", value: vessel.status },
    ]},
    { title: "Registration", items: [
      { label: "IMO", value: vessel.imo },
      { label: "Call Sign", value: vessel.callSign },
      { label: "Official No", value: vessel.officialNo },
      { label: "MMSI", value: vessel.mmsi },
      { label: "Port of Registry", value: vessel.portOfRegistry },
      { label: "Vessel Type", value: vessel.type },
      { label: "Flag", value: vessel.flag },
      { label: "Nationality", value: vessel.nationality },
      { label: "Fuel Type", value: vessel.fuelType },
    ]},
    { title: "Dimensions & Tonnage", items: [
      { label: "Length Overall", value: vessel.lengthOverall ? `${vessel.lengthOverall} m` : "" },
      { label: "Length Perpendicular", value: vessel.lengthPerpendicular ? `${vessel.lengthPerpendicular} m` : "" },
      { label: "Deck Main Area", value: vessel.deckMainArea ? `${vessel.deckMainArea} m²` : "" },
      { label: "Deck Area", value: vessel.deckArea ? `${vessel.deckArea} m²` : "" },
      { label: "Design Draft", value: vessel.designDraft ? `${vessel.designDraft} m` : "" },
      { label: "Dead Weight", value: vessel.deadWeight ? `${vessel.deadWeight} MT` : "" },
      { label: "Gross Tonnage", value: vessel.grossTonnage },
      { label: "Net Tonnage", value: vessel.netTonnage },
      { label: "Cargo Deck Area", value: vessel.cargoDeckArea ? `${vessel.cargoDeckArea} m²` : "" },
      { label: "Deck Strength", value: vessel.deckStrength ? `${vessel.deckStrength} t/m²` : "" },
    ]},
    { title: "Other", items: [
      { label: "Vessel Email", value: vessel.vesselEmail },
      { label: "Crew", value: vessel.crew.toString() },
    ]},
  ];

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
      {sections.map(section => (
        <Card key={section.title}>
          <CardContent className="pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section.title}</h3>
            <div className="grid grid-cols-3 gap-3">
              {section.items.filter(i => i.value).map(item => (
                <div key={item.label}>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
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
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setSelectedVessel(v); setView("view"); }}><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setSelectedVessel(v); setView("edit"); }}><Edit2 className="w-3.5 h-3.5" /></Button>
                        </div>
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
