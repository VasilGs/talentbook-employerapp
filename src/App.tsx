@@ .. @@
  // Auth bootstrap with same smooth loader
  useEffect(() => {
    // TEMPORARY: Immediate development login bypass
    const dummyUser = {
      id: 'dev-user-123',
      email: 'chochodummyto@gmail.com',
      user_metadata: {
        full_name: 'John Smith',
        user_type: 'company'
      }
    };

    const dummyCompanyData = {
      id: 'company-123',
      company_name: 'TechCorp Solutions',
      company_logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      industry: 'Technology',
      website_link: 'https://techcorp.com',
      short_introduction: 'Leading technology solutions provider specializing in innovative software development and digital transformation services.',
      mol_name: 'John Smith',
      uic_company_id: 'TC123456789',
      address: '123 Tech Street, Innovation District, San Francisco, CA 94105',
      phone_number: '+1 (555) 123-4567',
      contact_email: 'chochodummyto@gmail.com',
      responsible_person_name: 'John Smith',
      number_of_employees: 150,
      subscription_package: 'premium',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      user_id: 'dev-user-123'
    };

    // Set states immediately without any delays
    setUser(dummyUser as any);
    setCompanyData(dummyCompanyData as any);
    setCurrentPage("user-profile");
    setLoading(false);
  }, []);

  // Fetch or initialize company record
  useEffect(() => {
    // TEMPORARY: Skip company data fetching for development
    // Company data is already set in the first useEffect
    return;
  }, [user]);