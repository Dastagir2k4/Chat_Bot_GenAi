import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle file upload
  const uploadFile = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const filedata = new FormData();
    filedata.append("file", file);

    setLoading(true); // Set loading state to true while uploading
    axios
      .post("http://localhost:8000/upload", filedata)
      .then((response) => {
        console.log("Successfully uploaded file");
        setFileContent(response.data); // Set the file content from the server response
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "system", content: "File uploaded successfully!" },
        ]);
        setLoading(false); // Set loading state to false after response
      })
      .catch((e) => {
        console.log("Error while uploading file data", e);
        setLoading(false); // Set loading state to false in case of error
      });
  };

  // Function to handle query input and response
  const handleQuery = () => {
    if (!query) {
      alert("Please enter a query.");
      return;
    }
    setLoading(true); // Set loading state to true while fetching response

    // Add user message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: query },
    ]);

    axios
      .post("http://localhost:8000/query", { query })
      .then((response) => {
        const aiResponse = response.data.text || response.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: aiResponse },
        ]);
        setResponse(aiResponse); // Set the query response
        setLoading(false); // Set loading state to false after response
      })
      .catch((e) => {
        console.log("Error while querying data", e);
        setLoading(false); // Set loading state to false in case of error
      });

    setQuery(""); // Clear the query input field
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-4xl bg-slate-200 shadow-lg rounded-xl overflow-hidden">
        {/* Chat Messages Section */}
        <div
          className="p-6 overflow-auto h-96"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="space-y-4">
            {/* Map over messages to display them */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-blue-500"
                  } p-3 rounded-lg inline-block max-w-md`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Input Section */}
        <div className="p-6 bg-slate-100 flex items-center">
          <input
            type="text"
            placeholder="Enter your query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleQuery}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>

        {/* File Upload Section */}
        <div className="p-6 bg-gray-50 flex items-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="mr-4 p-2 border rounded-lg"
          />
          <button
            onClick={uploadFile}
            className="px-4 py-2 bg-black text-white rounded-lg  hover:text-yellow-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
