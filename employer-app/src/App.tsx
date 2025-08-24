import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase, type User } from "./lib/supabase";
import { CompanyProfileView } from "./components/CompanyProfileView";
import { CompanyProfileCompletion } from "./components/CompanyProfileCompletion";
import { PrivacyTermsModal } from "./components/PrivacyTermsModal";

/** Company shape as used across components */
interface CompanyData {
  id: string;
  company_name: string;
  company_logo: string | null;
  industry: string | null;
  website_link: string | null;
  short_introduction: string | null;
  mol_name: string | null;
  uic_company_id: string | null;
  address: string | null;
  phone_number: string | null;
  contact_email: string | null;
  responsible_person_name: string | null;
  number_of_employees: number | null;
  subscription_package: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

type Page = "user-profile" | "complete-profile";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>("user-profile");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Auth bootstrap with same smooth loader
  useEffect(() => {
    const start = Date.now();
    const MIN = 2500;

    supabase.auth.getSession().then(({ data: { session } }) => {
      const remain = Math.max(0, MIN - (Date.now() - start));
      setTimeout(() => {
        setUser(session?.user ?? null);
        setLoading(false);
      }, remain);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_evt, session) => {
      setLoading(true);
      setTimeout(() => {
        setUser(session?.user ?? null);
        setLoading(false);
      }, 2500);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Fetch or initialize company record
  useEffect(() => {
    const hydrate = async () => {
      if (!user) {
        setCompanyData(null);
        return;
      }
      if (user.user_metadata?.user_type !== "company") {
        setCompanyData(null);
        setCurrentPage("user-profile");
        return;
      }

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setCompanyData(data as CompanyData);
        setCurrentPage("user-profile");
        return;
      }

      // If no company row yet, create a minimal placeholder so the Edit flow works
      if (!data) {
        const { data: inserted, error: insertError } = await supabase
          .from("companies")
          .insert({
            user_id: user.id,
            company_name: user.user_metadata?.full_name || "My Company",
            contact_email: user.email,
            subscription_package: null,
          })
          .select()
          .maybeSingle();

        if (!insertError && inserted) {
          setCompanyData(inserted as CompanyData);
          setCurrentPage("user-profile");
        }
      }
    };

    hydrate();
  }, [user]);

  const handleSignOut = async () => {
    try { await supabase.auth.signOut(); } catch {}
  };

  const refreshCompany = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setCompanyData(data as CompanyData);
  };

  // Loader (matches main app)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <img
              src="/talent_book_logo_draft_3 copy copy.png"
              alt="TalentBook Logo"
              className="h-16 w-auto mx-auto object-contain"
            />
          </div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Loader2 className="w-6 h-6 text-[#FFC107] animate-spin" />
            <span className="text-white text-lg font-medium">Loading TalentBook...</span>
          </div>
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-red-600 to-[#FFC107] rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFC107]/5 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
      </div>
    );
  }

  // Not signed in → point to Home app for auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <header className="relative z-10">
          <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
            <img
              src="/talent_book_logo_draft_3 copy copy.png"
              alt="TalentBook Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="flex items-center space-x-3">
              <a
                href="/"
                className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-4 py-2 rounded-lg font-medium transition"
              >
                Open Home App
              </a>
            </div>
          </nav>
        </header>

        <main className="flex items-center justify-center py-24 px-4">
          <div className="text-center max-w-xl">
            <h1 className="text-4xl font-bold mb-4">Please sign in to continue</h1>
            <p className="text-white/70">
              Employers sign up and log in from the Home app. After signing in, come back here to manage your company
              profile, post jobs, and review applicants.
            </p>
          </div>
        </main>

        <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <span className="text-gray-400 text-sm">© 2025 TalentBook. All rights reserved.</span>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-gray-400 hover:text-[#FFC107] transition-colors duration-200 text-sm"
            >
              Privacy Policy and Terms of Use
            </button>
          </div>
          <PrivacyTermsModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        </footer>
      </div>
    );
  }

  // Optional: mirror main-app completion step if a payload is provided via localStorage
  const storedSignup = (() => {
    try { return JSON.parse(localStorage.getItem("tb_temp_signup") || "null"); } catch { return null; }
  })();

  if (!companyData && storedSignup) {
    return (
      <CompanyProfileCompletion
        signupData={storedSignup}
        onProfileComplete={() => {
          localStorage.removeItem("tb_temp_signup");
          setCurrentPage("user-profile");
          setTimeout(() => { refreshCompany(); }, 800);
        }}
      />
    );
  }

  // Company dashboard
  if (companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <CompanyProfileView
          company={companyData}
          onUpdateSuccess={refreshCompany}
          onSignOut={handleSignOut}
        />

        <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <span className="text-gray-400 text-sm">© 2025 TalentBook. All rights reserved.</span>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-gray-400 hover:text-[#FFC107] transition-colors duration-200 text-sm"
            >
              Privacy Policy and Terms of Use
            </button>
          </div>
          <PrivacyTermsModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        </footer>
      </div>
    );
  }

  // Fallback while creating/fetching company
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-6 h-6 text-[#FFC107] animate-spin mx-auto mb-4" />
        <p className="text-white">Preparing your company profile...</p>
      </div>
    </div>
  );
}
