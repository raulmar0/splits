"use client";

import { useState } from "react";
import { TopBar } from "@/components/shell";
import { Button } from "@/components/ui";
import { TabNav, StructureTab, ImportTab, ExportTab, LivePreview } from "@/components/manual";

const TABS = [
  { id: "estructura", label: "Estructura" },
  { id: "importar", label: "Importar" },
  { id: "exportar", label: "Exportar" },
];

export default function NewActivityPage() {
  const [activeTab, setActiveTab] = useState("estructura");

  return (
    <>
      <TopBar
        subtitle="ACTIVIDADES · NUEVA"
        title="Crear entrenamiento"
        right={
          <>
            <Button variant="ghost">Cancelar</Button>
            <Button variant="default">Guardar borrador</Button>
            <Button variant="primary">Guardar y planificar</Button>
          </>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-5">
          <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
          <div className="mt-6">
            {activeTab === "estructura" && <StructureTab />}
            {activeTab === "importar" && <ImportTab />}
            {activeTab === "exportar" && <ExportTab />}
          </div>
        </div>
        <LivePreview />
      </div>
    </>
  );
}
