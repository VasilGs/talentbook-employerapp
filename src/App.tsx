@@ .. @@
   // Auth bootstrap with same smooth loader
   useEffect(() => {
     const start = Date.now();
     const MIN = 2500;
 
@@ .. @@
     });
 
     return () => subscription.subscription.unsubscribe();
   }, []);
 
   // Fetch or initialize company record
   useEffect(() => {
     const hydrate = async () => {
       if (!user) {
         setCompanyData(null);
@@ .. @@
     };
 
     hydrate();
   }, [user]);