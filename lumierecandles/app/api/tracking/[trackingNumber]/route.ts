import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { trackingNumber: string } }
) {
  const trackingNumber = params.trackingNumber;

  if (!trackingNumber || trackingNumber.length < 5) {
    return NextResponse.json({ error: "Número de seguimiento inválido estructuralmente." }, { status: 400 });
  }

  try {
    // 1. Simulación lícita de consumo a la API externa del proveedor logístico (e.g., Shippo/DHL)
    // En producción, aquí se usa fetch(`https://api.shippo.com/tracks/${trackingNumber}`, { headers: ... })
    const mockLogisticsPayload = {
      carrier: "DHL Express",
      status: "IN_TRANSIT",
      checkpoints: [
        { location: "Madrid, ES", date: "2026-05-15T10:00:00Z", message: "Envío recolectado en el laboratorio de aromas." },
        { location: "Zaragoza, ES", date: "2026-05-16T08:30:00Z", message: "En tránsito en centro de distribución macro." }
      ]
    };

    // 2. Retornar estructura limpia y predecible para el mapeo del frontend de Aria
    return NextResponse.json({
      success: true,
      trackingNumber,
      provider: mockLogisticsPayload.carrier,
      globalStatus: mockLogisticsPayload.status,
      timeline: mockLogisticsPayload.checkpoints,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error al consultar la pasarela logística externa." }, { status: 500 });
  }
}