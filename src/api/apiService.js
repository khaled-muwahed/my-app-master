import { fetchWithAuth } from "./fetchWithAuth"; // Adjust the import path as needed

export const getCategories = async () => {
  try {
    const result = await fetchWithAuth(
      "http://www.product.somee.com/api/Product/GetAllCategory"
    );

    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    throw new Error("No valid data found in categories API response");
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const result = await fetchWithAuth(
      "http://www.product.somee.com/api/Location/GetAllCountry"
    );

    if (result && Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    throw new Error("No valid data found in countries API response");
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const getProducts = async (filters) => {
  try {
    const query = new URLSearchParams();
    console.log("filters.status", filters.status);

    // Only add parameters if they have a value
    if (filters.categoryId) query.append("categoryId", filters.categoryId);
    if (filters.cityId) query.append("cityId", filters.cityId);
    if (filters.countryId) query.append("countryId", filters.countryId);

    if (filters.textSearch) query.append("textSearch", filters.textSearch);

    if (
      (filters.myProducts !== undefined && filters.status == 1) ||
      filters.status == 0
    )
      query.append("status", filters.status);

    const queryString = query.toString();
    const url = `http://www.product.somee.com/api/Product/GetAllProducts${
      queryString ? `?${queryString}` : ""
    }`;

    const result = await fetchWithAuth(url);
    if (result.data) {
      return result.data;
    }
    throw new Error("No data found in API response");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// apiService.js or appropriate service file
export const deleteProduct = async (productId) => {
  const url = `http://www.product.somee.com/api/Product/RemoveProduct?id=${productId}`;
  try {
    const response = await fetchWithAuth(url, {
      method: "DELETE",
    });

    if (response.ok) {
      // Check if the response body is not empty before parsing
      if (response.headers.get("content-length") > 0) {
        await response.json(); // This line assumes the response contains JSON
      }
      return true;
    }
    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.errorMessage || "An unknown error occurred";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error deleting product:", error.errorMessage);
    return false;
  }
};

// apiService.js

export const updateProduct = async (productData) => {
  try {
    const formData = new FormData();

    for (const [key, value] of Object.entries(productData)) {
      formData.append(key, value);
    }

    const token = localStorage.getItem("authToken"); // Or another method to retrieve the auth token

    const response = await fetch(
      `http://www.product.somee.com/api/Product/UpdateProduct`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: token, // Include the authorization token
          // Note: Don't include Content-Type when sending FormData, fetch will set it automatically
        },
      }
    );

    // Check if the response was successful
    console.log("response.ok", response.ok);

    if (!response.ok) {
      console.error("Server error status:", response.status);
      throw new Error("Failed to update product");
    }

    // If the response has JSON data, parse it
    const result = await response.json();

    if (result.errorMessage === null) {
      return { success: true, message: "Product updated successfully" };
    } else {
      throw new Error(result.errorMessage || "Unknown error occurred");
    }
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
};
