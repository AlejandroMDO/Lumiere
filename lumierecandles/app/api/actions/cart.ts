"use server";

import { prisma } from "@/lib/prisma";
import { SyncCartSchema } from "@/lib/validations/lumiere";
import { auth } from "@/auth"; // Integración con el sistema de Auth lícito

export async function syncUserCart(rawItems: unknown) {
  try {
    // 1. Validar la sesión en el servidor
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autenticado", code: 401 };
    }

    // 2. Validar el payload con Zod
    const parsed = SyncCartSchema.safeParse(rawItems);
    if (!parsed.success) {
      return { success: false, error: parsed.error.format(), code: 400 };
    }

    const itemsToSync = parsed.data;

    // 3. Buscar si el usuario ya posee un carrito en la DB
    const existingCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (existingCart) {
      // Lógica de Merge: Combinar duplicados sumando cantidades
      const currentDbItems = existingCart.items as Array<{ productId: string; quantity: number }>;
      const mergedMap = new Map<string, number>();

      // Hidratar con lo que ya está en base de datos
      currentDbItems.forEach(item => mergedMap.set(item.productId, item.quantity));
      // Sumar o agregar lo que viene del caché del cliente (localStorage)
      itemsToSync.forEach(item => {
        const exist = mergedMap.get(item.productId) || 0;
        mergedMap.set(item.productId, exist + item.quantity);
      });

      const updatedItems = Array.from(mergedMap.entries()).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

      await prisma.cart.update({
        where: { userId: session.user.id },
        data: { items: updatedItems, updatedAt: new Date() },
      });
    } else {
      // Si no existe, crear un nuevo registro de carrito para el cliente
      await prisma.cart.create({
        data: {
          userId: session.user.id,
          items: itemsToSync,
        },
      });
    }

    return { success: true, message: "Carrito sincronizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error crítico interno en el servidor.", code: 500 };
  }
}