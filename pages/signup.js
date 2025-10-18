import { useState } from "react";
import { useRouter } from "next/router"; // 1. Import the router
import Layout from "./layout";

const SignUp = () => {
  const router = useRouter(); // 2. Initialize the router

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // 3. Add loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // The main function to handle form submission
  const handleSubmit = async (e) => {
    // 4. Make this function async
    e.preventDefault();
    setIsLoading(true); // Disable button on submit

    // --- Validation logic (no changes here) ---
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    // If validation passes, send data to the backend
    if (Object.keys(newErrors).length === 0) {
      try {
        // We don't need to send confirmPassword to the backend
        const { confirmPassword, ...submissionData } = formData;

        // 5. The API Call
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/users/add-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        });

        const data = await response.json();

        // If the server sends an error (e.g., username taken)
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        // If successful
        alert("Account created successfully! Please log in.");
        router.push("/login"); // 6. Redirect to login page
      } catch (error) {
        // Show any error messages from the backend
        console.error("Registration error:", error);
        alert(`Registration failed: ${error.message}`);
      }
    }

    setIsLoading(false); // Re-enable button
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#e7e0ce] via-white to-white px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our community to fund and get funded!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* --- Full Name Field --- */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
              placeholder="e.g., Aliyu Musa"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* --- Username Field --- */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
              placeholder="e.g., aliyumusa"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          {/* --- Email Address Field --- */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* --- Password Fields (no changes) --- */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* --- Sign Up Button --- */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-orange-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SignUp.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SignUp;
