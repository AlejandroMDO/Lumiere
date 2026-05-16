import { z } from "zod";

// Validación estricta para agregar productos al carrito
export const CartItemSchema = z.object({
  productId: z.string().cuid({ message: "ID de producto estructuralmente inválido." }),
  quantity: z.number().int().min(1, { message: "La cantidad mínima permitida es 1." }),
});

// Validación para el Merge Dual de Carritos (localStorage -> PostgreSQL)
export const SyncCartSchema = z.array(CartItemSchema);

// Validación para el formulario de envíos (Checkout)
export const CheckoutShippingSchema = z.object({
  email: z.string().email({ message: "Formato de correo electrónico inválido." }),
  name: z.string().min(2, { message: "El nombre debe contener al menos 2 caracteres." }),
  address: z.string().min(10, { message: "Dirección de envío incompleta o inválida." }),
  city: z.string().min(2, { message: "Ciudad inválida." }),
  country: z.enum(["ES", "EN"], { message: "Región lingüística/logística no soportada." }),
});

// Validación para reseñas del producto (Social Proof)
export const ReviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5, { message: "La calificación debe estar entre 1 y 5 estrellas." }),
  comment: z.string().max(1000, { message: "El comentario no puede superar los 1000 caracteres." }).optional(),
});