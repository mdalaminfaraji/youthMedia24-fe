"use client";
import { useCategoryStore } from "@/store/categoriesStore";
import { useEffect } from "react";

const Categories = () => {
  const { categories, fetchCategories, loading, error } = useCategoryStore();

  useEffect(() => {
    fetchCategories("bn");
  }, [fetchCategories]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log(categories);
  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.documentId}>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
