import { AccountDeletion } from 'components/interfaces/Account/Preferences/AccountDeletion'
import { AccountIdentities } from 'components/interfaces/Account/Preferences/AccountIdentities'
import { AnalyticsSettings } from 'components/interfaces/Account/Preferences/AnalyticsSettings'
import { ProfileInformation } from 'components/interfaces/Account/Preferences/ProfileInformation'
import { ThemeSettings } from 'components/interfaces/Account/Preferences/ThemeSettings'
import { useNewLayout } from 'components/interfaces/App/FeaturePreview/FeaturePreviewContext'
import AccountLayout from 'components/layouts/AccountLayout/AccountLayout'
import AccountSettingsLayout from 'components/layouts/AccountLayout/AccountSettingsLayout'
import AppLayout from 'components/layouts/AppLayout/AppLayout'
import DefaultLayout from 'components/layouts/DefaultLayout'
import OrganizationLayout from 'components/layouts/OrganizationLayout'
import {
  ScaffoldContainer,
  ScaffoldDescription,
  ScaffoldHeader,
  ScaffoldTitle,
} from 'components/layouts/Scaffold'
import AlertError from 'components/ui/AlertError'
import Panel from 'components/ui/Panel'
import { GenericSkeletonLoader } from 'components/ui/ShimmeringLoader'
import { useIsFeatureEnabled } from 'hooks/misc/useIsFeatureEnabled'
import { useProfile } from 'lib/profile'
import type { NextPageWithLayout } from 'types'
import { Suspense, lazy } from 'react'

const User: NextPageWithLayout = () => {
  const newLayoutPreview = useNewLayout()

  if (newLayoutPreview) {
    return <ProfileCard />
  }

  return (
    <ScaffoldContainer>
      <ScaffoldHeader>
        <ScaffoldTitle>User Preferences</ScaffoldTitle>
        <ScaffoldDescription>
          Manage your profile, account settings, and preferences for your Supabase experience
        </ScaffoldDescription>
      </ScaffoldHeader>
      <ProfileCard />
    </ScaffoldContainer>
  )
}

User.getLayout = (page) => (
  <AppLayout>
    <DefaultLayout headerTitle="Account">
      <OrganizationLayout>
        <AccountLayout title="Preferences">
          <AccountSettingsLayout>{page}</AccountSettingsLayout>
        </AccountLayout>
      </OrganizationLayout>
    </DefaultLayout>
  </AppLayout>
)

export default User

// Skeleton loading component
const PreferencesSkeleton = () => (
  <article>
    <Panel>
      <div className="p-4">
        <GenericSkeletonLoader />
      </div>
    </Panel>
    <div className="mt-4">
      <Panel>
        <div className="p-4">
          <GenericSkeletonLoader />
        </div>
      </Panel>
    </div>
    <div className="mt-4">
      <Panel>
        <div className="p-4">
          <GenericSkeletonLoader />
        </div>
      </Panel>
    </div>
    <div className="mt-4">
      <Panel>
        <div className="p-4">
          <GenericSkeletonLoader />
        </div>
      </Panel>
    </div>
  </article>
)

const ProfileCard = () => {
  const profileUpdateEnabled = useIsFeatureEnabled('profile:update')
  const { error, isLoading, isError, isSuccess } = useProfile()

  if (isLoading) {
    return <PreferencesSkeleton />
  }

  if (isError) {
    return (
      <Panel>
        <div className="p-4">
          <AlertError error={error} subject="Failed to retrieve account information" />
        </div>
      </Panel>
    )
  }

  return (
    <Suspense fallback={<PreferencesSkeleton />}>
      <article>
        {profileUpdateEnabled && isSuccess && <ProfileInformation />}
        
        {isSuccess && <AccountIdentities />}
        
        <section className="mt-4">
          <ThemeSettings />
        </section>
        
        <section className="mt-4">
          <AnalyticsSettings />
        </section>
        
        <section className="mt-4">
          <AccountDeletion />
        </section>
      </article>
    </Suspense>
  )
}