"use server";

import { prisma } from "@/lib/prisma";
import { CheckoutShippingSchema } from "@/lib/validations/lumiere";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia", // API estable de Stripe
});

export async function createCheckoutSession(shippingData: unknown, cartItems: Array<{ productId: string; quantity: number }>) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Debe iniciar sesión para comprar.", code: 401 };

    const parsedShipping = CheckoutShippingSchema.safeParse(shippingData);
    if (!parsedShipping.success) return { success: false, error: "Datos de envío inválidos.", code: 400 };

    if (!cartItems || cartItems.length === 0) return { success: false, error: "El carrito está vacío.", code: 400 };

    let totalCalculated = 0;
    const lineItemsForStripe = [];
    const dbOrderItemsData = [];

    // Validar precios directo contra nuestra Fuente de Verdad (PostgreSQL), evitando alteraciones del cliente
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { translations: { where: { language: parsedShipping.data.country === "ES" ? "ES" : "EN" } } }
      });

      if (!product || product.stock < item.quantity) {
        return { success: false, error: `Producto no disponible o stock insuficiente.`, code: 404 };
      }

      const priceInCents = Math.round(Number(product.price) * 100);
      totalCalculated += Number(product.price) * item.quantity;

      lineItemsForStripe.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.translations[0]?.title || "Lumière Candle",
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      });

      dbOrderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    // 1. Crear pre-orden en PostgreSQL con estatus PENDING
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        total: totalCalculated,
        items: {
          create: dbOrderItemsData.map(item => ({
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
            product: { connect: { id: item.productId } }
          }))
        }
      }
    });

    // 2. Levantar la sesión en Stripe vinculando el ID de nuestra orden
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItemsForStripe,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${parsedShipping.data.country.toLowerCase()}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${parsedShipping.data.country.toLowerCase()}/checkout/carrito`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    });

    // 3. Guardar el stripeSessionId en la orden para conciliación del Webhook
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return { success: true, url: stripeSession.url };
  } catch (error) {
    return { success: false, error: "Error en la inicialización de la pasarela segura.", code: 500 };
  }
}