import React, { useState } from "react";
import { Upload, User, FileCheck, CheckCircle } from "lucide-react";
import { getCookie } from "@/utils/getCookies";

export default function TestCreate() {
  const [step, setStep] = useState("create");
  const [mentorId, setMentorId] = useState("");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const userId = getCookie("userId");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/mentor/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, name, description: desc }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create mentor");
      setMentorId(data.mentor._id);
      console.log(mentorId);

      setSuccessMsg("Mentor profile created successfully!");
      setTimeout(() => {
        setStep("upload");
        setSuccessMsg("");
      }, 1000);
    } catch (err) {
      setError("Failed to create mentor profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("user_id", userId);
      const res = await fetch(`/api/mentor/${mentorId}/upload`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSuccessMsg("Document uploaded successfully! Mentor setup complete.");
      setTimeout(() => {
        setName("");
        setDesc("");
        setFile(null);
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      setError("Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please upload a PDF file only.");
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a PDF file only.");
        setFile(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Impactoverse
          </h1>
          <p className="text-gray-600">Create and manage your mentors</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "create"
                  ? "bg-purple-600 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {step === "upload" ? <CheckCircle className="w-5 h-5" /> : "1"}
            </div>
            <div
              className={`w-12 h-1 mx-2 ${
                step === "upload" ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "upload"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {step === "create" ? (
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Mentor Profile
                </h2>
                <p className="text-gray-600">
                  Enter the mentor's basic information
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mentor Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter mentor's full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="desc"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mentor Description
                  </label>
                  <textarea
                    id="desc"
                    placeholder="Describe the mentor's expertise, background, and areas of focus..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Mentor...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Upload Document</span>
                    <FileCheck className="w-5 h-5" />
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 text-sm flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{successMsg}</span>
                  </p>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Document
                </h2>
                <p className="text-gray-600">
                  Upload a PDF document for{" "}
                  <span className="font-semibold text-purple-600">{name}</span>
                </p>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-purple-500 bg-purple-50"
                    : file
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                      file ? "bg-green-100" : "bg-purple-100"
                    }`}
                  >
                    {file ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <Upload className="w-8 h-8 text-purple-600" />
                    )}
                  </div>

                  {file ? (
                    <div>
                      <p className="text-green-600 font-semibold">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 font-medium">
                        Drop your PDF here, or{" "}
                        <span className="text-purple-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        PDF files only, up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep("create")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 text-sm flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{successMsg}</span>
                  </p>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2025 Impactoverse. Building the future of mentorship.
          </p>
        </div>
      </div>
    </div>
  );
}
