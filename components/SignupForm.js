// import { useState } from "react";

// export default function SignupForm({ onSuccess }) {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Validation Logic
//     const newErrors = {};
//     if (!formData.fullName) newErrors.fullName = "Full name is required.";
//     if (!formData.username) newErrors.username = "Username is required.";
//     if (!formData.email) newErrors.email = "Email is required.";
//     if (formData.password.length < 4) newErrors.password = "Min 4 characters.";
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       try {
//         const { confirmPassword, ...submissionData } = formData;
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        
//         const response = await fetch(`${apiUrl}/api/users/add-user`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(submissionData),
//         });

//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || "Failed to register");

//         alert("Account created! Please log in.");
        
//         // Trigger Success (Switch to Login tab usually)
//         if (onSuccess) onSuccess();

//       } catch (error) {
//         console.error(error);
//         alert(error.message);
//       }
//     }
//     setIsLoading(false);
//   };

//   return (
//     <form className="space-y-4" onSubmit={handleSubmit}>
//       <div>
//         <input
//           name="fullName"
//           type="text"
//           placeholder="Full Name"
//           required
//           onChange={handleChange}
//           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
//         />
//         {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
//       </div>

//       <div>
//         <input
//           name="username"
//           type="text"
//           placeholder="Username"
//           required
//           onChange={handleChange}
//           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
//         />
//       </div>

//       <div>
//         <input
//           name="email"
//           type="email"
//           placeholder="Email Address"
//           required
//           onChange={handleChange}
//           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
//         />
//       </div>

//       <div>
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           required
//           onChange={handleChange}
//           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
//         />
//       </div>

//       <div>
//         <input
//           name="confirmPassword"
//           type="password"
//           placeholder="Confirm Password"
//           required
//           onChange={handleChange}
//           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
//         />
//         {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full justify-center rounded-md bg-zinc-900 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all disabled:bg-gray-400"
//       >
//         {isLoading ? "Creating..." : "Sign Up"}
//       </button>
//     </form>
//   );
// }


import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';

export default function SignupForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get API URL correctly
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // --- 1. HANDLE GOOGLE SUCCESS ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${apiUrl}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Google Sign-In failed");

      // SUCCESS: Pass token and user data up to the Header/Context
      // DO NOT set localStorage here manually
      if (onSuccess) onSuccess(data.token, data);

    } catch (error) {
      console.error("Google Auth Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. HANDLE REGULAR SIGNUP ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation Logic
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (formData.password.length < 4) newErrors.password = "Min 4 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const { confirmPassword, ...submissionData } = formData;
        
        const response = await fetch(`${apiUrl}/api/users/add-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to register");

        // SUCCESS: Auto-Login the user immediately!
        // Your backend returns the token on signup, so use it.
        if (onSuccess) onSuccess(data.token, data);

      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-all ${errors.fullName ? "border-red-500 bg-red-50" : "border-zinc-300 focus:border-orange-500"}`}
          />
          {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-all ${errors.username ? "border-red-500 bg-red-50" : "border-zinc-300 focus:border-orange-500"}`}
          />
           {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-zinc-300 focus:border-orange-500"}`}
          />
           {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-all ${errors.password ? "border-red-500 bg-red-50" : "border-zinc-300 focus:border-orange-500"}`}
          />
           {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-all ${errors.confirmPassword ? "border-red-500 bg-red-50" : "border-zinc-300 focus:border-orange-500"}`}
          />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full justify-center rounded-md bg-zinc-900 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all disabled:bg-zinc-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* --- DIVIDER --- */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-zinc-200"></div>
        <span className="flex-shrink-0 mx-4 text-zinc-400 text-xs font-medium">OR CONTINUE WITH</span>
        <div className="flex-grow border-t border-zinc-200"></div>
      </div>

      {/* --- GOOGLE BUTTON --- */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log('Login Failed');
            alert("Google Sign In Failed");
          }}
          useOneTap
          theme="outline"
          shape="circle"
          width="100%"
        />
      </div>
    </div>
  );
}