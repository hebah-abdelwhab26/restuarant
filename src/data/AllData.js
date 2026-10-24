
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const apivalue = createContext([]);

const apiClient = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://127.0.0.1:8080/api",
  timeout: 10000,
});

function AllData({ children }) {
  const [api, setApi] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadMeals() {
      try {
        const response = await apiClient.get("/meals");
        const result = response.data;

        const meals = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.meals)
              ? result.meals
              : [];

        const normalizedMeals = meals.map((meal) => ({
          ...meal,
          id: String(meal.idMeal ?? meal.id ?? ""),
          title: meal.strMeal ?? meal.title ?? "Meal",
          category: meal.strCategory ?? meal.category ?? "",
          price: Number(meal.price ?? 0),
          images: [
            meal.strMealThumb ??
              meal.image ??
              meal.thumbnail ??
              "/assets/images/no-image.png",
          ],
          rating: Number(meal.rating ?? 0),
          description:
            meal.strInstructions ?? meal.description ?? "",
          ingredients: meal.ingredients ?? [],
          measures: meal.measures ?? [],
        }));

        if (mounted) {
          setApi(normalizedMeals);
        }
      } catch (error) {
        console.error(
          "Failed to load meals from Laravel API:",
          error
        );
      }
    }

    const handleRefresh = () => loadMeals();

    window.addEventListener("grilli:refresh-meals", handleRefresh);
    loadMeals();

    return () => {
      mounted = false;
      window.removeEventListener(
        "grilli:refresh-meals",
        handleRefresh
      );
    };
  }, []);

  return (
    <apivalue.Provider value={api}>
      {children}
    </apivalue.Provider>
  );
}

export { AllData, apivalue };
