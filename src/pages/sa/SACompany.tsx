import { useState } from "react";
import TopNav from "@/components/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Building2, Globe, Ship, Users, Plus, ArrowLeft, Edit2, Eye, Search, Upload, Palette,
} from "lucide-react";
import { mockCompanies, mockVessels, mockSAUsers, countries, type Company } from "@/data/superAdminData";
import { toast } from "@/hooks/use-toast";

type View = "list" | "create" | "edit" | "view";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const yearPrefixFormats = ["None", "FY", "CY", "YR"];
const controllingScopes = ["Vessel wise controlling", "Company wise controlling", "Fleet wise controlling"];

function CompanyForm({ company, onSave, onCancel }: { company: Company | null; onSave: (c: Partial<Company>) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<Company>>(company || {
    name: "", shortName: "", country: "", status: "active",
    fiscalStartMonth: "Jan", yearPrefixFormat: "None",
    controllingScope: "Vessel wise controlling", companyColor: "#1a365d",
  });
  const set = (k: keyof Company, v: string | number) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h2 className="text-base font-semibold">{company ? "Edit Company" : "Add New Company"}</h2>
          <p className="text-xs text-muted-foreground">Enter company details and configuration</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-5">
            {/* Basic */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Company Name</Label><Input className="h-9 text-sm" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Company Name" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Short Name</Label><Input className="h-9 text-sm" value={form.shortName} onChange={e => set("shortName", e.target.value)} placeholder="Short Name" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Country</Label>
                  <Select value={form.country || ""} onValueChange={v => set("country", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select value={form.status || "active"} onValueChange={v => set("status", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Fiscal & Config */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fiscal & Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Fiscal Start Month</Label>
                  <Select value={form.fiscalStartMonth || "Jan"} onValueChange={v => set("fiscalStartMonth", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Year Prefix Format</Label>
                  <Select value={form.yearPrefixFormat || "None"} onValueChange={v => set("yearPrefixFormat", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{yearPrefixFormats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Controlling Scope</Label>
                  <Select value={form.controllingScope || "Vessel wise controlling"} onValueChange={v => set("controllingScope", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{controllingScopes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Company Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      className="h-9 w-14 p-1 cursor-pointer"
                      value={form.companyColor || "#1a365d"}
                      onChange={e => set("companyColor", e.target.value)}
                    />
                    <Input className="h-9 text-sm flex-1" value={form.companyColor || "#1a365d"} onChange={e => set("companyColor", e.target.value)} placeholder="#000000" />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Logos */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Branding</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Company Logo (Main)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs">Click or Drop file</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Company Logo (PDF Right)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs">Click or Drop file</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(form)}>{company ? "Update Company" : "Add Company"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CompanyDetail({ company, onBack, onEdit }: { company: Company; onBack: () => void; onEdit: () => void }) {
  const companyVessels = mockVessels.filter(v => v.company === company.name);
  const companyUsers = mockSAUsers.filter(u => u.company === company.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">{company.name}</h2>
            <Badge variant={company.status === "active" ? "default" : "secondary"} className="text-[10px]">{company.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{company.shortName} · {company.country}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}><Edit2 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3"><p className="text-[11px] text-muted-foreground">Vessels</p><p className="text-xl font-bold">{companyVessels.length}</p></Card>
        <Card className="p-3"><p className="text-[11px] text-muted-foreground">Users</p><p className="text-xl font-bold">{companyUsers.length}</p></Card>
        <Card className="p-3"><p className="text-[11px] text-muted-foreground">Fiscal Start</p><p className="text-xl font-bold">{company.fiscalStartMonth}</p></Card>
        <Card className="p-3">
          <p className="text-[11px] text-muted-foreground">Company Color</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded border" style={{ backgroundColor: company.companyColor }} />
            <span className="text-sm font-medium">{company.companyColor}</span>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Configuration</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><p className="text-[11px] text-muted-foreground">Controlling Scope</p><p className="text-sm font-medium">{company.controllingScope}</p></div>
            <div><p className="text-[11px] text-muted-foreground">Year Prefix Format</p><p className="text-sm font-medium">{company.yearPrefixFormat}</p></div>
            <div><p className="text-[11px] text-muted-foreground">Country</p><p className="text-sm font-medium">{company.country}</p></div>
          </div>
        </CardContent>
      </Card>

      {companyVessels.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Vessels</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {companyVessels.map(v => (
                <div key={v.id} className="flex items-center gap-2 p-2 rounded border text-xs">
                  <Ship className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{v.name}</span>
                  <Badge variant="outline" className="text-[10px] ml-auto">{v.type}</Badge>
                  <div className={`w-2 h-2 rounded-full ${v.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {companyUsers.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Users</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {companyUsers.map(u => (
                <div key={u.id} className="flex items-center gap-2 p-2 rounded border text-xs">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{u.name}</span>
                  <Badge variant="secondary" className="text-[10px] ml-auto">{u.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SACompany() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [view, setView] = useState<View>("list");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [search, setSearch] = useState("");

  const filtered = companies.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (c: Partial<Company>) => {
    if (view === "edit" && selectedCompany) {
      setCompanies(prev => prev.map(x => x.id === selectedCompany.id ? { ...x, ...c } : x));
      toast({ title: "Company updated" });
    } else {
      setCompanies(prev => [...prev, { ...c, id: `c${Date.now()}`, vesselCount: 0, userCount: 0 } as Company]);
      toast({ title: "Company added" });
    }
    setView("list");
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav breadcrumb={`SA / Company${view === "create" ? " / New" : view === "edit" && selectedCompany ? ` / ${selectedCompany.name} / Edit` : view === "view" && selectedCompany ? ` / ${selectedCompany.name}` : ""}`} />
      <div className="p-4 max-w-[1400px] mx-auto">
        {view === "create" && <CompanyForm company={null} onSave={handleSave} onCancel={() => setView("list")} />}
        {view === "edit" && selectedCompany && <CompanyForm company={selectedCompany} onSave={handleSave} onCancel={() => setView("list")} />}
        {view === "view" && selectedCompany && <CompanyDetail company={selectedCompany} onBack={() => { setView("list"); setSelectedCompany(null); }} onEdit={() => setView("edit")} />}

        {view === "list" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <h1 className="text-lg font-bold">Company Management</h1>
                  <p className="text-xs text-muted-foreground">Manage companies and their vessel assignments</p>
                </div>
              </div>
              <Button size="sm" onClick={() => setView("create")}><Plus className="w-4 h-4 mr-1" /> Add Company</Button>
            </div>

            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map(c => (
                <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedCompany(c); setView("view"); }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: c.companyColor }} />
                        <CardTitle className="text-sm">{c.name}</CardTitle>
                      </div>
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
                      <span className="ml-auto">FY: {c.fiscalStartMonth}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={e => { e.stopPropagation(); setSelectedCompany(c); setView("view"); }}>
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={e => { e.stopPropagation(); setSelectedCompany(c); setView("edit"); }}>
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
