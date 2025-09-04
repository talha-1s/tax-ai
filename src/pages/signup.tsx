'use client';

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const allowedEmailDomains = [
  "gmail.com", "outlook.com", "hotmail.com", "hotmail.co.uk", "yahoo.com", "icloud.com",
  "live.com", "aol.com", "protonmail.com", "zoho.com", "gmx.com", "mail.com"
];

const countryCodes = [
  { label: "🇬🇧 UK (+44)", value: "+44" },
  { label: "🇵🇰 Pakistan (+92)", value: "+92" },
  { label: "🇮🇳 India (+91)", value: "+91" },
  { label: "🇪🇸 Spain (+34)", value: "+34" },
  { label: "🇧🇩 Bangladesh (+880)", value: "+880" },
  { label: "🇦🇪 UAE (+971)", value: "+971" },
];

function getPasswordStrength(password: string): string {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  switch (strength) {
    case 0:
    case 1: return "Weak";
    case 2: return "Medium";
    case 3: return "Strong";
    case 4: return "Very Strong";
    default: return "Weak";
  }
}

function getPasswordStrengthColor(password: string): string {
  const strength = getPasswordStrength(password);
  switch (strength) {
    case "Weak": return "text-red-500";
    case "Medium": return "text-yellow-500";
    case "Strong": return "text-blue-500";
    case "Very Strong": return "text-green-600";
    default: return "text-gray-500";
  }
}

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    country_code: "+44",
    phone_number: "",
    occupation: "",
    ni_number: "",
    dob: "",
    account_method: "",
    account_method_other: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validateEmail = (email: string) => {
    const domain = email.split("@")[1];
    return /^[^\s@]+@[^\s@]+\.(com|co\.uk)$/.test(email) && allowedEmailDomains.includes(domain);
  };

  const validatePhone = (code: string, number: string) => {
    if (code === "+44") {
      return (/^0\d{10}$/.test(number) || /^7\d{9}$/.test(number));
    }
    return /^\d{7,15}$/.test(number);
  };

  const validateDOB = (dob: string) => {
    const year = parseInt(dob.split("-")[0]);
    return year >= 1900 && year <= 2013;
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.full_name.trim()) newErrors.full_name = "Full name is required.";
      if (!formData.email.trim() || !validateEmail(formData.email)) newErrors.email = "Enter a valid email from a known provider.";
      if (!formData.phone_number.trim() || !validatePhone(formData.country_code, formData.phone_number)) newErrors.phone_number = "Enter a valid phone number.";
      if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required.";
    }

    if (step === 2) {
      if (!/^[A-Za-z0-9]{9}$/.test(formData.ni_number)) newErrors.ni_number = "NI Number must be exactly 9 characters.";
      if (!formData.dob || !validateDOB(formData.dob)) newErrors.dob = "Date of birth must be between 1900 and 2013.";
      if (!formData.account_method.trim()) {
        newErrors.account_method = "Please select an accounting method.";
      } else if (formData.account_method === "other" && !formData.account_method_other.trim()) {
        newErrors.account_method_other = "Please specify your accounting method.";
      }
    }

    if (step === 3) {
      if (!formData.password || formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters, include one uppercase letter and one number.";
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateStep()) return;

  try {
    // Step 1: Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrors({ general: `Signup error: ${error.message}` });
      return;
    }

    // Step 2: Insert full profile into public.users
    if (data?.user?.id) {
  const { error: insertError } = await supabase.from("users").upsert([
  {
    id: data.user.id,
    email: formData.email,
    full_name: formData.full_name,
    phone_number: `${formData.country_code}${formData.phone_number}`,
    occupation: formData.occupation,
    ni_number: formData.ni_number,
    dob: formData.dob,
    start_date: new Date().toISOString().split("T")[0],
    account_method: formData.account_method === "other"
      ? formData.account_method_other
      : formData.account_method,
  },
]);


  if (insertError) {
    setErrors({ general: `Profile insert error: ${insertError.message}` });
    return;
  }

  setSuccess(true);
}

  } catch (err) {
    setErrors({ general: "Unexpected error occurred. Please try again later." });
    console.error(err);
  }
};



  const goToLogin = () => router.push("/login");

