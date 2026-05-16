import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    // Verificar firma criptográfica del Webhook para comprobar procedencia legal
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error Criptográfico: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      // Ejecutar actualización de estado y reducción de stock en una transacción atómica de base de datos
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order || order.status === "PAID") return;

        // 1. Cambiar estado del pedido
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID", updatedAt: new Date() },
        });

        // 2. Descontar stock por cada artículo del catálogo comprado
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }

        // 3. Vaciar el carrito persistente del usuario en PostgreSQL
        await tx.cart.deleteMany({
          where: { userId: order.userId },
        });
      });
    }
  }

  return new NextResponse("Evento procesado y conciliado de manera exitosa.", { status: 200 });
}