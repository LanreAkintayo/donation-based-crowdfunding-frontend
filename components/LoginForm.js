import { useState } from "react";

export default function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    loginIdentifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get API URL from environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.loginIdentifier || !formData.password) {
      setError("Please enter both your email and password.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Prepare the payload
      // Backend expects 'email', so we map 'loginIdentifier' to 'email'
      const payload = {
        email: formData.loginIdentifier,
        password: formData.password,
      };

      // 2. Make the API Call
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // 3. SUCCESS!
      // We do NOT set localStorage here anymore. We pass the data to the parent.
      // The Parent (AuthModal) -> calls Context -> Context saves to LocalStorage.
      if (onSuccess) {
        onSuccess(data.token, data);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Email Address</label>
        <input
          name="loginIdentifier"
          type="text" // Kept as text in case you support usernames later
          required
          value={formData.loginIdentifier}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm transition-all"
          placeholder="e.g. lanre@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Password</label>
        <input
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-md">
          <p className="text-center text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full justify-center rounded-md bg-zinc-900 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all disabled:bg-zinc-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging In..." : "Log In"}
      </button>
    </form>
  );
}




// import { useState } from "react";

// export default function LoginForm({ onSuccess }) {
//   const [formData, setFormData] = useState({
//     loginIdentifier: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     if (!formData.loginIdentifier || !formData.password) {
//       setError("Please enter both your email/username and password.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""; // Fallback to empty string if undefined
//       const response = await fetch(`${apiUrl}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed.");
//       }

//       // Save Token
//       localStorage.setItem("authToken", data.token);

//       // TRIGGER SUCCESS ACTION (Close modal or Redirect)
//       if (onSuccess) onSuccess();

//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form className="space-y-6" onSubmit={handleSubmit}>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Email or Username</label>
//         <input
//           name="loginIdentifier"
//           type="text"
//           required
//           value={formData.loginIdentifier}
//           onChange={handleChange}
//           className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
//           placeholder="e.g., aliyumusa"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Password</label>
//         <input
//           name="password"
//           type="password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//           className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
//           placeholder="••••••••"
//         />
//       </div>

//       {error && <p className="text-center text-xs text-red-600">{error}</p>}

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full justify-center rounded-md bg-zinc-900 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all disabled:bg-gray-400"
//       >
//         {isLoading ? "Signing In..." : "Log In"}
//       </button>
//     </form>
//   );
// }