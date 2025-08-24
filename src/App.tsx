@@ .. @@
   // Auth bootstrap with same smooth loader
   useEffect(() => {
+    // TEMPORARY: Development login bypass - REMOVE FOR PRODUCTION
+    const start = Date.now();
+    const MIN = 2500;
+
+    // Create a dummy user object for development
+    const dummyUser = {
+      id: 'dev-user-123',
+      email: 'company@example.com',
+      user_metadata: {
+        full_name: 'John Smith',
+        user_type: 'company'
+      }
+    };
+
+    const remain = Math.max(0, MIN - (Date.now() - start));
+    setTimeout(() => {
+      setUser(dummyUser as any);
+      setLoading(false);
+    }, remain);
+
+    /* ORIGINAL AUTH CODE - COMMENTED OUT FOR DEVELOPMENT
     const start = Date.now();
     const MIN = 2500;
 
@@ .. @@
     });
 
     return () => subscription.subscription.unsubscribe();
+    */
   }, []);
 
   // Fetch or initialize company record
   useEffect(() => {
+    // TEMPORARY: Development company data - REMOVE FOR PRODUCTION
+    if (!user) {
+      setCompanyData(null);
+      return;
+    }
+
+    // Create dummy company data for development
+    const dummyCompanyData = {
+      id: 'dev-company-123',
+      company_name: 'TechCorp Solutions',
+      company_logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
+      industry: 'Technology',
+      website_link: 'https://techcorp.example.com',
+      short_introduction: 'We are a leading technology company specializing in innovative software solutions and digital transformation services. Our team of experts helps businesses leverage cutting-edge technologies to achieve their goals.',
+      mol_name: 'Jane Doe',
+      uic_company_id: 'TC123456789',
+      address: '123 Tech Street, Innovation District, San Francisco, CA 94105',
+      phone_number: '+1 (555) 123-4567',
+      contact_email: 'company@example.com',
+      responsible_person_name: 'John Smith',
+      number_of_employees: 150,
+      subscription_package: 'premium',
+      created_at: '2024-01-15T10:30:00Z',
+      updated_at: '2024-12-20T15:45:00Z',
+      user_id: 'dev-user-123'
+    };
+
+    setCompanyData(dummyCompanyData);
+    setCurrentPage("user-profile");
+
+    /* ORIGINAL COMPANY DATA FETCH CODE - COMMENTED OUT FOR DEVELOPMENT
     const hydrate = async () => {
       if (!user) {
         setCompanyData(null);
@@ .. @@
     };
 
     hydrate();
+    */
   }, [user]);