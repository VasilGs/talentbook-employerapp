import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { CompanyProfileView } from './components/CompanyProfileView'
import { CompanyProfileCompletion } from './components/CompanyProfileCompletion'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [companyComplete, setCompanyComplete] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, ses) => setSession(ses))
    return () => { listener?.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    async function checkCompany() {
      if (!session?.user) return
      const { data, error } = await supabase.from('companies').select('*').eq('user_id', session.user.id).maybeSingle()
      if (error || !data) setCompanyComplete(false)
      else setCompanyComplete(true)
    }
    checkCompany()
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center text-white bg-neutral-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Please sign in to continue</h1>
          <p className="text-white/70">Open the Home app to create an account or log in.</p>
        </div>
      </div>
    )
  }

  if (companyComplete === false) {
    return <CompanyProfileCompletion />
  }

  return <CompanyProfileView />
}
