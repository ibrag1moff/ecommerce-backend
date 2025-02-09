// Auth
export type SignUpRequest = {
  email: string;
  name: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  otpCode: string;
  password: string;
};

// Products
export type AddProductRequest = {
  name: string;
  description: string;
  price: string;
  category: string[];
  brand: string;
  images: string[];
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateProductRequest = {
  name: string;
  description: string;
  price: number;
  category: string[];
};

// Cart
export type AddToCartRequest = {
  productId: string;
  quantity: number;
};

// Subscribers
export type SubscribeRequest = {
  email: string;
};
