import { useState } from "react";
import axios from "axios";

function Chat() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("file"); // Track selected option: 'file' or 'url'
  const user_id = localStorage.getItem("user_id"); // Get user_id from localStorage

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // Handle query input change
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle option change (URL or File)
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setUrl(""); // Clear URL if switching to file option
    setFile(null); // Clear file if switching to URL option
    setQuery(""); // Clear query if switching between options
  };

  // Function to handle file upload
  const uploadFile = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const filedata = new FormData();
    filedata.append("file", file);
    filedata.append("user_id", user_id);

    setLoading(true);
    axios
      .post("http://localhost:8000/api/upload", filedata)
      .then((response) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "system", content: "File uploaded successfully!" },
        ]);
        setLoading(false);
      })
      .catch((e) => {
        setError("Error uploading file.");
        setLoading(false);
      });
  };

  // Function to handle query submission
  const handleQuery = () => {
    if (selectedOption === "url" && (!url || !query)) {
      alert("Please enter both a URL and a query.");
      return;
    }

    if (selectedOption === "file" && query) {
      // If file is selected and query is entered, process file with query
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: query },
      ]);

      axios
        .post("http://localhost:8000/api/query", { query, user_id })
        .then((response) => {
          const aiResponse = response.data.text || response.data;
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "ai", content: aiResponse },
          ]);
          setLoading(false);
        })
        .catch((e) => {
          setError("Error querying file content.");
          setLoading(false);
        });
    } else if (selectedOption === "url") {
      // If URL is selected, process URL with query
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: query },
      ]);

      axios
        .post("http://localhost:8000/api/scrape", { url, query, user_id })
        .then((response) => {
          const aiResponse = response.data.generatedText;
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: "ai", content: aiResponse },
          ]);
          setLoading(false);
        })
        .catch((e) => {
          setError("Error scraping website.");
          setLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-lead text-center text-white py-2">Chat With Your Data</h1>
      <div className="w-full max-w-4xl bg-slate-600 shadow-lg rounded-xl text-xl overflow-hidden">
        {/* Option Selection: Radio buttons for File or URL */}
        <div className="p-6 bg-slate-400 text-white flex justify-around">
          <div>
            <input
              type="radio"
              id="file"
              name="option"
              value="file"
              checked={selectedOption === "file"}
              onChange={() => handleOptionChange("file")}
            />
            <label htmlFor="file" className="ml-2">File Upload</label>
          </div>
          <div>
            <input
              type="radio"
              id="url"
              name="option"
              value="url"
              checked={selectedOption === "url"}
              onChange={() => handleOptionChange("url")}
            />
            <label htmlFor="url" className="ml-2">Website URL</label>
          </div>
        </div>

        {/* Chat Messages Section */}
        <div className="p-6 overflow-auto h-96" style={{ scrollBehavior: "smooth" }}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-blue-500 text-white"
                  } p-3 rounded-lg inline-block max-w-md`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
          </div>
        </div>

        {/* Conditional Inputs */}
        {selectedOption === "file" && (
          <div className="p-6 bg-slate-400 flex items-center text-white">
            <input
              type="file"
              onChange={handleFileChange}
              className="mr-4 p-2 border rounded-lg bg-gray-600 cursor-pointer"
            />
            <button
              onClick={uploadFile}
              className="px-4 py-2 bg-black text-white rounded-lg hover:text-yellow-500 disabled:opacity-50 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        )}

        {selectedOption === "url" && (
          <div className="p-6 bg-slate-400 text-white">
            <input
              type="text"
              placeholder="Enter website URL"
              value={url}
              onChange={handleUrlChange}
              className="w-full p-3 rounded-lg border border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="p-6 bg-slate-400 flex items-center text-xl text-black">
          <input
            type="text"
            placeholder="Enter your query"
            value={query}
            onChange={handleQueryChange}
            className="w-full p-3 rounded-lg border border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleQuery}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
