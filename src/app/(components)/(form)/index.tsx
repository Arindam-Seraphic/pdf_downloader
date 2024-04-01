"use client";
import React, { useState } from "react";
import axios from "axios";

interface FormData {
  inputValue: string;
}

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    inputValue: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ inputValue: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.inputValue.trim() !== "") {
      try {
        const res = await axios.post("/api/download-pdf", {
          inputValue: formData.inputValue,
        });
        console.log("res", res);
        if (res.data && res.data.filePath) {
          // Automatically download the file
        //   window.open(res.data.filePath);
        }
      } catch (error) {
        // Handle error
      }
    } else {
      alert("Input field should not be empty!");
    }
  };

  return (
    <form
      className="w-full h-full mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <input
        className="mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black focus:ring-black w-full"
        type="text"
        placeholder="Enter something..."
        value={formData.inputValue}
        onChange={handleInputChange}
      />
      <button
        className="block w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