return (
  <div className="min-h-screen flex items-center justify-center bg-[#f2f4f7] px-6 py-12">
    <div className="w-full max-w-[600px] bg-white p-10 rounded-lg shadow space-y-6">
      {!success && (
        <h1 className="text-3xl font-bold text-center text-[#3f3d56]">Create Your Account</h1>
      )}

      {success && (
        <div className="w-full bg-green-50 border border-green-200 rounded-lg p-8 text-center space-y-4">
          <p className="text-2xl font-semibold text-green-700">✅ Signup successful!</p>
          <button
            onClick={goToLogin}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Log in now
          </button>
        </div>
      )}

      {errors.general && (
        <div className="text-center space-y-2">
          <p className="text-red-600 font-medium">❌ {errors.general}</p>
          {userExists && (
            <button
              onClick={goToLogin}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Sign in now
            </button>
          )}
        </div>
      )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold">Personal Info</h2>
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Full Name"
                  className={`w-full border rounded px-4 py-3 ${errors.full_name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.full_name && <p className="text-red-600 text-sm">{errors.full_name}</p>}

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email"
                  className={`w-full border rounded px-4 py-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-3 border-gray-300"
                >
                  {countryCodes.map((code) => (
                    <option key={code.value} value={code.value}>
                      {code.label}
                    </option>
                  ))}
                </select>

                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone Number"
                  className={`w-full border rounded px-4 py-3 ${errors.phone_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone_number && <p className="text-red-600 text-sm">{errors.phone_number}</p>}

                <input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  type="text"
                  placeholder="Occupation"
                  className={`w-full border rounded px-4 py-3 ${errors.occupation ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.occupation && <p className="text-red-600 text-sm">{errors.occupation}</p>}
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-semibold">Business Info</h2>

                <input
                  name="ni_number"
                  value={formData.ni_number}
                  onChange={handleChange}
                  type="text"
                  placeholder="National Insurance Number (9 characters)"
                  className={`w-full border rounded px-4 py-3 ${errors.ni_number ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.ni_number && <p className="text-red-600 text-sm">{errors.ni_number}</p>}

                <input
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  className={`w-full border rounded px-4 py-3 ${errors.dob ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}

                <select
                  name="account_method"
                  value={formData.account_method}
                  onChange={handleChange}
                  className={`w-full border rounded px-4 py-3 ${errors.account_method ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Accounting Method</option>
                  <option value="cash">Cash</option>
                  <option value="accrual">Accrual</option>
                  <option value="other">Other</option>
                </select>
                {errors.account_method && <p className="text-red-600 text-sm">{errors.account_method}</p>}

                {formData.account_method === "other" && (
                  <input
                    name="account_method_other"
                    value={formData.account_method_other}
                    onChange={handleChange}
                    type="text"
                    placeholder="Specify accounting method"
                    className={`w-full border rounded px-4 py-3 ${errors.account_method_other ? "border-red-500" : "border-gray-300"}`}
                  />
                )}
                {errors.account_method_other && <p className="text-red-600 text-sm">{errors.account_method_other}</p>}
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-xl font-semibold">Security</h2>

                <div className="relative">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`w-full border rounded px-4 py-3 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {formData.password && (
                  <p className={`${getPasswordStrengthColor(formData.password)} text-sm`}>
                    Password Strength: {getPasswordStrength(formData.password)}
                  </p>
                )}
                {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

                <div className="relative">
                  <input
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full border border-black rounded px-4 py-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirm_password && <p className="text-red-600 text-sm">{errors.confirm_password}</p>}
              </>
            )}

            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
