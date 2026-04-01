import { Navigate, Route, Routes } from "react-router-dom";
import SAUsers from "./sa/SAUsers";
import SARoles from "./sa/SARoles";
import SAVessels from "./sa/SAVessels";
import SACompany from "./sa/SACompany";

export default function SuperAdmin() {
  return (
    <Routes>
      <Route index element={<Navigate to="users" replace />} />
      <Route path="users" element={<SAUsers />} />
      <Route path="roles" element={<SARoles />} />
      <Route path="vessels" element={<SAVessels />} />
      <Route path="company" element={<SACompany />} />
    </Routes>
  );
}
