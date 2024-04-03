"use client";
import React, { useState } from "react";
import axios from "axios";
import Loader from "../(loader)";

interface FormData {
  inputValue: string;
}

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    inputValue: "",
  });

  const [loading, setLoading] = useState(false);
  const [isUrlVisible, setIsUrlVisible] = useState(false);
  const [text, setText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ inputValue: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formData.inputValue.trim() !== "") {
      try {
        const res = await axios.post(
          "https://agenciatributaria.hub.seraphic.io/api/v1/download",
          // "http://localhost:5006/api/v1/download",
          {
            inputValue: formData.inputValue,
          }
        );
        setFormData({ inputValue: "" });
        setLoading(false);
        if (res.data) {
          console.log(res.data);
          setText(res.data.text);
          setIsUrlVisible(true);
        }
      } catch (error) {
        setLoading(false);
        console.log("error", error);
      }
    } else {
      setLoading(false);
      alert("Input field should not be empty!");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : isUrlVisible ? (
        <>
          <div className="flex flex-col items-center justify-center h-full">
            <p>Click on the below link to download the pdf</p>
            <a
              href="https://agenciatributaria.hub.seraphic.io/downloaded.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              https://agenciatributaria.hub.seraphic.io/downloaded.pdf
            </a>
            <p className="text-lg">
              Total ingresos íntegros computables: <span className="font-semibold">{text}</span>
            </p>
          </div>
        </>
      ) : (
        <form
          className="w-full h-full mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <input
            className="mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black focus:ring-black w-full"
            type="text"
            placeholder="Enter code..."
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
      )}
    </>
  );
};

export default Form;
