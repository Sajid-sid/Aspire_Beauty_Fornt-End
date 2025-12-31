import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "../socket";

import {
  addProductRealtime,
  updateProductRealtime,
  deleteProductRealtime,
  addVariantRealtime,
  updateVariantRealtime,
  deleteVariantRealtime,
} from "../features/products/productSlice";

const ProductsProvider = () => {
  const dispatch = useDispatch();

  // Normalize variant payload
  const normalizeVariant = (variant) => ({
    variantId: variant.variantId ?? variant.id,
    variant: variant.variant ?? variant.varient ?? "Default",
    price: variant.price ?? 0,
    stock: variant.stock ?? 0,
    product_image: variant.product_image ?? "",
    variant_image: variant.variant_image ?? "",
    ...variant,
  });

  useEffect(() => {
    // ===== PRODUCT EVENTS =====
    const onProductCreated = (product) => {
      console.log("product:created", product);
      dispatch(addProductRealtime(product));
    };

    const onProductUpdated = (product) => {
      console.log("product:updated", product);
      dispatch(updateProductRealtime(product));
    };

    const onProductDeleted = (productId) => {
      console.log("product:deleted", productId);
      dispatch(deleteProductRealtime(productId));
    };

    // ===== VARIANT EVENTS =====
    const onVariantCreated = (variant) => {
      console.log("variant:created", variant);
      dispatch(
        addVariantRealtime({
          productId: variant.productid,
          variant: normalizeVariant(variant),
        })
      );
    };

    const onVariantUpdated = (variant) => {
      console.log("variant:updated", variant);
      dispatch(
        updateVariantRealtime({
          productId: variant.productid,
          variant: normalizeVariant(variant),
        })
      );
    };

    const onVariantDeleted = (variant) => {
      console.log("variant:deleted", variant);
      console.log("🔥 SOCKET variant:deleted RECEIVED");
      const variantId = variant.variantId ?? variant.id;
      dispatch(
        deleteVariantRealtime({
          productId: variant.productid,
          variantId,
        })
      );
    };

    // ===== SOCKET CONNECTION EVENTS =====
    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("connect_error", (err) =>
      console.error("Socket connect error:", err.message)
    );

    // ===== REGISTER SOCKET EVENTS =====
    socket.on("product:created", onProductCreated);
    socket.on("product:updated", onProductUpdated);
    socket.on("product:deleted", onProductDeleted);

    socket.on("variant:created", onVariantCreated);
    socket.on("variant:updated", onVariantUpdated);
    socket.on("variant:deleted", onVariantDeleted);

    // ===== CLEANUP =====
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");

      socket.off("product:created", onProductCreated);
      socket.off("product:updated", onProductUpdated);
      socket.off("product:deleted", onProductDeleted);

      socket.off("variant:created", onVariantCreated);
      socket.off("variant:updated", onVariantUpdated);
      socket.off("variant:deleted", onVariantDeleted);
    };
  }, [dispatch]);

  return null;
};

export default ProductsProvider;
