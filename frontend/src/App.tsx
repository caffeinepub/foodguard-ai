import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { SplashScreen } from './pages/SplashScreen';
import { HomeScreen } from './pages/HomeScreen';
import { CameraScreen } from './pages/CameraScreen';
import { FoodInputScreen } from './pages/FoodInputScreen';
import { ResultScreen } from './pages/ResultScreen';
import { IngredientScanScreen } from './pages/IngredientScanScreen';
import { ProfileScreen } from './pages/ProfileScreen';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Splash screen (default)
const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashScreen,
});

// Home screen
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomeScreen,
});

// Camera screen
const cameraRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/camera',
  component: CameraScreen,
});

// Food input screen
const foodInputRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/food-input',
  component: FoodInputScreen,
});

// Result screen
const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result',
  validateSearch: (search: Record<string, unknown>) => ({
    foodName: typeof search.foodName === 'string' ? search.foodName : undefined,
  }),
  component: ResultScreen,
});

// Ingredient scan screen
const ingredientScanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ingredient-scan',
  component: IngredientScanScreen,
});

// Profile screen
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileScreen,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  homeRoute,
  cameraRoute,
  foodInputRoute,
  resultRoute,
  ingredientScanRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
