import ContributorDashboardPage from "@/modules/projects/components/contributor-dashboard-page";

export default function ContributorDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    projectId: string;
  }>;
}) {
  return <ContributorDashboardPage searchParams={searchParams} />;
}
